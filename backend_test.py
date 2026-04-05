#!/usr/bin/env python3
"""
Backend API Testing Script for Manifest 12 Platform
Testing endpoints after Mangum serverless wrapper addition
"""

import requests
import json
import sys
from datetime import datetime

# Backend URL - using localhost:8001 as per supervisor configuration
BASE_URL = "http://localhost:8001"
API_BASE = f"{BASE_URL}/api"

# Test credentials from /app/memory/test_credentials.md
TEST_USERS = [
    {
        "email": "test@example.com",
        "password": "test123",
        "full_name": "Test User"
    },
    {
        "email": "john.doe@example.com", 
        "password": "password123",
        "full_name": "John Doe"
    },
    {
        "email": "emma.wilson@example.com",
        "password": "manifest2024", 
        "full_name": "Emma Wilson"
    }
]

class BackendTester:
    def __init__(self):
        self.session = requests.Session()
        self.access_token = None
        self.user_id = None
        self.test_results = []
        
    def log_result(self, test_name, success, message, details=None):
        """Log test result"""
        status = "✅ PASS" if success else "❌ FAIL"
        result = {
            "test": test_name,
            "status": status,
            "message": message,
            "details": details or {}
        }
        self.test_results.append(result)
        print(f"{status}: {test_name} - {message}")
        if details and not success:
            print(f"   Details: {details}")
    
    def test_health_check(self):
        """Test basic API health"""
        try:
            response = self.session.get(f"{API_BASE}/")
            if response.status_code == 200:
                self.log_result("API Health Check", True, "API is responding")
                return True
            else:
                self.log_result("API Health Check", False, f"API returned status {response.status_code}")
                return False
        except Exception as e:
            self.log_result("API Health Check", False, f"Connection failed: {str(e)}")
            return False
    
    def test_user_registration(self):
        """Test POST /api/auth/register"""
        test_user = {
            "email": f"test_mangum_{datetime.now().strftime('%Y%m%d_%H%M%S')}@example.com",
            "password": "testpass123",
            "full_name": "Mangum Test User"
        }
        
        try:
            response = self.session.post(
                f"{API_BASE}/auth/register",
                json=test_user,
                headers={"Content-Type": "application/json"}
            )
            
            if response.status_code == 200:
                data = response.json()
                if "access_token" in data and "user" in data:
                    self.access_token = data["access_token"]
                    self.user_id = data["user"]["id"]
                    self.log_result("User Registration", True, "Successfully registered new user")
                    return True
                else:
                    self.log_result("User Registration", False, "Missing access_token or user in response", data)
                    return False
            else:
                self.log_result("User Registration", False, f"Registration failed with status {response.status_code}", response.text)
                return False
                
        except Exception as e:
            self.log_result("User Registration", False, f"Registration request failed: {str(e)}")
            return False
    
    def test_user_login(self):
        """Test POST /api/auth/login with existing user"""
        # Try to login with existing test user
        login_data = {
            "email": TEST_USERS[0]["email"],
            "password": TEST_USERS[0]["password"]
        }
        
        try:
            response = self.session.post(
                f"{API_BASE}/auth/login",
                json=login_data,
                headers={"Content-Type": "application/json"}
            )
            
            if response.status_code == 200:
                data = response.json()
                if "access_token" in data and "user" in data:
                    # Update token for subsequent tests if registration didn't work
                    if not self.access_token:
                        self.access_token = data["access_token"]
                        self.user_id = data["user"]["id"]
                    self.log_result("User Login", True, f"Successfully logged in user {login_data['email']}")
                    return True
                else:
                    self.log_result("User Login", False, "Missing access_token or user in response", data)
                    return False
            else:
                self.log_result("User Login", False, f"Login failed with status {response.status_code}", response.text)
                return False
                
        except Exception as e:
            self.log_result("User Login", False, f"Login request failed: {str(e)}")
            return False
    
    def test_auth_me(self):
        """Test GET /api/auth/me"""
        if not self.access_token:
            self.log_result("Auth Me Endpoint", False, "No access token available for testing")
            return False
            
        try:
            headers = {"Authorization": f"Bearer {self.access_token}"}
            response = self.session.get(f"{API_BASE}/auth/me", headers=headers)
            
            if response.status_code == 200:
                data = response.json()
                if "id" in data and "email" in data:
                    self.log_result("Auth Me Endpoint", True, f"Successfully retrieved user profile for {data.get('email')}")
                    return True
                else:
                    self.log_result("Auth Me Endpoint", False, "Invalid user data in response", data)
                    return False
            else:
                self.log_result("Auth Me Endpoint", False, f"Auth me failed with status {response.status_code}", response.text)
                return False
                
        except Exception as e:
            self.log_result("Auth Me Endpoint", False, f"Auth me request failed: {str(e)}")
            return False
    
    def test_get_cycles(self):
        """Test GET /api/cycles"""
        if not self.access_token:
            self.log_result("Get Cycles", False, "No access token available for testing")
            return False
            
        try:
            headers = {"Authorization": f"Bearer {self.access_token}"}
            response = self.session.get(f"{API_BASE}/cycles", headers=headers)
            
            if response.status_code == 200:
                data = response.json()
                if isinstance(data, list):
                    self.log_result("Get Cycles", True, f"Successfully retrieved {len(data)} cycles")
                    return True
                else:
                    self.log_result("Get Cycles", False, "Response is not a list", data)
                    return False
            else:
                self.log_result("Get Cycles", False, f"Get cycles failed with status {response.status_code}", response.text)
                return False
                
        except Exception as e:
            self.log_result("Get Cycles", False, f"Get cycles request failed: {str(e)}")
            return False
    
    def test_create_cycle(self):
        """Test POST /api/cycles"""
        if not self.access_token:
            self.log_result("Create Cycle", False, "No access token available for testing")
            return False
            
        cycle_data = {
            "title": "Mangum Test Cycle",
            "description": "Testing cycle creation after Mangum integration",
            "law_of_attraction_statement": "I am successfully manifesting my goals through focused intention and aligned action."
        }
        
        try:
            headers = {
                "Authorization": f"Bearer {self.access_token}",
                "Content-Type": "application/json"
            }
            response = self.session.post(f"{API_BASE}/cycles", json=cycle_data, headers=headers)
            
            if response.status_code == 200:
                data = response.json()
                if "id" in data and "title" in data:
                    self.log_result("Create Cycle", True, f"Successfully created cycle: {data['title']}")
                    return True
                else:
                    self.log_result("Create Cycle", False, "Invalid cycle data in response", data)
                    return False
            else:
                self.log_result("Create Cycle", False, f"Create cycle failed with status {response.status_code}", response.text)
                return False
                
        except Exception as e:
            self.log_result("Create Cycle", False, f"Create cycle request failed: {str(e)}")
            return False
    
    def test_get_goals(self):
        """Test GET /api/goals"""
        if not self.access_token:
            self.log_result("Get Goals", False, "No access token available for testing")
            return False
            
        try:
            headers = {"Authorization": f"Bearer {self.access_token}"}
            response = self.session.get(f"{API_BASE}/goals", headers=headers)
            
            if response.status_code == 200:
                data = response.json()
                if isinstance(data, list):
                    self.log_result("Get Goals", True, f"Successfully retrieved {len(data)} goals")
                    return True
                else:
                    self.log_result("Get Goals", False, "Response is not a list", data)
                    return False
            else:
                self.log_result("Get Goals", False, f"Get goals failed with status {response.status_code}", response.text)
                return False
                
        except Exception as e:
            self.log_result("Get Goals", False, f"Get goals request failed: {str(e)}")
            return False
    
    def run_all_tests(self):
        """Run all backend API tests"""
        print("=" * 60)
        print("BACKEND API TESTING - POST MANGUM INTEGRATION")
        print("=" * 60)
        print(f"Testing against: {API_BASE}")
        print()
        
        # Test sequence
        tests = [
            ("API Health Check", self.test_health_check),
            ("User Registration", self.test_user_registration),
            ("User Login", self.test_user_login),
            ("Auth Me Endpoint", self.test_auth_me),
            ("Get Cycles", self.test_get_cycles),
            ("Create Cycle", self.test_create_cycle),
            ("Get Goals", self.test_get_goals),
        ]
        
        passed = 0
        total = len(tests)
        
        for test_name, test_func in tests:
            try:
                if test_func():
                    passed += 1
            except Exception as e:
                self.log_result(test_name, False, f"Test execution failed: {str(e)}")
            print()
        
        # Summary
        print("=" * 60)
        print("TEST SUMMARY")
        print("=" * 60)
        print(f"Total Tests: {total}")
        print(f"Passed: {passed}")
        print(f"Failed: {total - passed}")
        print(f"Success Rate: {(passed/total)*100:.1f}%")
        print()
        
        # Detailed results
        print("DETAILED RESULTS:")
        for result in self.test_results:
            print(f"{result['status']}: {result['test']}")
            if result['details'] and result['status'].startswith('❌'):
                print(f"   Error: {result['details']}")
        
        return passed == total

if __name__ == "__main__":
    tester = BackendTester()
    success = tester.run_all_tests()
    sys.exit(0 if success else 1)