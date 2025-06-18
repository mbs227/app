from datetime import datetime, timedelta
from typing import List, Dict, Any
import base64
import uuid
import os

def calculate_time_ago(created_at: datetime) -> str:
    """Calculate human-readable time difference"""
    now = datetime.utcnow()
    diff = now - created_at
    
    if diff.days > 0:
        if diff.days == 1:
            return "1 day ago"
        return f"{diff.days} days ago"
    
    hours = diff.seconds // 3600
    if hours > 0:
        if hours == 1:
            return "1 hour ago"
        return f"{hours} hours ago"
    
    minutes = diff.seconds // 60
    if minutes > 0:
        if minutes == 1:
            return "1 minute ago"
        return f"{minutes} minutes ago"
    
    return "Just now"

def calculate_streak(completed_dates: List[str]) -> int:
    """Calculate current streak from completed dates"""
    if not completed_dates:
        return 0
    
    # Sort dates in descending order
    sorted_dates = sorted(completed_dates, reverse=True)
    today = datetime.utcnow().date()
    
    streak = 0
    current_date = today
    
    for date_str in sorted_dates:
        try:
            date = datetime.strptime(date_str, "%Y-%m-%d").date()
            if date == current_date:
                streak += 1
                current_date -= timedelta(days=1)
            elif date == current_date + timedelta(days=1):
                # Allow for today not being completed yet
                continue
            else:
                break
        except ValueError:
            continue
    
    return streak

def calculate_habit_progress(completed_dates: List[str], target: int) -> int:
    """Calculate habit progress percentage"""
    if target == 0:
        return 0
    
    completed_count = len(completed_dates)
    progress = min(100, (completed_count / target) * 100)
    return round(progress)

def get_user_level(total_goals: int, completed_goals: int, max_streak: int) -> str:
    """Determine user level based on achievements"""
    score = completed_goals * 10 + max_streak * 2 + total_goals
    
    if score >= 100:
        return "Manifestation Master"
    elif score >= 50:
        return "Vision Keeper"
    else:
        return "Rising Star"

def save_base64_image(base64_data: str, folder: str = "uploads") -> str:
    """Save base64 image to file and return filename"""
    try:
        # Create uploads directory if it doesn't exist
        os.makedirs(folder, exist_ok=True)
        
        # Parse base64 data
        if ',' in base64_data:
            header, data = base64_data.split(',', 1)
        else:
            data = base64_data
        
        # Generate unique filename
        filename = f"{uuid.uuid4()}.jpg"
        filepath = os.path.join(folder, filename)
        
        # Decode and save
        image_data = base64.b64decode(data)
        with open(filepath, 'wb') as f:
            f.write(image_data)
        
        return filepath
    except Exception as e:
        print(f"Error saving image: {e}")
        return ""

def format_document_for_response(doc: Dict[str, Any]) -> Dict[str, Any]:
    """Format document for API response"""
    if doc is None:
        return None
    
    # Remove MongoDB _id field
    if '_id' in doc:
        del doc['_id']
    
    # Format datetime fields
    for field in ['created_at', 'updated_at', 'join_date', 'start_date']:
        if field in doc and isinstance(doc[field], datetime):
            doc[field] = doc[field].isoformat()
    
    return doc

def validate_email(email: str) -> bool:
    """Basic email validation"""
    import re
    pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
    return re.match(pattern, email) is not None

def generate_mock_achievements(user_stats: Dict[str, Any]) -> List[Dict[str, Any]]:
    """Generate user achievements based on stats"""
    achievements = []
    
    # First Goal achievement
    achievements.append({
        "name": "First Goal",
        "description": "Created your first goal",
        "achieved": user_stats.get("total_goals", 0) >= 1,
        "icon": "Target"
    })
    
    # Week Warrior achievement
    achievements.append({
        "name": "Week Warrior",
        "description": "7-day streak achieved",
        "achieved": user_stats.get("max_streak", 0) >= 7,
        "icon": "Flame"
    })
    
    # Goal Crusher achievement
    achievements.append({
        "name": "Goal Crusher",
        "description": "Completed 5 goals",
        "achieved": user_stats.get("completed_goals", 0) >= 5,
        "icon": "Award"
    })
    
    # Journaler achievement
    achievements.append({
        "name": "Journaler",
        "description": "Written 10 journal entries",
        "achieved": user_stats.get("total_journal_entries", 0) >= 10,
        "icon": "BookOpen"
    })
    
    # Habit Master achievement
    achievements.append({
        "name": "Habit Master",
        "description": "21-day streak achieved",
        "achieved": user_stats.get("max_streak", 0) >= 21,
        "icon": "Star"
    })
    
    # Community Star achievement (placeholder)
    achievements.append({
        "name": "Community Star",
        "description": "Shared 5 public posts",
        "achieved": False,  # Will implement when we have community post counts
        "icon": "Heart"
    })
    
    return achievements

def update_user_stats(user_doc: Dict[str, Any], stats: Dict[str, Any]) -> Dict[str, Any]:
    """Update user document with latest stats"""
    user_doc['total_goals'] = stats.get('total_goals', 0)
    user_doc['completed_goals'] = stats.get('completed_goals', 0)
    user_doc['streak'] = stats.get('max_streak', 0)
    user_doc['level'] = get_user_level(
        stats.get('total_goals', 0),
        stats.get('completed_goals', 0),
        stats.get('max_streak', 0)
    )
    return user_doc

def validate_goal_progress(progress: int) -> int:
    """Validate and normalize goal progress"""
    return max(0, min(100, progress))

def validate_date_string(date_str: str) -> bool:
    """Validate date string format YYYY-MM-DD"""
    try:
        datetime.strptime(date_str, "%Y-%m-%d")
        return True
    except ValueError:
        return False

def filter_public_posts(posts: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
    """Filter posts to only include public ones"""
    return [post for post in posts if post.get('is_public', True)]

def calculate_goal_completion_rate(goals: List[Dict[str, Any]]) -> float:
    """Calculate goal completion rate"""
    if not goals:
        return 0.0
    
    completed = sum(1 for goal in goals if goal.get('status') == 'completed')
    return (completed / len(goals)) * 100

def calculate_average_goal_progress(goals: List[Dict[str, Any]]) -> float:
    """Calculate average progress across all goals"""
    if not goals:
        return 0.0
    
    total_progress = sum(goal.get('progress', 0) for goal in goals)
    return total_progress / len(goals)

def get_recent_activity(user_id: str, activities: List[Dict[str, Any]], limit: int = 10) -> List[Dict[str, Any]]:
    """Get recent activity for a user"""
    # This would be implemented with proper activity tracking
    # For now, return mock data structure
    return activities[:limit]