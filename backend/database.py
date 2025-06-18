from motor.motor_asyncio import AsyncIOMotorClient
import os
from datetime import datetime
from typing import List, Optional, Dict, Any

class Database:
    def __init__(self):
        self.client = None
        self.db = None

    async def connect(self):
        mongo_url = os.environ.get('MONGO_URL')
        db_name = os.environ.get('DB_NAME', 'manifestlife')
        
        self.client = AsyncIOMotorClient(mongo_url)
        self.db = self.client[db_name]
        
        # Create indexes
        await self.create_indexes()

    async def disconnect(self):
        if self.client:
            self.client.close()

    async def create_indexes(self):
        """Create database indexes for better performance"""
        try:
            # User indexes
            await self.db.users.create_index("email", unique=True)
            
            # Goal indexes
            await self.db.goals.create_index("user_id")
            await self.db.goals.create_index([("user_id", 1), ("status", 1)])
            
            # Journal indexes
            await self.db.journal_entries.create_index("user_id")
            await self.db.journal_entries.create_index([("is_public", 1), ("created_at", -1)])
            
            # Affirmation indexes
            await self.db.affirmations.create_index("user_id")
            await self.db.affirmations.create_index([("user_id", 1), ("is_active", 1)])
            
            # Habit indexes
            await self.db.habits.create_index("user_id")
            
            # Gratitude indexes
            await self.db.gratitude_entries.create_index("user_id")
            
            # Community indexes
            await self.db.community_posts.create_index("user_id")
            await self.db.community_posts.create_index([("created_at", -1)])
            
            # Vision board indexes
            await self.db.vision_boards.create_index("user_id")
            
            # Template session indexes
            await self.db.template_sessions.create_index("user_id")
            await self.db.template_sessions.create_index([("user_id", 1), ("is_active", 1)])
            
            print("Database indexes created successfully")
        except Exception as e:
            print(f"Error creating indexes: {e}")

    # Generic CRUD operations
    async def create_document(self, collection_name: str, document: Dict[str, Any]) -> str:
        """Create a new document in the specified collection"""
        document['created_at'] = datetime.utcnow()
        document['updated_at'] = datetime.utcnow()
        
        result = await self.db[collection_name].insert_one(document)
        return str(result.inserted_id)

    async def get_document(self, collection_name: str, document_id: str) -> Optional[Dict[str, Any]]:
        """Get a document by ID"""
        document = await self.db[collection_name].find_one({"id": document_id})
        if document:
            document['_id'] = str(document['_id'])
        return document

    async def get_documents(
        self, 
        collection_name: str, 
        filter_dict: Dict[str, Any] = None,
        sort_field: str = "created_at",
        sort_direction: int = -1,
        limit: int = 100,
        skip: int = 0
    ) -> List[Dict[str, Any]]:
        """Get multiple documents with filtering and pagination"""
        if filter_dict is None:
            filter_dict = {}
            
        cursor = self.db[collection_name].find(filter_dict)
        cursor = cursor.sort(sort_field, sort_direction)
        cursor = cursor.skip(skip).limit(limit)
        
        documents = await cursor.to_list(length=limit)
        for doc in documents:
            doc['_id'] = str(doc['_id'])
        return documents

    async def update_document(
        self, 
        collection_name: str, 
        document_id: str, 
        update_data: Dict[str, Any]
    ) -> bool:
        """Update a document by ID"""
        update_data['updated_at'] = datetime.utcnow()
        
        result = await self.db[collection_name].update_one(
            {"id": document_id},
            {"$set": update_data}
        )
        return result.modified_count > 0

    async def delete_document(self, collection_name: str, document_id: str) -> bool:
        """Delete a document by ID"""
        result = await self.db[collection_name].delete_one({"id": document_id})
        return result.deleted_count > 0

    async def count_documents(self, collection_name: str, filter_dict: Dict[str, Any] = None) -> int:
        """Count documents in a collection"""
        if filter_dict is None:
            filter_dict = {}
        return await self.db[collection_name].count_documents(filter_dict)

    # User-specific operations
    async def get_user_documents(
        self, 
        collection_name: str, 
        user_id: str,
        additional_filters: Dict[str, Any] = None,
        sort_field: str = "created_at",
        sort_direction: int = -1,
        limit: int = 100
    ) -> List[Dict[str, Any]]:
        """Get documents for a specific user"""
        filter_dict = {"user_id": user_id}
        if additional_filters:
            filter_dict.update(additional_filters)
            
        return await self.get_documents(
            collection_name, 
            filter_dict, 
            sort_field, 
            sort_direction, 
            limit
        )

    async def get_user_by_email(self, email: str) -> Optional[Dict[str, Any]]:
        """Get user by email"""
        user = await self.db.users.find_one({"email": email})
        if user:
            user['_id'] = str(user['_id'])
        return user

    # Stats operations
    async def get_global_stats(self) -> Dict[str, int]:
        """Get global statistics for the application"""
        total_users = await self.count_documents("users")
        total_goals = await self.count_documents("goals")
        completed_goals = await self.count_documents("goals", {"status": "completed"})
        total_posts = await self.count_documents("community_posts")
        public_journals = await self.count_documents("journal_entries", {"is_public": True})
        
        return {
            "total_users": total_users,
            "goals_achieved": completed_goals,
            "affirmations_completed": total_goals * 10,  # Estimate
            "community_posts": total_posts,
            "success_stories": public_journals
        }

    async def get_user_stats(self, user_id: str) -> Dict[str, Any]:
        """Get statistics for a specific user"""
        total_goals = await self.count_documents("goals", {"user_id": user_id})
        completed_goals = await self.count_documents("goals", {"user_id": user_id, "status": "completed"})
        total_journal_entries = await self.count_documents("journal_entries", {"user_id": user_id})
        total_habits = await self.count_documents("habits", {"user_id": user_id})
        total_affirmations = await self.count_documents("affirmations", {"user_id": user_id})
        
        # Calculate streak (simplified)
        habits = await self.get_user_documents("habits", user_id)
        max_streak = 0
        for habit in habits:
            if habit.get('streak', 0) > max_streak:
                max_streak = habit.get('streak', 0)
        
        return {
            "total_goals": total_goals,
            "completed_goals": completed_goals,
            "total_journal_entries": total_journal_entries,
            "total_habits": total_habits,
            "total_affirmations": total_affirmations,
            "max_streak": max_streak
        }

# Global database instance
database = Database()