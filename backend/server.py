from fastapi import FastAPI, APIRouter, HTTPException, Depends, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, EmailStr
from typing import List, Optional
import uuid
from datetime import datetime, timedelta
from passlib.context import CryptContext
import jwt
from email_validator import validate_email, EmailNotValidError


ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Create the main app without a prefix
app = FastAPI(title="Manifest 12 API", description="12-Week Goal Manifestation Platform")

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")

# Security configuration
SECRET_KEY = os.environ.get('SECRET_KEY', 'your-secret-key-here-change-in-production')
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60 * 24 * 7  # 7 days

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
security = HTTPBearer()

# Authentication Models
class UserCreate(BaseModel):
    email: EmailStr
    password: str
    full_name: str
    
class UserLogin(BaseModel):
    email: EmailStr
    password: str

class User(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    email: str
    full_name: str
    is_active: bool = True
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

class UserResponse(BaseModel):
    id: str
    email: str
    full_name: str
    is_active: bool
    created_at: datetime

class Token(BaseModel):
    access_token: str
    token_type: str
    user: UserResponse

# 12-Week Cycle Models
class CycleCreate(BaseModel):
    title: str
    description: str
    law_of_attraction_statement: str
    start_date: datetime = Field(default_factory=datetime.utcnow)

class Cycle(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    user_id: str
    title: str
    description: str
    start_date: datetime
    end_date: datetime
    status: str = "active"  # active, completed, paused, archived
    current_week: int = 1
    law_of_attraction_statement: str
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

# Goal Models
class Milestone(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    title: str
    completed: bool = False
    completed_date: Optional[datetime] = None

class GoalCreate(BaseModel):
    title: str
    description: str
    category: str
    start_week: int = 1
    target_week: int = 12
    why_statement: str  # Law of Attraction "why"
    visualization_note: str  # Neville Goddard visualization
    milestones: List[Milestone] = []

class Goal(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    cycle_id: str
    user_id: str
    title: str
    description: str
    category: str
    start_week: int = 1
    target_week: int = 12
    progress: int = 0  # 0-100
    status: str = "not_started"  # not_started, in_progress, completed, on_hold
    why_statement: str  # Law of Attraction
    visualization_note: str  # Neville Goddard
    milestones: List[Milestone] = []
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

class GoalUpdate(BaseModel):
    progress: Optional[int] = None
    status: Optional[str] = None
    milestones: Optional[List[Milestone]] = None

# Weekly Reflection Models  
class WeeklyReflectionCreate(BaseModel):
    cycle_id: str
    week_number: int
    progress_review: str
    law_of_attraction_manifestations: List[str] = []
    neville_goddard_practice: str
    challenges: str
    insights: str
    next_week_focus: List[str] = []
    mood_rating: int = 5  # 1-10 scale

class WeeklyReflection(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    cycle_id: str
    user_id: str
    week_number: int
    week_start_date: datetime
    progress_review: str
    law_of_attraction_manifestations: List[str] = []
    neville_goddard_practice: str
    challenges: str
    insights: str
    next_week_focus: List[str] = []
    mood_rating: int = 5
    created_at: datetime = Field(default_factory=datetime.utcnow)

# Enhanced Cycle Models
class CycleUpdate(BaseModel):
    current_week: Optional[int] = None
    status: Optional[str] = None
    law_of_attraction_statement: Optional[str] = None
class StatusCheck(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    client_name: str
    timestamp: datetime = Field(default_factory=datetime.utcnow)

class StatusCheckCreate(BaseModel):
    client_name: str

# Authentication helper functions
def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password):
    return pwd_context.hash(password)

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

async def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        token = credentials.credentials
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id: str = payload.get("sub")
        if user_id is None:
            raise credentials_exception
    except jwt.PyJWTError:
        raise credentials_exception
    
    user = await db.users.find_one({"id": user_id})
    if user is None:
        raise credentials_exception
    return User(**user)

# Authentication Routes
@api_router.post("/auth/register", response_model=Token)
async def register(user_data: UserCreate):
    # Check if user already exists
    existing_user = await db.users.find_one({"email": user_data.email})
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )
    
    # Create new user
    hashed_password = get_password_hash(user_data.password)
    user = User(
        email=user_data.email,
        full_name=user_data.full_name
    )
    
    user_dict = user.dict()
    user_dict["password_hash"] = hashed_password
    
    await db.users.insert_one(user_dict)
    
    # Create access token
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.id}, expires_delta=access_token_expires
    )
    
    return Token(
        access_token=access_token,
        token_type="bearer",
        user=UserResponse(**user.dict())
    )

@api_router.post("/auth/login", response_model=Token)
async def login(user_data: UserLogin):
    user = await db.users.find_one({"email": user_data.email})
    if not user or not verify_password(user_data.password, user["password_hash"]):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user["id"]}, expires_delta=access_token_expires
    )
    
    user_response = UserResponse(**user)
    return Token(
        access_token=access_token,
        token_type="bearer",
        user=user_response
    )

