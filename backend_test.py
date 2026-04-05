#!/usr/bin/env python3
"""
Backend Test Suite for Manifest 12 Platform
Testing the user registration endpoint at POST /api/auth/register
"""

import asyncio
import aiohttp
import json
import sys
from datetime import datetime
import pymongo
from pymongo import MongoClient
import bcrypt

# Test configuration
BASE_URL = "http://localhost:8001"
MONGO_URL = "mongodb://localhost:27017"
DB_NAME = "manifest12"

class RegistrationTester:
    def __init__(self):
        self.session = None
        self.mongo_client = None
        self.db = None
        self.test_results = []
        
    async def setup(self):
        """Setup test environment"""
        print("🔧 Setting up test environment...")
        
        # Setup HTTP session
        self.session = aiohttp.ClientSession()
        
        # Setup MongoDB connection
        try:
            self.mongo_client = MongoClient(MONGO_URL)
            self.db = self.mongo_client[DB_NAME]
            # Test connection
            self.mongo_client.admin.command('ping')
            print("✅ MongoDB connection established")
        except Exception as e:
            print(f"❌ MongoDB connection failed: {e}")
            return False
            
        return True
    
    async def cleanup(self):
        """Cleanup test environment"""
        if self.session:
            await self.session.close()
        if self.mongo_client:
            self.mongo_client.close()
    
    def log_test(self, test_name, success, details, response_code=None):
        """Log test results"""
        status = "✅ PASS" if success else "❌ FAIL"
        result = {
            "test": test_name,
            "success": success,
            "details": details,
            "response_code": response_code,
            "timestamp": datetime.now().isoformat()
        }
        self.test_results.append(result)
        print(f"{status} {test_name}")
        if details:
            print(f"   Details: {details}")
        if response_code:
            print(f"   Response Code: {response_code}")
        print()
    
    async def test_valid_registration(self):
        """Test 1: Valid user registration"""
        test_name = "Valid User Registration"
        
        # Clean up any existing test user
        self.db.users.delete_many({"email": "testuser@example.com"})
        
        user_data = {
            "email": "testuser@example.com",
            "password": "testpass123",
            "full_name": "Test User"
        }
        
        try:
            async with self.session.post(
                f"{BASE_URL}/api/auth/register",
                json=user_data,
                headers={"Content-Type": "application/json"}
            ) as response:
                response_code = response.status
                response_data = await response.json()
                
                if response_code == 200:
                    # Check response structure
                    required_fields = ["access_token", "token_type", "user"]
                    missing_fields = [field for field in required_fields if field not in response_data]
                    
                    if missing_fields:
                        self.log_test(test_name, False, f"Missing fields in response: {missing_fields}", response_code)
                        return
                    
                    # Check user data structure
                    user_data_response = response_data["user"]
                    user_required_fields = ["id", "email", "full_name", "is_active", "created_at"]
                    missing_user_fields = [field for field in user_required_fields if field not in user_data_response]
                    
                    if missing_user_fields:
                        self.log_test(test_name, False, f"Missing user fields: {missing_user_fields}", response_code)
                        return
                    
                    # Verify user data matches input
                    if (user_data_response["email"] == user_data["email"] and 
                        user_data_response["full_name"] == user_data["full_name"] and
                        user_data_response["is_active"] == True):
                        self.log_test(test_name, True, "User registered successfully with correct data", response_code)
                    else:
                        self.log_test(test_name, False, "User data in response doesn't match input", response_code)
                else:
                    self.log_test(test_name, False, f"Registration failed: {response_data}", response_code)
                    
        except Exception as e:
            self.log_test(test_name, False, f"Request failed: {str(e)}")
    
    async def test_short_password_validation(self):
        """Test 3: Short password validation"""
        test_name = "Short Password Validation"
        
        user_data = {
            "email": "shortpass@example.com",
            "password": "123",  # Less than 6 characters
            "full_name": "Short Pass User"
        }
        
        try:
            async with self.session.post(
                f"{BASE_URL}/api/auth/register",
                json=user_data,
                headers={"Content-Type": "application/json"}
            ) as response:
                response_code = response.status
                response_data = await response.json()
                
                if response_code == 400:  # Bad request for password validation
                    self.log_test(test_name, True, "Short password correctly rejected", response_code)
                else:
                    self.log_test(test_name, False, f"Short password not rejected properly: {response_data}", response_code)
                    
        except Exception as e:
            self.log_test(test_name, False, f"Request failed: {str(e)}")
    
    async def test_invalid_email_validation(self):
        """Test 4: Invalid email format validation"""
        test_name = "Invalid Email Format Validation"
        
        user_data = {
            "email": "invalid-email-format",  # Invalid email
            "password": "validpass123",
            "full_name": "Invalid Email User"
        }
        
        try:
            async with self.session.post(
                f"{BASE_URL}/api/auth/register",
                json=user_data,
                headers={"Content-Type": "application/json"}
            ) as response:
                response_code = response.status
                response_data = await response.json()
                
                if response_code == 422:  # Validation error
                    self.log_test(test_name, True, "Invalid email format correctly rejected", response_code)
                else:
                    self.log_test(test_name, False, f"Invalid email not rejected properly: {response_data}", response_code)
                    
        except Exception as e:
            self.log_test(test_name, False, f"Request failed: {str(e)}")
    
    async def test_duplicate_email_registration(self):
        """Test 5: Duplicate email registration"""
        test_name = "Duplicate Email Registration"
        
        # First, register a user
        user_data = {
            "email": "duplicate@example.com",
            "password": "password123",
            "full_name": "First User"
        }
        
        # Clean up any existing user
        self.db.users.delete_many({"email": "duplicate@example.com"})
        
        try:
            # First registration
            async with self.session.post(
                f"{BASE_URL}/api/auth/register",
                json=user_data,
                headers={"Content-Type": "application/json"}
            ) as response:
                first_response_code = response.status
                
                if first_response_code != 200:
                    self.log_test(test_name, False, "First registration failed", first_response_code)
                    return
            
            # Second registration with same email
            user_data["full_name"] = "Second User"
            async with self.session.post(
                f"{BASE_URL}/api/auth/register",
                json=user_data,
                headers={"Content-Type": "application/json"}
            ) as response:
                response_code = response.status
                response_data = await response.json()
                
                if response_code == 400 and "already registered" in response_data.get("detail", "").lower():
                    self.log_test(test_name, True, "Duplicate email correctly rejected", response_code)
                else:
                    self.log_test(test_name, False, f"Duplicate email not handled properly: {response_data}", response_code)
                    
        except Exception as e:
            self.log_test(test_name, False, f"Request failed: {str(e)}")
    
    def test_password_hashing(self):
        """Test 6: Verify passwords are properly hashed in database"""
        test_name = "Password Hashing Verification"
        
        try:
            # Find the test user we created
            user = self.db.users.find_one({"email": "testuser@example.com"})
            
            if not user:
                self.log_test(test_name, False, "Test user not found in database")
                return
            
            if "password_hash" not in user:
                self.log_test(test_name, False, "No password_hash field found in user document")
                return
            
            password_hash = user["password_hash"]
            
            # Check if it looks like a bcrypt hash
            if password_hash.startswith("$2b$") and len(password_hash) == 60:
                # Verify the hash works with the original password
                original_password = "testpass123"
                if bcrypt.checkpw(original_password.encode('utf-8'), password_hash.encode('utf-8')):
                    self.log_test(test_name, True, "Password properly hashed and verifiable")
                else:
                    self.log_test(test_name, False, "Password hash doesn't verify against original password")
            else:
                self.log_test(test_name, False, f"Password doesn't appear to be properly hashed: {password_hash[:20]}...")
                
        except Exception as e:
            self.log_test(test_name, False, f"Database check failed: {str(e)}")
    
    def test_user_creation_in_database(self):
        """Test 7: Verify user is actually created in MongoDB"""
        test_name = "User Creation in Database"
        
        try:
            # Check if test user exists in database
            user = self.db.users.find_one({"email": "testuser@example.com"})
            
            if user:
                # Verify all required fields are present
                required_fields = ["id", "email", "full_name", "is_active", "created_at", "password_hash"]
                missing_fields = [field for field in required_fields if field not in user]
                
                if missing_fields:
                    self.log_test(test_name, False, f"User missing required fields: {missing_fields}")
                else:
                    # Verify field values
                    if (user["email"] == "testuser@example.com" and 
                        user["full_name"] == "Test User" and
                        user["is_active"] == True):
                        self.log_test(test_name, True, "User correctly created in database with all fields")
                    else:
                        self.log_test(test_name, False, "User data in database doesn't match expected values")
            else:
                self.log_test(test_name, False, "User not found in database")
                
        except Exception as e:
            self.log_test(test_name, False, f"Database check failed: {str(e)}")
    
    async def run_all_tests(self):
        """Run all registration tests"""
        print("🚀 Starting User Registration Endpoint Tests")
        print("=" * 60)
        
        if not await self.setup():
            print("❌ Setup failed, aborting tests")
            return
        
        try:
            # Run all tests
            await self.test_valid_registration()
            await self.test_short_password_validation()
            await self.test_invalid_email_validation()
            await self.test_duplicate_email_registration()
            self.test_password_hashing()
            self.test_user_creation_in_database()
            
        finally:
            await self.cleanup()
        
        # Print summary
        print("=" * 60)
        print("📊 TEST SUMMARY")
        print("=" * 60)
        
        passed = sum(1 for result in self.test_results if result["success"])
        total = len(self.test_results)
        
        print(f"Total Tests: {total}")
        print(f"Passed: {passed}")
        print(f"Failed: {total - passed}")
        print(f"Success Rate: {(passed/total)*100:.1f}%")
        
        if total - passed > 0:
            print("\n❌ FAILED TESTS:")
            for result in self.test_results:
                if not result["success"]:
                    print(f"  - {result['test']}: {result['details']}")
        
        print("\n" + "=" * 60)
        return passed == total

async def main():
    """Main test runner"""
    tester = RegistrationTester()
    success = await tester.run_all_tests()
    
    if success:
        print("🎉 All tests passed!")
        sys.exit(0)
    else:
        print("💥 Some tests failed!")
        sys.exit(1)

if __name__ == "__main__":
    asyncio.run(main())