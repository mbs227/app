from fastapi import FastAPI, APIRouter, HTTPException, Depends, status, Request, Query
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordBearer
from contextlib import asynccontextmanager
from pydantic import BaseModel
from pydantic_settings import BaseSettings
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from jose import JWTError, jwt
from datetime import datetime
from typing import List, Optional
from pathlib import Path
import logging
import os
import json
import aioredis
import uuid

# Import our modules
from backend.database import database
from backend.models import *
from backend.utils import *
from backend.constants import COLLECTIONS

# Environment configuration
class Settings(BaseSettings):
    database_url: str
    secret_key: str
    allowed_origins: str = "http://localhost:3000,https://your-frontend.com"
    redis_url: str = "redis://localhost"
    environment: str = "production"

    class Config:
        env_file = Path(__file__).parent / ".env"

settings = Settings()

# Redis client
redis = None

# Database lifecycle
@asynccontextmanager
async def lifespan(app: FastAPI):
    global redis
    redis = await aioredis.from_url(settings.redis_url)
    await database.connect()
    await database.create_index(COLLECTIONS["USERS"], "email", unique=True)
    await database.create_index(COLLECTIONS["GOALS"], "user_id")
    yield
    await redis.close()
    await database.disconnect()

# FastAPI app
app = FastAPI(
    lifespan=lifespan,
    title="ManifestLife API",
    description="API for managing user profiles and goals",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

# Rate limiting
limiter = Limiter(key_func=get_remote_address)
app.state.limiter = limiter
app.add_exception_handler(429, _rate_limit_exceeded_handler)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.allowed_origins.split(","),
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["Authorization", "Content-Type"],
)

# Logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s"
)
logger = logging.getLogger(__name__)

# Error response model
class ErrorResponse(BaseModel):
    detail: str
    code: str | None = None
    timestamp: datetime = datetime.utcnow()

# Authentication
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/v1/token")

async def get_current_user(token: str = Depends(oauth2_scheme)) -> str:
    """
    Get current user ID from JWT token.

    Args:
        token (str): JWT token from Authorization header.

    Returns:
        str: User ID.

    Raises:
        HTTPException: If token is invalid or user not found.
    """
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, settings.secret_key, algorithms=["HS256"])
        email: str = payload.get("sub")
        if email is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception
    user = await database.get_user_by_email(email)
    if user is None:
        raise credentials_exception
    return user["id"]

# Database dependency
async def get_database():
    return database

# Routes
api_router = APIRouter(prefix="/api/v1")

@api_router.get("/")
@limiter.limit("10/minute")
async def root(request: Request):
    """Root endpoint to check API status."""
    return {"message": "ManifestLife API is running!"}

@api_router.get("/health")
@limiter.limit("10/minute")
async def health_check(request: Request):
    """Health check endpoint."""
    return {"status": "healthy", "timestamp": datetime.utcnow()}

# Caching decorator
def cache(key_prefix: str, ttl: int = 300):
    def decorator(func):
        async def wrapper(*args, **kwargs):
            cache_key = f"{key_prefix}:{kwargs.get('current_user')}"
            cached = await redis.get(cache_key)
            if cached:
                return json.loads(cached)
            result = await func(*args, **kwargs)
            await redis.set(cache_key, json.dumps(result), ex=ttl)
            return result
        return wrapper
    return decorator

# User routes
@api_router.post("/users", response_model=User, responses={400: {"model": ErrorResponse}})
@limiter.limit("5/minute")
async def create_user(user_data: UserCreate, request: Request, db=Depends(get_database)):
    """
    Create a new user.

    Args:
        user_data (UserCreate): User data including email and other fields.
        request (Request): FastAPI request object.
        db: Database dependency.

    Returns:
        User: Created user object.

    Raises:
        HTTPException: If user exists (400), database unavailable (503), or other errors (500).
    """
    try:
        existing_user = await db.get_user_by_email(user_data.email)
        if existing_user:
            raise HTTPException(status_code=400, detail="User already exists")
        
        user_dict = user_data.dict()
        user_dict["id"] = str(uuid.uuid4())
        await db.create_document(COLLECTIONS["USERS"], user_dict)
        created_user = await db.get_document(COLLECTIONS["USERS"], user_dict["id"])
        return format_document_for_response(created_user)
    
    except MongoConnectionError as e:
        logger.error(f"Database connection error: {e}")
        raise HTTPException(status_code=503, detail="Database unavailable")
    except Exception as e:
        logger.error(f"Unexpected error creating user: {e}")
        raise HTTPException(status_code=500, detail="Internal server error")

