from motor.motor_asyncio import AsyncIOMotorClient
from pymongo.errors import ConnectionError as MongoConnectionError
import os
from datetime import datetime
from typing import List, Optional, Dict, Any
from server import logger
from backend.constants import COLLECTIONS

class Database:
    def __init__(self):
        self.client = None
        self.db = None

    async def connect(self):
        """Connect to MongoDB database"""
        try:
            mongo_url = os.environ.get('MONGO_URL')
            db_name = os.environ.get('DB_NAME', 'manifestlife')
            self.client = AsyncIOMotorClient(mongo_url)
            self.db = self.client[db_name]
            await self.create_indexes()
        except MongoConnectionError as e:
            logger.error(f"Failed to connect to MongoDB: {e}")
            raise

    async def disconnect(self):
        """Disconnect from MongoDB database"""
        if self.client:
            self.client.close()

    async def create_indexes(self):
        """Create database indexes for better performance"""
        try:
            # Journal indexes
            await self.db[COLLECTIONS["JOURNAL_ENTRIES"]].create_index("user_id")
            await self.db[COLLECTIONS["JOURNAL_ENTRIES"]].create_index([("is_public", 1), ("created_at", -1)])
            
            # Affirmation indexes
            await self.db[COLLECTIONS["AFFIRMATIONS"]].create_index("user_id")
            await self.db[COLLECTIONS["AFFIRMATIONS"]].create_index([("user_id", 1), ("is_active", 1)])
            
            # Habit indexes
            await self.db[COLLECTIONS["HABITS"]].create_index("user_id")
            
            # Gratitude indexes
            await self.db[COLLECTIONS["GRATITUDE_ENTRIES"]].create_index("user_id")
            
            # Community indexes
            await self.db[COLLECTIONS["COMMUNITY_POSTS"]].create_index("user_id")
            await self.db[COLLECTIONS["COMMUNITY_POSTS"]].create_index([("created_at", -1)])
            
            # Vision board indexes
            await self.db[COLLECTIONS["VISION_BOARDS"]].create_index("user_id")
            
            # Template session indexes
            await self.db[COLLECTIONS["TEMPLATE_SESSIONS"]].create_index("user_id")
            await self.db[COLLECTIONS["TEMPLATE_SESSIONS"]].create_index([("user_id", 1), ("is_active", 1)])
            
            logger.info("Database indexes created successfully")
        except Exception as e:
            logger.error(f"Error creating indexes: {e}")

    async def create_index(self, collection: str, field: str, unique: bool = False):
        """Create a single index on a collection"""
        try:
            await self.db[collection].create_index(field, unique=unique)
            logger.info(f"Created index on {collection}.{field} (unique={unique})")
        except Exception as e:
            logger.error(f"Error creating index on {collection}.{field}: {e}")

    async def drop_collection(self, collection_name: str):
        """Drop a collection (for testing purposes)"""
        try:
            await self.db[collection_name].drop()
            logger.info(f"Dropped collection {collection_name}")
        except Exception as e:
            logger.error(f"Error dropping collection {collection_name}: {e}")

    # Generic CRUD operations
    async def create_document(self, collection_name: str, document: Dict[str, Any]) -> str:
        """Create a new document in the specified collection"""
        document['created_at'] = datetime.utcnow()
        document['updated_at'] = datetime.utcnow()
        
        try:
            result = await self.db[collection_name].insert_one(document)
            return str(result.inserted_id)
        except MongoConnectionError as e:
            logger.error(f"Database connection error in create_document: {e}")
            raise
        except Exception as e:
            logger _

    async def get_document(self, collection_name: str, document_id: str) -> Optional[Dict[str, Any]]:
        """Get a document by ID"""
        try:
            document = await self.db[collection_name].find_one({"id": document_id})
            if document:
                document['_id'] = str(document['_id'])
            return document
        except MongoConnectionError as e:
            logger.error(f"Database connection error in get_document: {e}")
            raise
        except Exception as e:
            logger.error(f"Error in get_document: {e}")
            return None

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
            
        try:
            cursor = self.db[collection_name].find(filter_dict)
            cursor = cursor.sort(sort_field, sort_direction)
            cursor = cursor.skip(skip).limit(limit)
            
            documents = await cursor.to_list(length=limit)
            for doc in documents:
                doc['_id'] = str(doc['_id'])
            return documents
        except MongoConnectionError as e:
            logger.error(f"Database connection error in get_documents: {e}")
            raise
        except Exception as e:
            logger.error(f"Error in get_documents: {e}")
            return []

    async def update_document(
        self, 
        collection_name: str, 
        document_id: str, 
        update_data: Dict[str, Any]
    ) -> bool:
        """Update a document by ID"""
        update_data['updated_at'] = datetime.utcnow()
        
        try:
            result = await self.db[collection_name].update_one(
                {"id": document_id},
                {"$set": update_data}
            )
            return result.modified_count > 0
        except MongoConnectionError as e:
            logger.error(f"Database connection error in update_document: {e}")
            raise
        except Exception as e:
            logger.error(f"Error in update_document: {e}")
            return False

    async def delete_document(self, collection_name: str, document_id: str) -> bool:
        """Delete a document by ID"""
        try:
            result = await self.db[collection_name].delete_one({"id": document_id})
            return result.deleted_count > 0
        except MongoConnectionError as e:
            logger.error(f"Database connection error in delete_document: {e}")
            raise
        except Exception as e:
            logger.error(f"Error in delete_document: {e}")
            return False

    async def count_documents(self, collection_name: str, filter_dict: Dict[str, Any] = None) -> int:
        """Count documents in a collection"""
        if filter_dict is None:
            filter_dict = {}
        try:
            return await self.db[collection_name].count_documents(filter_dict)
        except MongoConnectionError as e:
            logger.error(f"Database connection error in count_documents: {e}")
            raise
        except Exception as e:
            logger.error(f"Error in count_documents: {e}")
            return 0

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
        try:
            user = await self.db[COLLECTIONS["USERS"]].find_one({"email": email})
            if user:
                user['_id'] = str(user['_id'])
            return user
        except MongoConnectionError as e:
            logger.error(f"Database connection error in get_user_by_email: {e}")
            raise
        except Exception as e:
            logger.error(f"Error in get_user_by_email: {e}")
            return None

    # Stats operations
    async def get_global_stats(self) -> Dict[str, int]:
        """Get global statistics for the application"""
        try:
            total_users = await self.count_documents(COLLECTIONS["USERS"])
            total_goals = await self.count_documents(COLLECTIONS["GOALS"])
            completed_goals = await self.count_documents(COLLECTIONS["GOALS"], {"status": "completed"})
            total_posts = await self.count_documents(COLLECTIONS["COMMUNITY_POSTS"])
            public_journals = await self.count_documents(COLLECTIONS["JOURNAL_ENTRIES"], {"is_public": True})
            
            return {
                "total_users": total_users,
                "goals_achieved": completed_goals,
                "affirmations_completed": total_goals * 10,  # Estimate
                "community_posts": total_posts,
                "success_stories": public_journals
            }
        except MongoConnectionError as e:
            logger.error(f"Database connection error in get_global_stats: {e}")
            raise
        except Exception as e:
            logger.error(f"Error in get_global_stats: {e}")
            return {}

    async def get_user_stats(self, user_id: str) -> Dict[str, Any]:
        """Get statistics for a specific user"""
        try:
            total_goals = await self.count_documents(COLLECTIONS["GOALS"], {"user_id": user_id})
            completed_goals = await self.count_documents(COLLECTIONS["GOALS"], {"user_id": user_id, "status": "completed"})
            total_journal_entries = await self.count_documents(COLLECTIONS["JOURNAL_ENTRIES"], {"user_id": user_id})
            total_habits = await self.count_documents(COLLECTIONS["HABITS"], {"user_id": user_id})
            total_affirmations = await self.count_documents(COLLECTIONS["AFFIRMATIONS"], {"user_id": user_id})
            
            # Calculate streak (simplified)
            habits = await self.get_user_documents(COLLECTIONS["HABITS"], user_id)
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
        except MongoConnectionError as e:
            logger.error(f"Database connection error in get_user_stats: {e}")
            raise
        except Exception as e:
            logger.error(f"Error in get_user_stats: {e}")
            return {}

# Global database instance
database = Database()
