from fastapi import FastAPI, APIRouter, HTTPException, Depends, status
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from dotenv import load_dotenv
import os
import logging
from pathlib import Path

# Import our modules
from backend.database import database
from backend.models import *
from backend.utils import *

# Load environment variables
ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# Database lifecycle
@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    await database.connect()
    yield
    # Shutdown
    await database.disconnect()

# Create the main app
app = FastAPI(lifespan=lifespan)

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# Helper function to get current user (simplified for MVP)
async def get_current_user() -> str:
    """Get current user ID - simplified for MVP"""
    # In a real app, this would validate JWT tokens
    # For now, we'll use a default user
    return "default_user_123"

# Basic routes
@api_router.get("/")
async def root():
    return {"message": "ManifestLife API is running!"}

@api_router.get("/health")
async def health_check():
    return {"status": "healthy", "timestamp": datetime.utcnow()}

# User routes
@api_router.post("/users", response_model=User)
async def create_user(user_data: UserCreate):
    """Create a new user"""
    try:
        # Check if user already exists
        existing_user = await database.get_user_by_email(user_data.email)
        if existing_user:
            raise HTTPException(status_code=400, detail="User already exists")
        
        # Create user document
        user_dict = user_data.dict()
        user_dict['id'] = str(uuid.uuid4())
        
        await database.create_document("users", user_dict)
        
        # Return created user
        created_user = await database.get_document("users", user_dict['id'])
        return format_document_for_response(created_user)
    
    except Exception as e:
        logger.error(f"Error creating user: {e}")
        raise HTTPException(status_code=500, detail="Failed to create user")

@api_router.get("/users/me", response_model=User)
async def get_current_user_profile(current_user: str = Depends(get_current_user)):
    """Get current user profile"""
    try:
        user = await database.get_document("users", current_user)
        if not user:
            # Create default user if doesn't exist
            default_user = {
                'id': current_user,
                'name': 'Sarah Johnson',
                'email': 'sarah@example.com',
                'bio': 'Passionate manifestor on a journey to create my dream life.',
                'location': 'San Francisco, CA',
                'website': 'sarahjohnson.co',
                'avatar': '/api/placeholder/150/150'
            }
            await database.create_document("users", default_user)
            user = default_user
        
        # Update user stats
        stats = await database.get_user_stats(current_user)
        user = update_user_stats(user, stats)
        
        return format_document_for_response(user)
    
    except Exception as e:
        logger.error(f"Error getting user profile: {e}")
        raise HTTPException(status_code=500, detail="Failed to get user profile")

@api_router.put("/users/me", response_model=User)
async def update_user_profile(
    user_data: UserUpdate, 
    current_user: str = Depends(get_current_user)
):
    """Update current user profile"""
    try:
        update_dict = {k: v for k, v in user_data.dict().items() if v is not None}
        
        if not update_dict:
            raise HTTPException(status_code=400, detail="No data to update")
        
        success = await database.update_document("users", current_user, update_dict)
        if not success:
            raise HTTPException(status_code=404, detail="User not found")
        
        updated_user = await database.get_document("users", current_user)
        return format_document_for_response(updated_user)
    
    except Exception as e:
        logger.error(f"Error updating user profile: {e}")
        raise HTTPException(status_code=500, detail="Failed to update user profile")

# Goal routes
@api_router.post("/goals", response_model=Goal)
async def create_goal(goal_data: GoalCreate, current_user: str = Depends(get_current_user)):
    """Create a new goal"""
    try:
        goal_dict = goal_data.dict()
        goal_dict['id'] = str(uuid.uuid4())
        goal_dict['user_id'] = current_user
        
        await database.create_document("goals", goal_dict)
        
        created_goal = await database.get_document("goals", goal_dict['id'])
        return format_document_for_response(created_goal)
    
    except Exception as e:
        logger.error(f"Error creating goal: {e}")
        raise HTTPException(status_code=500, detail="Failed to create goal")

@api_router.get("/goals", response_model=List[Goal])
async def get_goals(current_user: str = Depends(get_current_user)):
    """Get all goals for current user"""
    try:
        goals = await database.get_user_documents("goals", current_user)
        return [format_document_for_response(goal) for goal in goals]
    
    except Exception as e:
        logger.error(f"Error getting goals: {e}")
        raise HTTPException(status_code=500, detail="Failed to get goals")

@api_router.get("/goals/{goal_id}", response_model=Goal)
async def get_goal(goal_id: str, current_user: str = Depends(get_current_user)):
    """Get a specific goal"""
    try:
        goal = await database.get_document("goals", goal_id)
        if not goal or goal.get('user_id') != current_user:
            raise HTTPException(status_code=404, detail="Goal not found")
        
        return format_document_for_response(goal)
    
    except Exception as e:
        logger.error(f"Error getting goal: {e}")
        raise HTTPException(status_code=500, detail="Failed to get goal")

@api_router.put("/goals/{goal_id}", response_model=Goal)
async def update_goal(
    goal_id: str, 
    goal_data: GoalUpdate, 
    current_user: str = Depends(get_current_user)
):
    """Update a goal"""
    try:
        # Verify ownership
        goal = await database.get_document("goals", goal_id)
        if not goal or goal.get('user_id') != current_user:
            raise HTTPException(status_code=404, detail="Goal not found")
        
        update_dict = {k: v for k, v in goal_data.dict().items() if v is not None}
        
        if 'progress' in update_dict:
            update_dict['progress'] = validate_goal_progress(update_dict['progress'])
            if update_dict['progress'] == 100:
                update_dict['status'] = 'completed'
        
        success = await database.update_document("goals", goal_id, update_dict)
        if not success:
            raise HTTPException(status_code=404, detail="Goal not found")
        
        updated_goal = await database.get_document("goals", goal_id)
        return format_document_for_response(updated_goal)
    
    except Exception as e:
        logger.error(f"Error updating goal: {e}")
        raise HTTPException(status_code=500, detail="Failed to update goal")

@api_router.delete("/goals/{goal_id}")
async def delete_goal(goal_id: str, current_user: str = Depends(get_current_user)):
    """Delete a goal"""
    try:
        goal = await database.get_document("goals", goal_id)
        if not goal or goal.get('user_id') != current_user:
            raise HTTPException(status_code=404, detail="Goal not found")
        
        success = await database.delete_document("goals", goal_id)
        if not success:
            raise HTTPException(status_code=404, detail="Goal not found")
        
        return {"message": "Goal deleted successfully"}
    
    except Exception as e:
        logger.error(f"Error deleting goal: {e}")
        raise HTTPException(status_code=500, detail="Failed to delete goal")

# Import additional routes
from routes import get_additional_routes
from routes_community import get_community_routes

# Add additional routes to the API router
additional_routes = get_additional_routes(get_current_user)
community_routes = get_community_routes(get_current_user)

api_router.include_router(additional_routes)
api_router.include_router(community_routes)

# Include the router in the main app
app.include_router(api_router)