@api_router.get("/auth/me", response_model=UserResponse)
async def get_current_user_info(current_user: User = Depends(get_current_user)):
    return UserResponse(**current_user.dict())

# Cycle Management Routes
@api_router.post("/cycles", response_model=Cycle)
async def create_cycle(cycle_data: CycleCreate, current_user: User = Depends(get_current_user)):
    cycle = Cycle(
        user_id=current_user.id,
        title=cycle_data.title,
        description=cycle_data.description,
        start_date=cycle_data.start_date,
        end_date=cycle_data.start_date + timedelta(weeks=12),
        law_of_attraction_statement=cycle_data.law_of_attraction_statement
    )
    
    await db.cycles.insert_one(cycle.dict())
    return cycle

@api_router.get("/cycles", response_model=List[Cycle])
async def get_user_cycles(current_user: User = Depends(get_current_user)):
    cycles = await db.cycles.find({"user_id": current_user.id}).to_list(1000)
    return [Cycle(**cycle) for cycle in cycles]

@api_router.get("/cycles/{cycle_id}", response_model=Cycle)
async def get_cycle(cycle_id: str, current_user: User = Depends(get_current_user)):
    cycle = await db.cycles.find_one({"id": cycle_id, "user_id": current_user.id})
    if not cycle:
        raise HTTPException(status_code=404, detail="Cycle not found")
    return Cycle(**cycle)

@api_router.put("/cycles/{cycle_id}", response_model=Cycle)
async def update_cycle(cycle_id: str, cycle_update: CycleUpdate, current_user: User = Depends(get_current_user)):
    cycle = await db.cycles.find_one({"id": cycle_id, "user_id": current_user.id})
    if not cycle:
        raise HTTPException(status_code=404, detail="Cycle not found")
    
    update_data = cycle_update.dict(exclude_unset=True)
    update_data["updated_at"] = datetime.utcnow()
    
    await db.cycles.update_one(
        {"id": cycle_id, "user_id": current_user.id},
        {"$set": update_data}
    )
    
    updated_cycle = await db.cycles.find_one({"id": cycle_id, "user_id": current_user.id})
    return Cycle(**updated_cycle)

# Goal Management Routes
@api_router.post("/goals", response_model=Goal)
async def create_goal(goal_data: GoalCreate, current_user: User = Depends(get_current_user)):
    # Verify cycle belongs to user
    cycle = await db.cycles.find_one({"id": goal_data.cycle_id, "user_id": current_user.id})
    if not cycle:
        raise HTTPException(status_code=404, detail="Cycle not found")
    
    goal = Goal(
        cycle_id=goal_data.cycle_id,
        user_id=current_user.id,
        title=goal_data.title,
        description=goal_data.description,
        category=goal_data.category,
        start_week=goal_data.start_week,
        target_week=goal_data.target_week,
        why_statement=goal_data.why_statement,
        visualization_note=goal_data.visualization_note,
        milestones=goal_data.milestones
    )
    
    await db.goals.insert_one(goal.dict())
    return goal

