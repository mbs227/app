from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
from datetime import datetime
import uuid

# Base Models
class PyObjectId(str):
    @classmethod
    def __get_validators__(cls):
        yield cls.validate

    @classmethod
    def validate(cls, v):
        if not isinstance(v, str):
            raise TypeError('string required')
        return v

class BaseDocument(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

    class Config:
        json_encoders = {
            datetime: lambda v: v.isoformat()
        }

# User Models
class User(BaseDocument):
    name: str
    email: str
    avatar: Optional[str] = None
    bio: Optional[str] = None
    location: Optional[str] = None
    website: Optional[str] = None
    join_date: datetime = Field(default_factory=datetime.utcnow)
    streak: int = 0
    total_goals: int = 0
    completed_goals: int = 0
    level: str = "Rising Star"

class UserCreate(BaseModel):
    name: str
    email: str
    avatar: Optional[str] = None
    bio: Optional[str] = None
    location: Optional[str] = None
    website: Optional[str] = None

class UserUpdate(BaseModel):
    name: Optional[str] = None
    email: Optional[str] = None
    avatar: Optional[str] = None
    bio: Optional[str] = None
    location: Optional[str] = None
    website: Optional[str] = None

# Goal Models
class Milestone(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    title: str
    completed: bool = False

class Goal(BaseDocument):
    user_id: str
    title: str
    description: str
    category: str
    target_date: str
    progress: int = 0
    status: str = "in-progress"  # in-progress, completed, paused
    milestones: List[Milestone] = []

class GoalCreate(BaseModel):
    title: str
    description: str
    category: str
    target_date: str
    milestones: List[Milestone] = []

class GoalUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    category: Optional[str] = None
    target_date: Optional[str] = None
    progress: Optional[int] = None
    status: Optional[str] = None
    milestones: Optional[List[Milestone]] = None

# Vision Board Models
class VisionImage(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    url: str
    title: str
    x: float
    y: float

class VisionBoard(BaseDocument):
    user_id: str
    title: str
    description: str
    images: List[VisionImage] = []
    affirmations: List[str] = []

class VisionBoardCreate(BaseModel):
    title: str
    description: str
    images: List[VisionImage] = []
    affirmations: List[str] = []

class VisionBoardUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    images: Optional[List[VisionImage]] = None
    affirmations: Optional[List[str]] = None

# Journal Models
class JournalEntry(BaseDocument):
    user_id: str
    title: str
    content: str
    mood: Optional[str] = None
    is_public: bool = False
    likes: int = 0
    comments: int = 0
    tags: List[str] = []
    manifestation_method: Optional[str] = None
    images: List[str] = []

class JournalEntryCreate(BaseModel):
    title: str
    content: str
    mood: Optional[str] = None
    is_public: bool = False
    tags: List[str] = []
    manifestation_method: Optional[str] = None
    images: List[str] = []

class JournalEntryUpdate(BaseModel):
    title: Optional[str] = None
    content: Optional[str] = None
    mood: Optional[str] = None
    is_public: Optional[bool] = None
    tags: Optional[List[str]] = None
    manifestation_method: Optional[str] = None
    images: Optional[List[str]] = None

# Affirmation Models
class Affirmation(BaseDocument):
    user_id: str
    text: str
    category: str
    frequency: str  # daily, morning, evening, weekly, as-needed
    is_active: bool = True

class AffirmationCreate(BaseModel):
    text: str
    category: str
    frequency: str = "daily"
    is_active: bool = True

class AffirmationUpdate(BaseModel):
    text: Optional[str] = None
    category: Optional[str] = None
    frequency: Optional[str] = None
    is_active: Optional[bool] = None

# Habit Models
class Habit(BaseDocument):
    user_id: str
    name: str
    description: str
    category: str
    frequency: str  # daily, weekly, monthly
    streak: int = 0
    completed_dates: List[str] = []
    target: int = 30
    progress: int = 0

class HabitCreate(BaseModel):
    name: str
    description: str
    category: str
    frequency: str = "daily"
    target: int = 30

class HabitUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    category: Optional[str] = None
    frequency: Optional[str] = None
    target: Optional[int] = None
    streak: Optional[int] = None
    completed_dates: Optional[List[str]] = None
    progress: Optional[int] = None

# Gratitude Models
class GratitudeEntry(BaseDocument):
    user_id: str
    title: str
    entries: List[str]
    mood: Optional[str] = None
    image: Optional[str] = None

class GratitudeEntryCreate(BaseModel):
    title: str
    entries: List[str]
    mood: Optional[str] = None
    image: Optional[str] = None

class GratitudeEntryUpdate(BaseModel):
    title: Optional[str] = None
    entries: Optional[List[str]] = None
    mood: Optional[str] = None
    image: Optional[str] = None

# Community Models
class Author(BaseModel):
    name: str
    avatar: Optional[str] = None
    level: str = "Rising Star"

class CommunityPost(BaseDocument):
    user_id: str
    author: Author
    title: str
    content: str
    likes: int = 0
    comments: int = 0
    shares: int = 0
    tags: List[str] = []
    images: List[str] = []
    time_ago: str = "Just now"

class CommunityPostCreate(BaseModel):
    title: str
    content: str
    tags: List[str] = []
    images: List[str] = []

class CommunityPostUpdate(BaseModel):
    title: Optional[str] = None
    content: Optional[str] = None
    tags: Optional[List[str]] = None
    images: Optional[List[str]] = None
    likes: Optional[int] = None
    comments: Optional[int] = None
    shares: Optional[int] = None

# Template Models
class TemplateStep(BaseModel):
    title: str
    description: str

class Template(BaseDocument):
    name: str
    description: str
    category: str
    duration: str
    difficulty: str  # Beginner, Intermediate, Advanced
    steps: List[str]
    example: str
    tips: List[str]
    users_count: int = 0
    rating: float = 5.0

class TemplateCreate(BaseModel):
    name: str
    description: str
    category: str
    duration: str
    difficulty: str
    steps: List[str]
    example: str
    tips: List[str]

# Template Session Models
class TemplateSession(BaseDocument):
    user_id: str
    template_id: str
    template_name: str
    current_day: int = 1
    total_days: int
    is_active: bool = True
    start_date: datetime = Field(default_factory=datetime.utcnow)
    completed_dates: List[str] = []

class TemplateSessionCreate(BaseModel):
    template_id: str
    template_name: str
    total_days: int

class TemplateSessionUpdate(BaseModel):
    current_day: Optional[int] = None
    is_active: Optional[bool] = None
    completed_dates: Optional[List[str]] = None

# Response Models
class ApiResponse(BaseModel):
    success: bool
    message: str
    data: Optional[Any] = None

class StatsResponse(BaseModel):
    total_users: int
    goals_achieved: int
    affirmations_completed: int
    community_posts: int
    success_stories: int