@api_router.get("/users/me", response_model=User, responses={404: {"model": ErrorResponse}})
@cache(key_prefix="user_profile")
async def get_current_user_profile(current_user: str = Depends(get_current_user), db=Depends(get_database)):
    """
    Get current user profile.

    Args:
        current_user (str): ID of the authenticated user.
        db: Database dependency.

    Returns:
        User: User profile with stats.

    Raises:
        HTTPException: If user not found (404) or error occurs (500).
    """
    try:
        user = await db.get_document(COLLECTIONS["USERS"], current_user)
        if not user:
            raise HTTPException(status_code=404, detail="User not found")
        
        stats = await db.get_user_stats(current_user)
        user = update_user_stats(user, stats)
        return format_document_for_response(user)
    
    except MongoConnectionError as e:
        logger.error(f"Database connection error: {e}")
        raise HTTPException(status_code=503, detail="Database unavailable")
    except Exception as e:
        logger.error(f"Error getting user profile: {e}")
        raise HTTPException(status_code=500, detail="Internal server error")

@api_router.put("/users/me", response_model=User, responses={400: {"model": ErrorResponse}, 404: {"model": ErrorResponse}})
async def update_user_profile(
    user_data: UserUpdate, 
    current_user: str = Depends(get_current_user), 
    db=Depends(get_database)
):
    """
    Update current user profile.

    Args:
        user_data (UserUpdate): Data to update.
        current_user (str): ID of the authenticated user.
        db: Database dependency.

    Returns:
        User: Updated user object.

    Raises:
        HTTPException: If no data to update (400), user not found (404), or error occurs (500).
    """
    try:
        update_dict = {k: v for k, v in user_data.dict().items() if v is not None}
        if not update_dict:
            raise HTTPException(status_code=400, detail="No data to update")
        
        success = await db.update_document(COLLECTIONS["USERS"], current_user, update_dict)
        if not success:
            raise HTTPException(status_code=404, detail="User not found")
        
        updated_user = await db.get_document(COLLECTIONS["USERS"], current_user)
        return format_document_for_response(updated_user)
    
    except MongoConnectionError as e:
        logger.error(f"Database connection error: {e}")
        raise HTTPException(status_code=503, detail="Database unavailable")
    except Exception as e:
        logger.error(f"Error updating user profile: {e}")
        raise HTTPException(status_code=500, detail="Internal server error")

# Goal routes
@api_router.post("/goals", response_model=Goal, responses={500: {"model": ErrorResponse}})
async def create_goal(goal_data: GoalCreate, current_user: str = Depends(get_current_user), db=Depends(get_database)):
    """
    Create a new goal.

    Args:
        goal_data (GoalCreate): Goal data.
        current_user (str): ID of the authenticated user.
        db: Database dependency.

    Returns:
        Goal: Created goal object.

    Raises:
        HTTPException: If error occurs (500).
    """
    try:
        goal_dict = goal_data.dict()
        goal_dict["id"] = str(uuid.uuid4())
        goal_dict["user_id"] = current_user
        await db.create_document(COLLECTIONS["GOALS"], goal_dict)
        created_goal = await db.get_document(COLLECTIONS["GOALS"], goal_dict["id"])
        return format_document_for_response(created_goal)
    
    except MongoConnectionError as e:
        logger.error(f"Database connection error: {e}")
        raise HTTPException(status_code=503, detail="Database unavailable")
    except Exception as e:
        logger.error(f"Error creating goal: {e}")
        raise HTTPException(status_code=500, detail="Internal server error")

@api_router.get("/goals", response_model=List[Goal], responses={500: {"model": ErrorResponse}})
async def get_goals(
    current_user: str = Depends(get_current_user), 
    db=Depends(get_database),
    skip: int = Query(0, ge=0),
    limit: int = Query(10, ge=1, le=100)
):
    """
    Get all goals for current user.

    Args:
        current_user (str): ID of the authenticated user.
        db: Database dependency.
        skip (int): Number of records to skip.
        limit (int): Maximum number of records to return.

    Returns:
        List[Goal]: List of user goals.

    Raises:
        HTTPException: If error occurs (500).
    """
    try:
        goals = await db.get_user_documents(COLLECTIONS["GOALS"], current_user, skip=skip, limit=limit)
        return [format_document_for_response(goal) for goal in goals]
    
    except MongoConnectionError as e:
        logger.error(f"Database connection error: {e}")
        raise HTTPException(status_code=503, detail="Database unavailable")
    except Exception as e:
        logger.error(f"Error getting goals: {e}")
        raise HTTPException(status_code=500, detail="Internal server error")