@api_router.get("/goals", response_model=List[Goal])
async def get_user_goals(cycle_id: str = None, current_user: User = Depends(get_current_user)):
    query = {"user_id": current_user.id}
    if cycle_id:
        query["cycle_id"] = cycle_id
    
    goals = await db.goals.find(query).to_list(1000)
    return [Goal(**goal) for goal in goals]

@api_router.get("/goals/{goal_id}", response_model=Goal)
async def get_goal(goal_id: str, current_user: User = Depends(get_current_user)):
    goal = await db.goals.find_one({"id": goal_id, "user_id": current_user.id})
    if not goal:
        raise HTTPException(status_code=404, detail="Goal not found")
    return Goal(**goal)

@api_router.put("/goals/{goal_id}", response_model=Goal)
async def update_goal(goal_id: str, goal_update: GoalUpdate, current_user: User = Depends(get_current_user)):
    goal = await db.goals.find_one({"id": goal_id, "user_id": current_user.id})
    if not goal:
        raise HTTPException(status_code=404, detail="Goal not found")
    
    update_data = goal_update.dict(exclude_unset=True)
    update_data["updated_at"] = datetime.utcnow()
    
    await db.goals.update_one(
        {"id": goal_id, "user_id": current_user.id},
        {"$set": update_data}
    )
    
    updated_goal = await db.goals.find_one({"id": goal_id, "user_id": current_user.id})
    return Goal(**updated_goal)

# Weekly Reflection Routes
@api_router.post("/reflections", response_model=WeeklyReflection)
async def create_reflection(reflection_data: WeeklyReflectionCreate, current_user: User = Depends(get_current_user)):
    # Verify cycle belongs to user
    cycle = await db.cycles.find_one({"id": reflection_data.cycle_id, "user_id": current_user.id})
    if not cycle:
        raise HTTPException(status_code=404, detail="Cycle not found")
    
    # Calculate week start date based on cycle start date and week number
    cycle_start = cycle["start_date"]
    week_start_date = cycle_start + timedelta(weeks=reflection_data.week_number - 1)
    
    reflection = WeeklyReflection(
        cycle_id=reflection_data.cycle_id,
        user_id=current_user.id,
        week_number=reflection_data.week_number,
        week_start_date=week_start_date,
        progress_review=reflection_data.progress_review,
        law_of_attraction_manifestations=reflection_data.law_of_attraction_manifestations,
        neville_goddard_practice=reflection_data.neville_goddard_practice,
        challenges=reflection_data.challenges,
        insights=reflection_data.insights,
        next_week_focus=reflection_data.next_week_focus,
        mood_rating=reflection_data.mood_rating
    )
    
    await db.reflections.insert_one(reflection.dict())
    return reflection

@api_router.get("/reflections", response_model=List[WeeklyReflection])
async def get_reflections(cycle_id: str = None, current_user: User = Depends(get_current_user)):
    query = {"user_id": current_user.id}
    if cycle_id:
        query["cycle_id"] = cycle_id
    
    reflections = await db.reflections.find(query).sort("week_number", 1).to_list(1000)
    return [WeeklyReflection(**reflection) for reflection in reflections]

@api_router.get("/reflections/{reflection_id}", response_model=WeeklyReflection)
async def get_reflection(reflection_id: str, current_user: User = Depends(get_current_user)):
    reflection = await db.reflections.find_one({"id": reflection_id, "user_id": current_user.id})
    if not reflection:
        raise HTTPException(status_code=404, detail="Reflection not found")
    return WeeklyReflection(**reflection)

# Legacy Routes (keeping for backward compatibility)
@api_router.get("/")
async def root():
    return {"message": "Manifest 12 API - Transform Your Life in 12 Weeks"}

@api_router.post("/status", response_model=StatusCheck)
async def create_status_check(input: StatusCheckCreate):
    status_dict = input.dict()
    status_obj = StatusCheck(**status_dict)
    _ = await db.status_checks.insert_one(status_obj.dict())
    return status_obj

@api_router.get("/status", response_model=List[StatusCheck])
async def get_status_checks():
    status_checks = await db.status_checks.find().to_list(1000)
    return [StatusCheck(**status_check) for status_check in status_checks]

# Include the router in the main app
app.include_router(api_router)

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

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
