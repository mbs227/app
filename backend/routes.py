from fastapi import APIRouter, HTTPException, Depends, Request
from typing import List
from pymongo.errors import ConnectionError as MongoConnectionError
import uuid
from datetime import datetime

from server import logger, limiter
from backend.database import database
from backend.models import *
from backend.utils import *
from backend.constants import COLLECTIONS

def get_additional_routes(get_current_user):
    """Get all additional API routes"""
    
    router = APIRouter()

    # Vision Board routes
    @router.post("/vision-boards", response_model=VisionBoard, responses={400: {"model": ErrorResponse}, 503: {"model": ErrorResponse}})
    @limiter.limit("5/minute")
    async def create_vision_board(
        board_data: VisionBoardCreate, 
        current_user: str = Depends(get_current_user),
        request: Request = None
    ):
        """Create a new vision board"""
        try:
            board_dict = board_data.dict()
            board_dict['id'] = str(uuid.uuid4())
            board_dict['user_id'] = current_user
            
            await database.create_document(COLLECTIONS["VISION_BOARDS"], board_dict)
            
            created_board = await database.get_document(COLLECTIONS["VISION_BOARDS"], board_dict['id'])
            if not created_board:
                raise HTTPException(status_code=500, detail="Failed to retrieve created vision board")
            return format_document_for_response(created_board)
        
        except MongoConnectionError as e:
            logger.error(f"Database connection error in create_vision_board: {e}")
            raise HTTPException(status_code=503, detail="Database unavailable")
        except Exception as e:
            logger.error(f"Failed to create vision board: {e}")
            raise HTTPException(status_code=500, detail="Failed to create vision board")

    @router.get("/vision-boards", response_model=List[VisionBoard], responses={503: {"model": ErrorResponse}})
    @limiter.limit("5/minute")
    async def get_vision_boards(
        current_user: str = Depends(get_current_user),
        request: Request = None
    ):
        """Get all vision boards for current user"""
        try:
            boards = await database.get_user_documents(COLLECTIONS["VISION_BOARDS"], current_user)
            return [format_document_for_response(board) for board in boards]
        
        except MongoConnectionError as e:
            logger.error(f"Database connection error in get_vision_boards: {e}")
            raise HTTPException(status_code=503, detail="Database unavailable")
        except Exception as e:
            logger.error(f"Failed to get vision boards: {e}")
            raise HTTPException(status_code=500, detail="Failed to get vision boards")

    @router.get("/vision-boards/{board_id}", response_model=VisionBoard, responses={404: {"model": ErrorResponse}, 503: {"model": ErrorResponse}})
    @limiter.limit("5/minute")
    async def get_vision_board(
        board_id: str,
        current_user: str = Depends(get_current_user),
        request: Request = None
    ):
        """Get a specific vision board"""
        try:
            board = await database.get_document(COLLECTIONS["VISION_BOARDS"], board_id)
            if not board or board.get('user_id') != current_user:
                raise HTTPException(status_code=404, detail="Vision board not found")
            
            return format_document_for_response(board)
        
        except MongoConnectionError as e:
            logger.error(f"Database connection error in get_vision_board: {e}")
            raise HTTPException(status_code=503, detail="Database unavailable")
        except Exception as e:
            logger.error(f"Failed to get vision board: {e}")
            raise HTTPException(status_code=500, detail="Failed to get vision board")

    @router.put("/vision-boards/{board_id}", response_model=VisionBoard, responses={400: {"model": ErrorResponse}, 404: {"model": ErrorResponse}, 503: {"model": ErrorResponse}})
    @limiter.limit("5/minute")
    async def update_vision_board(
        board_id: str, 
        board_data: VisionBoardUpdate, 
        current_user: str = Depends(get_current_user),
        request: Request = None
    ):
        """Update a vision board"""
        try:
            board = await database.get_document(COLLECTIONS["VISION_BOARDS"], board_id)
            if not board or board.get('user_id') != current_user:
                raise HTTPException(status_code=404, detail="Vision board not found")
            
            update_dict = {k: v for k, v in board_data.dict().items() if v is not None}
            if not update_dict:
                raise HTTPException(status_code=400, detail="No data to update")
            
            success = await database.update_document(COLLECTIONS["VISION_BOARDS"], board_id, update_dict)
            if not success:
                raise HTTPException(status_code=404, detail="Vision board not found")
            
            updated_board = await database.get_document(COLLECTIONS["VISION_BOARDS"], board_id)
            return format_document_for_response(updated_board)
        
        except MongoConnectionError as e:
            logger.error(f"Database connection error in update_vision_board: {e}")
            raise HTTPException(status_code=503, detail="Database unavailable")
        except HTTPException:
            raise
        except Exception as e:
            logger.error(f"Failed to update vision board: {e}")
            raise HTTPException(status_code=500, detail="Failed to update vision board")

    # Journal Entry routes
    @router.post("/journal-entries", response_model=JournalEntry, responses={400: {"model": ErrorResponse}, 503: {"model": ErrorResponse}})
    @limiter.limit("5/minute")
    async def create_journal_entry(
        entry_data: JournalEntryCreate, 
        current_user: str = Depends(get_current_user),
        request: Request = None
    ):
        """Create a new journal entry"""
        try:
            entry_dict = entry_data.dict()
            entry_dict['id'] = str(uuid.uuid4())
            entry_dict['user_id'] = current_user
            
            await database.create_document(COLLECTIONS["JOURNAL_ENTRIES"], entry_dict)
            
            created_entry = await database.get_document(COLLECTIONS["JOURNAL_ENTRIES"], entry_dict['id'])
            if not created_entry:
                raise HTTPException(status_code=500, detail="Failed to retrieve created journal entry")
            return format_document_for_response(created_entry)
        
        except MongoConnectionError as e:
            logger.error(f"Database connection error in create_journal_entry: {e}")
            raise HTTPException(status_code=503, detail="Database unavailable")
        except Exception as e:
            logger.error(f"Failed to create journal entry: {e}")
            raise HTTPException(status_code=500, detail="Failed to create journal entry")

    @router.get("/journal-entries", response_model=List[JournalEntry], responses={503: {"model": ErrorResponse}})
    @limiter.limit("5/minute")
    async def get_journal_entries(
        current_user: str = Depends(get_current_user),
        request: Request = None
    ):
        """Get all journal entries for current user"""
        try:
            entries = await database.get_user_documents(COLLECTIONS["JOURNAL_ENTRIES"], current_user)
            return [format_document_for_response(entry) for entry in entries]
        
        except MongoConnectionError as e:
            logger.error(f"Database connection error in get_journal_entries: {e}")
            raise HTTPException(status_code=503, detail="Database unavailable")
        except Exception as e:
            logger.error(f"Failed to get journal entries: {e}")
            raise HTTPException(status_code=500, detail="Failed to get journal entries")

    @router.put("/journal-entries/{entry_id}", response_model=JournalEntry, responses={400: {"model": ErrorResponse}, 404: {"model": ErrorResponse}, 503: {"model": ErrorResponse}})
    @limiter.limit("5/minute")
    async def update_journal_entry(
        entry_id: str, 
        entry_data: JournalEntryUpdate, 
        current_user: str = Depends(get_current_user),
        request: Request = None
    ):
        """Update a journal entry"""
        try:
            entry = await database.get_document(COLLECTIONS["JOURNAL_ENTRIES"], entry_id)
            if not entry or entry.get('user_id') != current_user:
                raise HTTPException(status_code=404, detail="Journal entry not found")
            
            update_dict = {k: v for k, v in entry_data.dict().items() if v is not None}
            if not update_dict:
                raise HTTPException(status_code=400, detail="No data to update")
            
            success = await database.update_document(COLLECTIONS["JOURNAL_ENTRIES"], entry_id, update_dict)
            if not success:
                raise HTTPException(status_code=404, detail="Journal entry not found")
            
            updated_entry = await database.get_document(COLLECTIONS["JOURNAL_ENTRIES"], entry_id)
            return format_document_for_response(updated_entry)
        
        except MongoConnectionError as e:
            logger.error(f"Database connection error in update_journal_entry: {e}")
            raise HTTPException(status_code=503, detail="Database unavailable")
        except HTTPException:
            raise
        except Exception as e:
            logger.error(f"Failed to update journal entry: {e}")
            raise HTTPException(status_code=500, detail="Failed to update journal entry")

    @router.delete("/journal-entries/{entry_id}", responses={404: {"model": ErrorResponse}, 503: {"model": ErrorResponse}})
    @limiter.limit("5/minute")
    async def delete_journal_entry(
        entry_id: str,
        current_user: str = Depends(get_current_user),
        request: Request = None
    ):
        """Delete a journal entry"""
        try:
            entry = await database.get_document(COLLECTIONS["JOURNAL_ENTRIES"], entry_id)
            if not entry or entry.get('user_id') != current_user:
                raise HTTPException(status_code=404, detail="Journal entry not found")
            
            success = await database.delete_document(COLLECTIONS["JOURNAL_ENTRIES"], entry_id)
            if not success:
                raise HTTPException(status_code=404, detail="Journal entry not found")
            
            return {"message": "Journal entry deleted successfully"}
        
        except MongoConnectionError as e:
            logger.error(f"Database connection error in delete_journal_entry: {e}")
            raise HTTPException(status_code=503, detail="Database unavailable")
        except HTTPException:
            raise
        except Exception as e:
            logger.error(f"Failed to delete journal entry: {e}")
            raise HTTPException(status_code=500, detail="Failed to delete journal entry")

    @router.post("/journal-entries/{entry_id}/like", responses={404: {"model": ErrorResponse}, 503: {"model": ErrorResponse}})
    @limiter.limit("5/minute")
    async def like_journal_entry(
        entry_id: str,
        current_user: str = Depends(get_current_user),
        request: Request = None
    ):
        """Like a journal entry"""
        try:
            entry = await database.get_document(COLLECTIONS["JOURNAL_ENTRIES"], entry_id)
            if not entry:
                raise HTTPException(status_code=404, detail="Journal entry not found")
            
            # Increment likes
            new_likes = entry.get('likes', 0) + 1
            success = await database.update_document(COLLECTIONS["JOURNAL_ENTRIES"], entry_id, {"likes": new_likes})
            
            if not success:
                raise HTTPException(status_code=404, detail="Journal entry not found")
            
            return {"message": "Journal entry liked successfully", "likes": new_likes}
        
        except MongoConnectionError as e:
            logger.error(f"Database connection error in like_journal_entry: {e}")
            raise HTTPException(status_code=503, detail="Database unavailable")
        except HTTPException:
            raise
        except Exception as e:
            logger.error(f"Failed to like journal entry: {e}")
            raise HTTPException(status_code=500, detail="Failed to like journal entry")

    # Affirmation routes
    @router.post("/affirmations", response_model=Affirmation, responses={400: {"model": ErrorResponse}, 503: {"model": ErrorResponse}})
    @limiter.limit("5/minute")
    async def create_affirmation(
        affirmation_data: AffirmationCreate, 
        current_user: str = Depends(get_current_user),
        request: Request = None
    ):
        """Create a new affirmation"""
        try:
            affirmation_dict = affirmation_data.dict()
            affirmation_dict['id'] = str(uuid.uuid4())
            affirmation_dict['user_id'] = current_user
            
            await database.create_document(COLLECTIONS["AFFIRMATIONS"], affirmation_dict)
            
            created_affirmation = await database.get_document(COLLECTIONS["AFFIRMATIONS"], affirmation_dict['id'])
            if not created_affirmation:
                raise HTTPException(status_code=500, detail="Failed to retrieve created affirmation")
            return format_document_for_response(created_affirmation)
        
        except MongoConnectionError as e:
            logger.error(f"Database connection error in create_affirmation: {e}")
            raise HTTPException(status_code=503, detail="Database unavailable")
        except Exception as e:
            logger.error(f"Failed to create affirmation: {e}")
            raise HTTPException(status_code=500, detail="Failed to create affirmation")

    @router.get("/affirmations", response_model=List[Affirmation], responses={503: {"model": ErrorResponse}})
    @limiter.limit("5/minute")
    async def get_affirmations(
        current_user: str = Depends(get_current_user),
        request: Request = None
    ):
        """Get all affirmations for current user"""
        try:
            affirmations = await database.get_user_documents(COLLECTIONS["AFFIRMATIONS"], current_user)
            return [format_document_for_response(affirmation) for affirmation in affirmations]
        
        except MongoConnectionError as e:
            logger.error(f"Database connection error in get_affirmations: {e}")
            raise HTTPException(status_code=503, detail="Database unavailable")
        except Exception as e:
            logger.error(f"Failed to get affirmations: {e}")
            raise HTTPException(status_code=500, detail="Failed to get affirmations")

    @router.put("/affirmations/{affirmation_id}", response_model=Affirmation, responses={400: {"model": ErrorResponse}, 404: {"model": ErrorResponse}, 503: {"model": ErrorResponse}})
    @limiter.limit("5/minute")
    async def update_affirmation(
        affirmation_id: str, 
        affirmation_data: AffirmationUpdate, 
        current_user: str = Depends(get_current_user),
        request: Request = None
    ):
        """Update an affirmation"""
        try:
            affirmation = await database.get_document(COLLECTIONS["AFFIRMATIONS"], affirmation_id)
            if not affirmation or affirmation.get('user_id') != current_user:
                raise HTTPException(status_code=404, detail="Affirmation not found")
            
            update_dict = {k: v for k, v in affirmation_data.dict().items() if v is not None}
            if not update_dict:
                raise HTTPException(status_code=400, detail="No data to update")
            
            success = await database.update_document(COLLECTIONS["AFFIRMATIONS"], affirmation_id, update_dict)
            if not success:
                raise HTTPException(status_code=404, detail="Affirmation not found")
            
            updated_affirmation = await database.get_document(COLLECTIONS["AFFIRMATIONS"], affirmation_id)
            return format_document_for_response(updated_affirmation)
        
        except MongoConnectionError as e:
            logger.error(f"Database connection error in update_affirmation: {e}")
            raise HTTPException(status_code=503, detail="Database unavailable")
        except HTTPException:
            raise
        except Exception as e:
            logger.error(f"Failed to update affirmation: {e}")
            raise HTTPException(status_code=500, detail="Failed to update affirmation")

    @router.delete("/affirmations/{affirmation_id}", responses={404: {"model": ErrorResponse}, 503: {"model": ErrorResponse}})
    @limiter.limit("5/minute")
    async def delete_affirmation(
        affirmation_id: str,
        current_user: str = Depends(get_current_user),
        request: Request = None
    ):
        """Delete an affirmation"""
        try:
            affirmation = await database.get_document(COLLECTIONS["AFFIRMATIONS"], affirmation_id)
            if not affirmation or affirmation.get('user_id') != current_user:
                raise HTTPException(status_code=404, detail="Affirmation not found")
            
            success = await database.delete_document(COLLECTIONS["AFFIRMATIONS"], affirmation_id)
            if not success:
                raise HTTPException(status_code=404, detail="Affirmation not found")
            
            return {"message": "Affirmation deleted successfully"}
        
        except MongoConnectionError as e:
            logger.error(f"Database connection error in delete_affirmation: {e}")
            raise HTTPException(status_code=503, detail="Database unavailable")
        except HTTPException:
            raise
        except Exception as e:
            logger.error(f"Failed to delete affirmation: {e}")
            raise HTTPException(status_code=500, detail="Failed to delete affirmation")

    # Habit routes
    @router.post("/habits", response_model=Habit, responses={400: {"model": ErrorResponse}, 503: {"model": ErrorResponse}})
    @limiter.limit("5/minute")
    async def create_habit(
        habit_data: HabitCreate, 
        current_user: str = Depends(get_current_user),
        request: Request = None
    ):
        """Create a new habit"""
        try:
            habit_dict = habit_data.dict()
            habit_dict['id'] = str(uuid.uuid4())
            habit_dict['user_id'] = current_user
            
            await database.create_document(COLLECTIONS["HABITS"], habit_dict)
            
            created_habit = await database.get_document(COLLECTIONS["HABITS"], habit_dict['id'])
            if not created_habit:
                raise HTTPException(status_code=500, detail="Failed to retrieve created habit")
            return format_document_for_response(created_habit)
        
        except MongoConnectionError as e:
            logger.error(f"Database connection error in create_habit: {e}")
            raise HTTPException(status_code=503, detail="Database unavailable")
        except Exception as e:
            logger.error(f"Failed to create habit: {e}")
            raise HTTPException(status_code=500, detail="Failed to create habit")

    @router.get("/habits", response_model=List[Habit], responses={503: {"model": ErrorResponse}})
    @limiter.limit("5/minute")
    async def get_habits(
        current_user: str = Depends(get_current_user),
        request: Request = None
    ):
        """Get all habits for current user"""
        try:
            habits = await database.get_user_documents(COLLECTIONS["HABITS"], current_user)
            return [format_document_for_response(habit) for habit in habits]
        
        except MongoConnectionError as e:
            logger.error(f"Database connection error in get_habits: {e}")
            raise HTTPException(status_code=503, detail="Database unavailable")
        except Exception as e:
            logger.error(f"Failed to get habits: {e}")
            raise HTTPException(status_code=500, detail="Failed to get habits")

    @router.put("/habits/{habit_id}", response_model=Habit, responses={400: {"model": ErrorResponse}, 404: {"model": ErrorResponse}, 503: {"model": ErrorResponse}})
    @limiter.limit("5/minute")
    async def update_habit(
        habit_id: str, 
        habit_data: HabitUpdate, 
        current_user: str = Depends(get_current_user),
        request: Request = None
    ):
        """Update a habit"""
        try:
            habit = await database.get_document(COLLECTIONS["HABITS"], habit_id)
            if not habit or habit.get('user_id') != current_user:
                raise HTTPException(status_code=404, detail="Habit not found")
            
            update_dict = {k: v for k, v in habit_data.dict().items() if v is not None}
            if not update_dict:
                raise HTTPException(status_code=400, detail="No data to update")
            
            # Recalculate streak and progress if completed_dates changed
            if 'completed_dates' in update_dict:
                update_dict['streak'] = calculate_streak(update_dict['completed_dates'])
                update_dict['progress'] = calculate_habit_progress(
                    update_dict['completed_dates'], 
                    update_dict.get('target', habit.get('target', 30))
                )
            
            success = await database.update_document(COLLECTIONS["HABITS"], habit_id, update_dict)
            if not success:
                raise HTTPException(status_code=404, detail="Habit not found")
            
            updated_habit = await database.get_document(COLLECTIONS["HABITS"], habit_id)
            return format_document_for_response(updated_habit)
        
        except MongoConnectionError as e:
            logger.error(f"Database connection error in update_habit: {e}")
            raise HTTPException(status_code=503, detail="Database unavailable")
        except HTTPException:
            raise
        except Exception as e:
            logger.error(f"Failed to update habit: {e}")
            raise HTTPException(status_code=500, detail="Failed to update habit")

    @router.post("/habits/{habit_id}/toggle", responses={404: {"model": ErrorResponse}, 503: {"model": ErrorResponse}})
    @limiter.limit("5/minute")
    async def toggle_habit_completion(
        habit_id: str,
        current_user: str = Depends(get_current_user),
        request: Request = None
    ):
        """Toggle habit completion for today"""
        try:
            habit = await database.get_document(COLLECTIONS["HABITS"], habit_id)
            if not habit or habit.get('user_id') != current_user:
                raise HTTPException(status_code=404, detail="Habit not found")
            
            today = datetime.utcnow().strftime("%Y-%m-%d")
            completed_dates = habit.get('completed_dates', [])
            
            if today in completed_dates:
                # Remove today's completion
                completed_dates.remove(today)
            else:
                # Add today's completion
                completed_dates.append(today)
            
            # Recalculate stats
            new_streak = calculate_streak(completed_dates)
            new_progress = calculate_habit_progress(completed_dates, habit.get('target', 30))
            
            update_data = {
                'completed_dates': completed_dates,
                'streak': new_streak,
                'progress': new_progress
            }
            
            success = await database.update_document(COLLECTIONS["HABITS"], habit_id, update_data)
            if not success:
                raise HTTPException(status_code=404, detail="Habit not found")
            
            return {
                "message": "Habit completion toggled successfully",
                "completed": today in completed_dates,
                "streak": new_streak,
                "progress": new_progress
            }
        
        except MongoConnectionError as e:
            logger.error(f"Database connection error in toggle_habit_completion: {e}")
            raise HTTPException(status_code=503, detail="Database unavailable")
        except HTTPException:
            raise
        except Exception as e:
            logger.error(f"Failed to toggle habit completion: {e}")
            raise HTTPException(status_code=500, detail="Failed to toggle habit completion")

    @router.delete("/habits/{habit_id}", responses={404: {"model": ErrorResponse}, 503: {"model": ErrorResponse}})
    @limiter.limit("5/minute")
    async def delete_habit(
        habit_id: str,
        current_user: str = Depends(get_current_user),
        request: Request = None
    ):
        """Delete a habit"""
        try:
            habit = await database.get_document(COLLECTIONS["HABITS"], habit_id)
            if not habit or habit.get('user_id') != current_user:
                raise HTTPException(status_code=404, detail="Habit not found")
            
            success = await database.delete_document(COLLECTIONS["HABITS"], habit_id)
            if not success:
                raise HTTPException(status_code=404, detail="Habit not found")
            
            return {"message": "Habit deleted successfully"}
        
        except MongoConnectionError as e:
            logger.error(f"Database connection error in delete_habit: {e}")
            raise HTTPException(status_code=503, detail="Database unavailable")
        except HTTPException:
            raise
        except Exception as e:
            logger.error(f"Failed to delete habit: {e}")
            raise HTTPException(status_code=500, detail="Failed to delete habit")

    return router
