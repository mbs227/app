# Additional API routes for ManifestLife backend
from fastapi import APIRouter, HTTPException, Depends
from typing import List, Optional
import uuid
from datetime import datetime

from database import database
from models import *
from utils import *

def get_additional_routes(get_current_user):
    """Get all additional API routes"""
    
    router = APIRouter()

    # Vision Board routes
    @router.post("/vision-boards", response_model=VisionBoard)
    async def create_vision_board(
        board_data: VisionBoardCreate, 
        current_user: str = Depends(get_current_user)
    ):
        """Create a new vision board"""
        try:
            board_dict = board_data.dict()
            board_dict['id'] = str(uuid.uuid4())
            board_dict['user_id'] = current_user
            
            await database.create_document("vision_boards", board_dict)
            
            created_board = await database.get_document("vision_boards", board_dict['id'])
            return format_document_for_response(created_board)
        
        except Exception as e:
            raise HTTPException(status_code=500, detail="Failed to create vision board")

    @router.get("/vision-boards", response_model=List[VisionBoard])
    async def get_vision_boards(current_user: str = Depends(get_current_user)):
        """Get all vision boards for current user"""
        try:
            boards = await database.get_user_documents("vision_boards", current_user)
            return [format_document_for_response(board) for board in boards]
        
        except Exception as e:
            raise HTTPException(status_code=500, detail="Failed to get vision boards")

    @router.get("/vision-boards/{board_id}", response_model=VisionBoard)
    async def get_vision_board(board_id: str, current_user: str = Depends(get_current_user)):
        """Get a specific vision board"""
        try:
            board = await database.get_document("vision_boards", board_id)
            if not board or board.get('user_id') != current_user:
                raise HTTPException(status_code=404, detail="Vision board not found")
            
            return format_document_for_response(board)
        
        except Exception as e:
            raise HTTPException(status_code=500, detail="Failed to get vision board")

    @router.put("/vision-boards/{board_id}", response_model=VisionBoard)
    async def update_vision_board(
        board_id: str, 
        board_data: VisionBoardUpdate, 
        current_user: str = Depends(get_current_user)
    ):
        """Update a vision board"""
        try:
            board = await database.get_document("vision_boards", board_id)
            if not board or board.get('user_id') != current_user:
                raise HTTPException(status_code=404, detail="Vision board not found")
            
            update_dict = {k: v for k, v in board_data.dict().items() if v is not None}
            
            success = await database.update_document("vision_boards", board_id, update_dict)
            if not success:
                raise HTTPException(status_code=404, detail="Vision board not found")
            
            updated_board = await database.get_document("vision_boards", board_id)
            return format_document_for_response(updated_board)
        
        except Exception as e:
            raise HTTPException(status_code=500, detail="Failed to update vision board")

    # Journal Entry routes
    @router.post("/journal-entries", response_model=JournalEntry)
    async def create_journal_entry(
        entry_data: JournalEntryCreate, 
        current_user: str = Depends(get_current_user)
    ):
        """Create a new journal entry"""
        try:
            entry_dict = entry_data.dict()
            entry_dict['id'] = str(uuid.uuid4())
            entry_dict['user_id'] = current_user
            
            await database.create_document("journal_entries", entry_dict)
            
            created_entry = await database.get_document("journal_entries", entry_dict['id'])
            return format_document_for_response(created_entry)
        
        except Exception as e:
            raise HTTPException(status_code=500, detail="Failed to create journal entry")

    @router.get("/journal-entries", response_model=List[JournalEntry])
    async def get_journal_entries(current_user: str = Depends(get_current_user)):
        """Get all journal entries for current user"""
        try:
            entries = await database.get_user_documents("journal_entries", current_user)
            return [format_document_for_response(entry) for entry in entries]
        
        except Exception as e:
            raise HTTPException(status_code=500, detail="Failed to get journal entries")

    @router.put("/journal-entries/{entry_id}", response_model=JournalEntry)
    async def update_journal_entry(
        entry_id: str, 
        entry_data: JournalEntryUpdate, 
        current_user: str = Depends(get_current_user)
    ):
        """Update a journal entry"""
        try:
            entry = await database.get_document("journal_entries", entry_id)
            if not entry or entry.get('user_id') != current_user:
                raise HTTPException(status_code=404, detail="Journal entry not found")
            
            update_dict = {k: v for k, v in entry_data.dict().items() if v is not None}
            
            success = await database.update_document("journal_entries", entry_id, update_dict)
            if not success:
                raise HTTPException(status_code=404, detail="Journal entry not found")
            
            updated_entry = await database.get_document("journal_entries", entry_id)
            return format_document_for_response(updated_entry)
        
        except Exception as e:
            raise HTTPException(status_code=500, detail="Failed to update journal entry")

    @router.delete("/journal-entries/{entry_id}")
    async def delete_journal_entry(entry_id: str, current_user: str = Depends(get_current_user)):
        """Delete a journal entry"""
        try:
            entry = await database.get_document("journal_entries", entry_id)
            if not entry or entry.get('user_id') != current_user:
                raise HTTPException(status_code=404, detail="Journal entry not found")
            
            success = await database.delete_document("journal_entries", entry_id)
            if not success:
                raise HTTPException(status_code=404, detail="Journal entry not found")
            
            return {"message": "Journal entry deleted successfully"}
        
        except Exception as e:
            raise HTTPException(status_code=500, detail="Failed to delete journal entry")

    @router.post("/journal-entries/{entry_id}/like")
    async def like_journal_entry(entry_id: str, current_user: str = Depends(get_current_user)):
        """Like a journal entry"""
        try:
            entry = await database.get_document("journal_entries", entry_id)
            if not entry:
                raise HTTPException(status_code=404, detail="Journal entry not found")
            
            # Increment likes
            new_likes = entry.get('likes', 0) + 1
            success = await database.update_document("journal_entries", entry_id, {"likes": new_likes})
            
            if not success:
                raise HTTPException(status_code=404, detail="Journal entry not found")
            
            return {"message": "Journal entry liked successfully", "likes": new_likes}
        
        except Exception as e:
            raise HTTPException(status_code=500, detail="Failed to like journal entry")

    # Affirmation routes
    @router.post("/affirmations", response_model=Affirmation)
    async def create_affirmation(
        affirmation_data: AffirmationCreate, 
        current_user: str = Depends(get_current_user)
    ):
        """Create a new affirmation"""
        try:
            affirmation_dict = affirmation_data.dict()
            affirmation_dict['id'] = str(uuid.uuid4())
            affirmation_dict['user_id'] = current_user
            
            await database.create_document("affirmations", affirmation_dict)
            
            created_affirmation = await database.get_document("affirmations", affirmation_dict['id'])
            return format_document_for_response(created_affirmation)
        
        except Exception as e:
            raise HTTPException(status_code=500, detail="Failed to create affirmation")

    @router.get("/affirmations", response_model=List[Affirmation])
    async def get_affirmations(current_user: str = Depends(get_current_user)):
        """Get all affirmations for current user"""
        try:
            affirmations = await database.get_user_documents("affirmations", current_user)
            return [format_document_for_response(affirmation) for affirmation in affirmations]
        
        except Exception as e:
            raise HTTPException(status_code=500, detail="Failed to get affirmations")

    @router.put("/affirmations/{affirmation_id}", response_model=Affirmation)
    async def update_affirmation(
        affirmation_id: str, 
        affirmation_data: AffirmationUpdate, 
        current_user: str = Depends(get_current_user)
    ):
        """Update an affirmation"""
        try:
            affirmation = await database.get_document("affirmations", affirmation_id)
            if not affirmation or affirmation.get('user_id') != current_user:
                raise HTTPException(status_code=404, detail="Affirmation not found")
            
            update_dict = {k: v for k, v in affirmation_data.dict().items() if v is not None}
            
            success = await database.update_document("affirmations", affirmation_id, update_dict)
            if not success:
                raise HTTPException(status_code=404, detail="Affirmation not found")
            
            updated_affirmation = await database.get_document("affirmations", affirmation_id)
            return format_document_for_response(updated_affirmation)
        
        except Exception as e:
            raise HTTPException(status_code=500, detail="Failed to update affirmation")

    @router.delete("/affirmations/{affirmation_id}")
    async def delete_affirmation(affirmation_id: str, current_user: str = Depends(get_current_user)):
        """Delete an affirmation"""
        try:
            affirmation = await database.get_document("affirmations", affirmation_id)
            if not affirmation or affirmation.get('user_id') != current_user:
                raise HTTPException(status_code=404, detail="Affirmation not found")
            
            success = await database.delete_document("affirmations", affirmation_id)
            if not success:
                raise HTTPException(status_code=404, detail="Affirmation not found")
            
            return {"message": "Affirmation deleted successfully"}
        
        except Exception as e:
            raise HTTPException(status_code=500, detail="Failed to delete affirmation")

    # Habit routes
    @router.post("/habits", response_model=Habit)
    async def create_habit(
        habit_data: HabitCreate, 
        current_user: str = Depends(get_current_user)
    ):
        """Create a new habit"""
        try:
            habit_dict = habit_data.dict()
            habit_dict['id'] = str(uuid.uuid4())
            habit_dict['user_id'] = current_user
            
            await database.create_document("habits", habit_dict)
            
            created_habit = await database.get_document("habits", habit_dict['id'])
            return format_document_for_response(created_habit)
        
        except Exception as e:
            raise HTTPException(status_code=500, detail="Failed to create habit")

    @router.get("/habits", response_model=List[Habit])
    async def get_habits(current_user: str = Depends(get_current_user)):
        """Get all habits for current user"""
        try:
            habits = await database.get_user_documents("habits", current_user)
            return [format_document_for_response(habit) for habit in habits]
        
        except Exception as e:
            raise HTTPException(status_code=500, detail="Failed to get habits")

    @router.put("/habits/{habit_id}", response_model=Habit)
    async def update_habit(
        habit_id: str, 
        habit_data: HabitUpdate, 
        current_user: str = Depends(get_current_user)
    ):
        """Update a habit"""
        try:
            habit = await database.get_document("habits", habit_id)
            if not habit or habit.get('user_id') != current_user:
                raise HTTPException(status_code=404, detail="Habit not found")
            
            update_dict = {k: v for k, v in habit_data.dict().items() if v is not None}
            
            # Recalculate streak and progress if completed_dates changed
            if 'completed_dates' in update_dict:
                update_dict['streak'] = calculate_streak(update_dict['completed_dates'])
                update_dict['progress'] = calculate_habit_progress(
                    update_dict['completed_dates'], 
                    habit.get('target', 30)
                )
            
            success = await database.update_document("habits", habit_id, update_dict)
            if not success:
                raise HTTPException(status_code=404, detail="Habit not found")
            
            updated_habit = await database.get_document("habits", habit_id)
            return format_document_for_response(updated_habit)
        
        except Exception as e:
            raise HTTPException(status_code=500, detail="Failed to update habit")

    @router.post("/habits/{habit_id}/toggle")
    async def toggle_habit_completion(habit_id: str, current_user: str = Depends(get_current_user)):
        """Toggle habit completion for today"""
        try:
            habit = await database.get_document("habits", habit_id)
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
            
            success = await database.update_document("habits", habit_id, update_data)
            if not success:
                raise HTTPException(status_code=404, detail="Habit not found")
            
            return {
                "message": "Habit completion toggled successfully",
                "completed": today in completed_dates,
                "streak": new_streak,
                "progress": new_progress
            }
        
        except Exception as e:
            raise HTTPException(status_code=500, detail="Failed to toggle habit completion")

    @router.delete("/habits/{habit_id}")
    async def delete_habit(habit_id: str, current_user: str = Depends(get_current_user)):
        """Delete a habit"""
        try:
            habit = await database.get_document("habits", habit_id)
            if not habit or habit.get('user_id') != current_user:
                raise HTTPException(status_code=404, detail="Habit not found")
            
            success = await database.delete_document("habits", habit_id)
            if not success:
                raise HTTPException(status_code=404, detail="Habit not found")
            
            return {"message": "Habit deleted successfully"}
        
        except Exception as e:
            raise HTTPException(status_code=500, detail="Failed to delete habit")

    return router