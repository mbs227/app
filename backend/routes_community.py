# Community and additional routes for ManifestLife backend
from fastapi import APIRouter, HTTPException, Depends
from typing import List, Optional
import uuid
from datetime import datetime

from database import database
from models import *
from utils import *

def get_community_routes(get_current_user):
    """Get community and additional API routes"""
    
    router = APIRouter()

    # Gratitude Entry routes
    @router.post("/gratitude-entries", response_model=GratitudeEntry)
    async def create_gratitude_entry(
        entry_data: GratitudeEntryCreate, 
        current_user: str = Depends(get_current_user)
    ):
        """Create a new gratitude entry"""
        try:
            entry_dict = entry_data.dict()
            entry_dict['id'] = str(uuid.uuid4())
            entry_dict['user_id'] = current_user
            
            await database.create_document("gratitude_entries", entry_dict)
            
            created_entry = await database.get_document("gratitude_entries", entry_dict['id'])
            return format_document_for_response(created_entry)
        
        except Exception as e:
            raise HTTPException(status_code=500, detail="Failed to create gratitude entry")

    @router.get("/gratitude-entries", response_model=List[GratitudeEntry])
    async def get_gratitude_entries(current_user: str = Depends(get_current_user)):
        """Get all gratitude entries for current user"""
        try:
            entries = await database.get_user_documents("gratitude_entries", current_user)
            return [format_document_for_response(entry) for entry in entries]
        
        except Exception as e:
            raise HTTPException(status_code=500, detail="Failed to get gratitude entries")

    @router.put("/gratitude-entries/{entry_id}", response_model=GratitudeEntry)
    async def update_gratitude_entry(
        entry_id: str, 
        entry_data: GratitudeEntryUpdate, 
        current_user: str = Depends(get_current_user)
    ):
        """Update a gratitude entry"""
        try:
            entry = await database.get_document("gratitude_entries", entry_id)
            if not entry or entry.get('user_id') != current_user:
                raise HTTPException(status_code=404, detail="Gratitude entry not found")
            
            update_dict = {k: v for k, v in entry_data.dict().items() if v is not None}
            
            success = await database.update_document("gratitude_entries", entry_id, update_dict)
            if not success:
                raise HTTPException(status_code=404, detail="Gratitude entry not found")
            
            updated_entry = await database.get_document("gratitude_entries", entry_id)
            return format_document_for_response(updated_entry)
        
        except Exception as e:
            raise HTTPException(status_code=500, detail="Failed to update gratitude entry")

    @router.delete("/gratitude-entries/{entry_id}")
    async def delete_gratitude_entry(entry_id: str, current_user: str = Depends(get_current_user)):
        """Delete a gratitude entry"""
        try:
            entry = await database.get_document("gratitude_entries", entry_id)
            if not entry or entry.get('user_id') != current_user:
                raise HTTPException(status_code=404, detail="Gratitude entry not found")
            
            success = await database.delete_document("gratitude_entries", entry_id)
            if not success:
                raise HTTPException(status_code=404, detail="Gratitude entry not found")
            
            return {"message": "Gratitude entry deleted successfully"}
        
        except Exception as e:
            raise HTTPException(status_code=500, detail="Failed to delete gratitude entry")

    # Community Post routes
    @router.post("/community-posts", response_model=CommunityPost)
    async def create_community_post(
        post_data: CommunityPostCreate, 
        current_user: str = Depends(get_current_user)
    ):
        """Create a new community post"""
        try:
            # Get user info for author
            user = await database.get_document("users", current_user)
            if not user:
                raise HTTPException(status_code=404, detail="User not found")
            
            post_dict = post_data.dict()
            post_dict['id'] = str(uuid.uuid4())
            post_dict['user_id'] = current_user
            post_dict['author'] = {
                'name': user.get('name', 'Anonymous'),
                'avatar': user.get('avatar'),
                'level': user.get('level', 'Rising Star')
            }
            post_dict['time_ago'] = "Just now"
            
            await database.create_document("community_posts", post_dict)
            
            created_post = await database.get_document("community_posts", post_dict['id'])
            return format_document_for_response(created_post)
        
        except Exception as e:
            raise HTTPException(status_code=500, detail="Failed to create community post")

    @router.get("/community-posts", response_model=List[CommunityPost])
    async def get_community_posts():
        """Get all public community posts"""
        try:
            posts = await database.get_documents("community_posts", limit=50)
            
            # Update time_ago for each post
            for post in posts:
                if post.get('created_at'):
                    created_at = post['created_at']
                    if isinstance(created_at, str):
                        created_at = datetime.fromisoformat(created_at.replace('Z', '+00:00'))
                    post['time_ago'] = calculate_time_ago(created_at)
            
            return [format_document_for_response(post) for post in posts]
        
        except Exception as e:
            raise HTTPException(status_code=500, detail="Failed to get community posts")

    @router.get("/community-posts/my", response_model=List[CommunityPost])
    async def get_my_community_posts(current_user: str = Depends(get_current_user)):
        """Get current user's community posts"""
        try:
            posts = await database.get_user_documents("community_posts", current_user)
            
            # Update time_ago for each post
            for post in posts:
                if post.get('created_at'):
                    created_at = post['created_at']
                    if isinstance(created_at, str):
                        created_at = datetime.fromisoformat(created_at.replace('Z', '+00:00'))
                    post['time_ago'] = calculate_time_ago(created_at)
            
            return [format_document_for_response(post) for post in posts]
        
        except Exception as e:
            raise HTTPException(status_code=500, detail="Failed to get user community posts")

    @router.post("/community-posts/{post_id}/like")
    async def like_community_post(post_id: str, current_user: str = Depends(get_current_user)):
        """Like a community post"""
        try:
            post = await database.get_document("community_posts", post_id)
            if not post:
                raise HTTPException(status_code=404, detail="Post not found")
            
            # Increment likes
            new_likes = post.get('likes', 0) + 1
            success = await database.update_document("community_posts", post_id, {"likes": new_likes})
            
            if not success:
                raise HTTPException(status_code=404, detail="Post not found")
            
            return {"message": "Post liked successfully", "likes": new_likes}
        
        except Exception as e:
            raise HTTPException(status_code=500, detail="Failed to like post")

    @router.delete("/community-posts/{post_id}")
    async def delete_community_post(post_id: str, current_user: str = Depends(get_current_user)):
        """Delete a community post"""
        try:
            post = await database.get_document("community_posts", post_id)
            if not post or post.get('user_id') != current_user:
                raise HTTPException(status_code=404, detail="Post not found")
            
            success = await database.delete_document("community_posts", post_id)
            if not success:
                raise HTTPException(status_code=404, detail="Post not found")
            
            return {"message": "Post deleted successfully"}
        
        except Exception as e:
            raise HTTPException(status_code=500, detail="Failed to delete post")

    # Template routes
    @router.get("/templates", response_model=List[Template])
    async def get_templates():
        """Get all available templates"""
        try:
            # For MVP, return static templates
            templates = [
                {
                    'id': '1',
                    'name': '5x55 Manifestation Method',
                    'description': 'Write your affirmation 55 times for 5 consecutive days',
                    'category': 'Manifestation',
                    'duration': '5 days',
                    'difficulty': 'Beginner',
                    'steps': [
                        'Choose a specific affirmation that resonates with your goal',
                        'Write it in present tense as if it\'s already happening',
                        'Write the affirmation 55 times each day',
                        'Focus on the feeling of already having what you want',
                        'Continue for 5 consecutive days without skipping'
                    ],
                    'example': 'I am successfully running my thriving online business',
                    'tips': [
                        'Use the same affirmation for all 5 days',
                        'Write by hand for better connection',
                        'Feel the emotions as you write',
                        'Don\'t rush - quality over speed'
                    ],
                    'users_count': 2300,
                    'rating': 4.8,
                    'created_at': datetime.utcnow(),
                    'updated_at': datetime.utcnow()
                },
                {
                    'id': '2',
                    'name': 'Scripting Manifestation',
                    'description': 'Write detailed stories about your desired future as if it\'s already happened',
                    'category': 'Manifestation',
                    'duration': 'Ongoing',
                    'difficulty': 'Intermediate',
                    'steps': [
                        'Set a clear intention for what you want to manifest',
                        'Write in past tense as if it already happened',
                        'Include specific details and emotions',
                        'Focus on how you feel in your desired reality',
                        'Read your script regularly to reinforce the vision'
                    ],
                    'example': 'I am so grateful that I successfully launched my dream business last month...',
                    'tips': [
                        'Be as specific as possible',
                        'Include all your senses in the description',
                        'Write about the journey, not just the outcome',
                        'Feel genuine gratitude as you write'
                    ],
                    'users_count': 1800,
                    'rating': 4.9,
                    'created_at': datetime.utcnow(),
                    'updated_at': datetime.utcnow()
                },
                {
                    'id': '3',
                    'name': '369 Manifestation Method',
                    'description': 'Write your intention 3 times in the morning, 6 times in the afternoon, and 9 times at night',
                    'category': 'Manifestation',
                    'duration': '21 days',
                    'difficulty': 'Beginner',
                    'steps': [
                        'Choose your manifestation intention',
                        'Write it 3 times every morning',
                        'Write it 6 times every afternoon',
                        'Write it 9 times every night',
                        'Continue for 21 days consistently'
                    ],
                    'example': 'I am living in my perfect home by the ocean',
                    'tips': [
                        'Set reminders for each writing session',
                        'Use the same wording each time',
                        'Visualize while writing',
                        'Trust the process even if you don\'t see immediate results'
                    ],
                    'users_count': 3200,
                    'rating': 4.7,
                    'created_at': datetime.utcnow(),
                    'updated_at': datetime.utcnow()
                }
            ]
            
            return [format_document_for_response(template) for template in templates]
        
        except Exception as e:
            raise HTTPException(status_code=500, detail="Failed to get templates")

    @router.get("/templates/{template_id}", response_model=Template)
    async def get_template(template_id: str):
        """Get a specific template"""
        try:
            # For MVP, return static template data
            templates = {
                '1': {
                    'id': '1',
                    'name': '5x55 Manifestation Method',
                    'description': 'Write your affirmation 55 times for 5 consecutive days',
                    'category': 'Manifestation',
                    'duration': '5 days',
                    'difficulty': 'Beginner',
                    'steps': [
                        'Choose a specific affirmation that resonates with your goal',
                        'Write it in present tense as if it\'s already happening',
                        'Write the affirmation 55 times each day',
                        'Focus on the feeling of already having what you want',
                        'Continue for 5 consecutive days without skipping'
                    ],
                    'example': 'I am successfully running my thriving online business',
                    'tips': [
                        'Use the same affirmation for all 5 days',
                        'Write by hand for better connection',
                        'Feel the emotions as you write',
                        'Don\'t rush - quality over speed'
                    ],
                    'users_count': 2300,
                    'rating': 4.8,
                    'created_at': datetime.utcnow(),
                    'updated_at': datetime.utcnow()
                }
            }
            
            template = templates.get(template_id)
            if not template:
                raise HTTPException(status_code=404, detail="Template not found")
            
            return format_document_for_response(template)
        
        except Exception as e:
            raise HTTPException(status_code=500, detail="Failed to get template")

    # Template Session routes
    @router.post("/template-sessions", response_model=TemplateSession)
    async def start_template_session(
        session_data: TemplateSessionCreate, 
        current_user: str = Depends(get_current_user)
    ):
        """Start a new template session"""
        try:
            session_dict = session_data.dict()
            session_dict['id'] = str(uuid.uuid4())
            session_dict['user_id'] = current_user
            
            await database.create_document("template_sessions", session_dict)
            
            created_session = await database.get_document("template_sessions", session_dict['id'])
            return format_document_for_response(created_session)
        
        except Exception as e:
            raise HTTPException(status_code=500, detail="Failed to start template session")

    @router.get("/template-sessions", response_model=List[TemplateSession])
    async def get_template_sessions(current_user: str = Depends(get_current_user)):
        """Get all template sessions for current user"""
        try:
            sessions = await database.get_user_documents("template_sessions", current_user)
            return [format_document_for_response(session) for session in sessions]
        
        except Exception as e:
            raise HTTPException(status_code=500, detail="Failed to get template sessions")

    @router.get("/template-sessions/active", response_model=Optional[TemplateSession])
    async def get_active_template_session(current_user: str = Depends(get_current_user)):
        """Get active template session for current user"""
        try:
            sessions = await database.get_user_documents(
                "template_sessions", 
                current_user, 
                {"is_active": True}
            )
            
            if sessions:
                return format_document_for_response(sessions[0])
            return None
        
        except Exception as e:
            raise HTTPException(status_code=500, detail="Failed to get active template session")

    @router.put("/template-sessions/{session_id}", response_model=TemplateSession)
    async def update_template_session(
        session_id: str, 
        session_data: TemplateSessionUpdate, 
        current_user: str = Depends(get_current_user)
    ):
        """Update a template session"""
        try:
            session = await database.get_document("template_sessions", session_id)
            if not session or session.get('user_id') != current_user:
                raise HTTPException(status_code=404, detail="Template session not found")
            
            update_dict = {k: v for k, v in session_data.dict().items() if v is not None}
            
            success = await database.update_document("template_sessions", session_id, update_dict)
            if not success:
                raise HTTPException(status_code=404, detail="Template session not found")
            
            updated_session = await database.get_document("template_sessions", session_id)
            return format_document_for_response(updated_session)
        
        except Exception as e:
            raise HTTPException(status_code=500, detail="Failed to update template session")

    # Stats routes
    @router.get("/stats", response_model=StatsResponse)
    async def get_global_stats():
        """Get global application statistics"""
        try:
            stats = await database.get_global_stats()
            return stats
        
        except Exception as e:
            raise HTTPException(status_code=500, detail="Failed to get global stats")

    @router.get("/stats/user", response_model=Dict)
    async def get_user_stats(current_user: str = Depends(get_current_user)):
        """Get current user statistics"""
        try:
            stats = await database.get_user_stats(current_user)
            achievements = generate_mock_achievements(stats)
            
            return {
                **stats,
                "achievements": achievements
            }
        
        except Exception as e:
            raise HTTPException(status_code=500, detail="Failed to get user stats")

    return router