@api_router.get("/goals/{goal_id}", response_model=Goal, responses={404: {"model": ErrorResponse}, 500: {"model": ErrorResponse}})
async def get_goal(goal_id: str, current_user: str = Depends(get_current_user), db=Depends(get_database)):
    """
    Get a specific goal.

    Args:
        goal_id (str): ID of the goal.
        current_user (str): ID of the authenticated user.
        db: Database dependency.

    Returns:
        Goal: Goal object.

    Raises:
        HTTPException: If goal not found (404) or error occurs (500).
    """
    try:
        goal = await db.get_document(COLLECTIONS["GOALS"], goal_id)
        if not goal or goal.get("user_id") != current_user:
            raise HTTPException(status_code=404, detail="Goal not found")
        return format_document_for_response(goal)
    
    except MongoConnectionError as e:
        logger.error(f"Database connection error: {e}")
        raise HTTPException(status_code=503, detail="Database unavailable")
    except Exception as e:
        logger.error(f"Error getting goal: {e}")
        raise HTTPException(status_code=500, detail="Internal server error")

@api_router.put("/goals/{goal_id}", response_model=Goal, responses={404: {"model": ErrorResponse}, 500: {"model": ErrorResponse}})
async def update_goal(
    goal_id: str, 
    goal_data: GoalUpdate, 
    current_user: str = Depends(get_current_user), 
    db=Depends(get_database)
):
    """
    Update a goal.

    Args:
        goal_id (str): ID of the goal.
        goal_data (GoalUpdate): Data to update.
        current_user (str): ID of the authenticated user.
        db: Database dependency.

    Returns:
        Goal: Updated goal object.

    Raises:
        HTTPException: If goal not found (404) or error occurs (500).
    """
    try:
        goal = await db.get_document(COLLECTIONS["GOALS"], goal_id)
        if not goal or goal.get("user_id") != current_user:
            raise HTTPException(status_code=404, detail="Goal not found")
        
        update_dict = {k: v for k, v in goal_data.dict().items() if v is not None}
        if "progress" in update_dict:
            update_dict["progress"] = validate_goal_progress(update_dict["progress"])
            if update_dict["progress"] == 100:
                update_dict["status"] = "completed"
        
        success = await db.update_document(COLLECTIONS["GOALS"], goal_id, update_dict)
        if not success:
            raise HTTPException(status_code=404, detail="Goal not found")
        
        updated_goal = await db.get_document(COLLECTIONS["GOALS"], goal_id)
        return format_document_for_response(updated_goal)
    
    except MongoConnectionError as e:
        logger.error(f"Database connection error: {e}")
        raise HTTPException(status_code=503, detail="Database unavailable")
    except Exception as e:
        logger.error(f"Error updating goal: {e}")
        raise HTTPException(status_code=500, detail="Internal server error")

@api_router.delete("/goals/{goal_id}", responses={404: {"model": ErrorResponse}, 500: {"model": ErrorResponse}})
async def delete_goal(goal_id: str, current_user: str = Depends(get_current_user), db=Depends(get_database)):
    """
    Delete a goal.

    Args:
        goal_id (str): ID of the goal.
        current_user (str): ID of the authenticated user.
        db: Database dependency.

    Returns:
        dict: Success message.

    Raises:
        HTTPException: If goal not found (404) or error occurs (500).
    """
    try:
        goal = await db.get_document(COLLECTIONS["GOALS"], goal_id)
        if not goal or goal.get("user_id") != current_user:
            raise HTTPException(status_code=404, detail="Goal not found")
        
        success = await db.delete_document(COLLECTIONS["GOALS"], goal_id)
        if not success:
            raise HTTPException(status_code=404, detail="Goal not found")
        
        return {"message": "Goal deleted successfully"}
    
    except MongoConnectionError as e:
        logger.error(f"Database connection error: {e}")
        raise HTTPException(status_code=503, detail="Database unavailable")
    except Exception as e:
        logger.error(f"Error deleting goal: {e}")
        raise HTTPException(status_code=500, detail="Internal server error")

# Test endpoint (development only)
if settings.environment == "development":
    @api_router.get("/test/reset")
    async def reset_database(db=Depends(get_database)):
        """
        Reset database for testing (development only).

        Args:
            db: Database dependency.

        Returns:
            dict: Success message.
        """
        await db.drop_collection(COLLECTIONS["USERS"])
        await db.drop_collection(COLLECTIONS["GOALS"])
        return {"message": "Database reset"}

# Include additional routes
from backend.routes import get_additional_routes
from backend.routes_community import get_community_routes

api_router.include_router(get_additional_routes(get_current_user))
api_router.include_router(get_community_routes(get_current_user))
app.include_router(api_router)
