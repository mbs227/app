import requests
import json
import time
import random
import string
from datetime import datetime

# Get the base URL from frontend .env file
BACKEND_URL = "https://8e339c75-6530-4d24-9a1d-5a894763e0dd.preview.emergentagent.com"
API_BASE_URL = f"{BACKEND_URL}/api"

# Test data
def generate_random_email():
    """Generate a random email for testing"""
    random_str = ''.join(random.choices(string.ascii_lowercase + string.digits, k=8))
    return f"test_{random_str}@example.com"

TEST_USER = {
    "email": generate_random_email(),
    "password": "TestPassword123!",
    "full_name": "Test User"
}

TEST_CYCLE = {
    "title": "My 12-Week Transformation",
    "description": "This is a test cycle for manifesting my goals",
    "law_of_attraction_statement": "I am attracting abundance and success in all areas of my life"
}

TEST_GOAL = {
    "title": "Master Meditation Practice",
    "description": "Develop a consistent meditation practice to enhance manifestation abilities",
    "category": "personal_development",
    "start_week": 1,
    "target_week": 6,
    "why_statement": "I am developing my meditation practice because it aligns me with my highest self and amplifies my manifestation power",
    "visualization_note": "I see myself sitting peacefully each morning, completely present and connected to source energy",
    "milestones": [
        {
            "title": "Meditate 10 minutes daily for one week"
        },
        {
            "title": "Increase to 20 minutes daily"
        },
        {
            "title": "Experience deep state of presence"
        }
    ]
}

TEST_GOAL_2 = {
    "title": "Launch Online Business",
    "description": "Create and launch my online coaching business",
    "category": "career",
    "start_week": 2,
    "target_week": 10,
    "why_statement": "I am launching this business because I'm meant to share my gifts with the world and create financial abundance",
    "visualization_note": "I see myself confidently helping clients transform their lives while earning abundant income",
    "milestones": [
        {
            "title": "Create business plan"
        },
        {
            "title": "Build website"
        },
        {
            "title": "Sign first 3 clients"
        }
    ]
}

TEST_REFLECTION = {
    "week_number": 1,
    "progress_review": "Made significant progress on my meditation practice this week. Started with 5 minutes and worked up to 10 minutes daily.",
    "law_of_attraction_manifestations": [
        "Attracted a new opportunity to speak at a local event",
        "Found the perfect meditation cushion at a thrift store"
    ],
    "neville_goddard_practice": "I've been practicing the 'living in the end' technique by feeling the satisfaction of having a consistent meditation practice",
    "challenges": "Found it difficult to quiet my mind the first few days",
    "insights": "I realized that consistency matters more than duration at this stage",
    "next_week_focus": [
        "Increase meditation to 15 minutes",
        "Add evening gratitude practice"
    ],
    "mood_rating": 8
}

# Test results tracking
test_results = {
    "passed": 0,
    "failed": 0,
    "tests": []
}

def log_test(name, passed, message="", response=None):
    """Log test results"""
    status = "PASSED" if passed else "FAILED"
    test_results["tests"].append({
        "name": name,
        "status": status,
        "message": message
    })
    
    if passed:
        test_results["passed"] += 1
        print(f"✅ {name}: {status}")
        if message:
            print(f"   {message}")
    else:
        test_results["failed"] += 1
        print(f"❌ {name}: {status}")
        print(f"   {message}")
        if response:
            try:
                print(f"   Response: {response.status_code} - {response.json()}")
            except:
                print(f"   Response: {response.status_code} - {response.text}")

def test_api_health():
    """Test 1: API Health Check"""
    try:
        response = requests.get(f"{API_BASE_URL}/")
        if response.status_code == 200:
            log_test("API Health Check", True, "API is responding correctly")
            return True
        else:
            log_test("API Health Check", False, f"API returned status code {response.status_code}", response)
            return False
    except Exception as e:
        log_test("API Health Check", False, f"Exception: {str(e)}")
        return False

def test_user_registration():
    """Test 2: User Registration"""
    try:
        response = requests.post(
            f"{API_BASE_URL}/auth/register",
            json=TEST_USER
        )
        
        if response.status_code == 200:
            data = response.json()
            if "access_token" in data and "user" in data:
                log_test("User Registration", True, f"Successfully registered user: {TEST_USER['email']}")
                return data
            else:
                log_test("User Registration", False, "Response missing token or user data", response)
                return None
        else:
            log_test("User Registration", False, f"Registration failed with status code {response.status_code}", response)
            return None
    except Exception as e:
        log_test("User Registration", False, f"Exception: {str(e)}")
        return None

def test_user_login():
    """Test 3: User Login"""
    try:
        response = requests.post(
            f"{API_BASE_URL}/auth/login",
            json={
                "email": TEST_USER["email"],
                "password": TEST_USER["password"]
            }
        )
        
        if response.status_code == 200:
            data = response.json()
            if "access_token" in data and "user" in data:
                log_test("User Login", True, f"Successfully logged in as: {TEST_USER['email']}")
                return data
            else:
                log_test("User Login", False, "Response missing token or user data", response)
                return None
        else:
            log_test("User Login", False, f"Login failed with status code {response.status_code}", response)
            return None
    except Exception as e:
        log_test("User Login", False, f"Exception: {str(e)}")
        return None

def test_protected_route_without_token():
    """Test 4a: Protected Route Access Without Token"""
    try:
        response = requests.get(f"{API_BASE_URL}/auth/me")
        
        if response.status_code == 401 or response.status_code == 403:
            log_test("Protected Route (No Token)", True, "Correctly denied access to protected route without token")
            return True
        else:
            log_test("Protected Route (No Token)", False, 
                    f"Expected 401/403, got {response.status_code}. Protected route should not be accessible without token", response)
            return False
    except Exception as e:
        log_test("Protected Route (No Token)", False, f"Exception: {str(e)}")
        return False

def test_protected_route_with_token(token):
    """Test 4b: Protected Route Access With Token"""
    try:
        headers = {"Authorization": f"Bearer {token}"}
        response = requests.get(f"{API_BASE_URL}/auth/me", headers=headers)
        
        if response.status_code == 200:
            data = response.json()
            if "email" in data and data["email"] == TEST_USER["email"]:
                log_test("Protected Route (With Token)", True, "Successfully accessed protected route with token")
                return data
            else:
                log_test("Protected Route (With Token)", False, "Response data doesn't match expected user", response)
                return None
        else:
            log_test("Protected Route (With Token)", False, f"Failed to access protected route with status code {response.status_code}", response)
            return None
    except Exception as e:
        log_test("Protected Route (With Token)", False, f"Exception: {str(e)}")
        return None

def test_jwt_token_validation(token):
    """Test 5: JWT Token Validation"""
    # We'll test this by modifying the token slightly and ensuring it fails
    try:
        # Tamper with the token by changing the last character
        invalid_token = token[:-1] + ('a' if token[-1] != 'a' else 'b')
        
        headers = {"Authorization": f"Bearer {invalid_token}"}
        response = requests.get(f"{API_BASE_URL}/auth/me", headers=headers)
        
        if response.status_code == 401 or response.status_code == 403:
            log_test("JWT Token Validation", True, "Correctly rejected tampered token")
            return True
        else:
            log_test("JWT Token Validation", False, "System accepted an invalid token, which is a security issue", response)
            return False
    except Exception as e:
        log_test("JWT Token Validation", False, f"Exception: {str(e)}")
        return False

def test_create_cycle(token):
    """Test 6: Cycle Management - Create Cycle"""
    try:
        headers = {"Authorization": f"Bearer {token}"}
        response = requests.post(
            f"{API_BASE_URL}/cycles",
            headers=headers,
            json=TEST_CYCLE
        )
        
        if response.status_code == 200:
            data = response.json()
            if "id" in data and data["title"] == TEST_CYCLE["title"]:
                log_test("Create Cycle", True, "Successfully created a 12-week cycle")
                return data
            else:
                log_test("Create Cycle", False, "Response data doesn't match expected cycle data", response)
                return None
        else:
            log_test("Create Cycle", False, f"Failed to create cycle with status code {response.status_code}", response)
            return None
    except Exception as e:
        log_test("Create Cycle", False, f"Exception: {str(e)}")
        return None

def test_get_cycles(token):
    """Test 7: Cycle Management - Get Cycles"""
    try:
        headers = {"Authorization": f"Bearer {token}"}
        response = requests.get(f"{API_BASE_URL}/cycles", headers=headers)
        
        if response.status_code == 200:
            data = response.json()
            if isinstance(data, list):
                log_test("Get Cycles", True, f"Successfully retrieved cycles. Count: {len(data)}")
                return data
            else:
                log_test("Get Cycles", False, "Response is not a list of cycles", response)
                return None
        else:
            log_test("Get Cycles", False, f"Failed to get cycles with status code {response.status_code}", response)
            return None
    except Exception as e:
        log_test("Get Cycles", False, f"Exception: {str(e)}")
        return None

def test_error_handling_duplicate_email():
    """Test 8a: Error Handling - Duplicate Email"""
    try:
        # Try to register with the same email again
        response = requests.post(
            f"{API_BASE_URL}/auth/register",
            json=TEST_USER
        )
        
        if response.status_code == 400:
            log_test("Error Handling - Duplicate Email", True, "Correctly rejected duplicate email registration")
            return True
        else:
            log_test("Error Handling - Duplicate Email", False, 
                    f"Expected 400, got {response.status_code}. System should reject duplicate emails", response)
            return False
    except Exception as e:
        log_test("Error Handling - Duplicate Email", False, f"Exception: {str(e)}")
        return False

def test_error_handling_invalid_login():
    """Test 8b: Error Handling - Invalid Login"""
    try:
        response = requests.post(
            f"{API_BASE_URL}/auth/login",
            json={
                "email": TEST_USER["email"],
                "password": "WrongPassword123!"
            }
        )
        
        if response.status_code == 401:
            log_test("Error Handling - Invalid Login", True, "Correctly rejected invalid login credentials")
            return True
        else:
            log_test("Error Handling - Invalid Login", False, 
                    f"Expected 401, got {response.status_code}. System should reject invalid credentials", response)
            return False
    except Exception as e:
        log_test("Error Handling - Invalid Login", False, f"Exception: {str(e)}")
        return False

def test_error_handling_missing_fields():
    """Test 8c: Error Handling - Missing Fields"""
    try:
        response = requests.post(
            f"{API_BASE_URL}/auth/register",
            json={
                "email": generate_random_email(),
                # Missing password and full_name
            }
        )
        
        if response.status_code >= 400:
            log_test("Error Handling - Missing Fields", True, "Correctly rejected registration with missing fields")
            return True
        else:
            log_test("Error Handling - Missing Fields", False, 
                    f"Expected 400+, got {response.status_code}. System should reject incomplete data", response)
            return False
    except Exception as e:
        log_test("Error Handling - Missing Fields", False, f"Exception: {str(e)}")
        return False

def run_all_tests():
    """Run all tests in sequence"""
    print("\n🔍 Starting Manifest 12 Backend API Tests...\n")
    
    # Test 1: API Health Check
    api_health = test_api_health()
    if not api_health:
        print("\n❌ API Health Check failed. Stopping tests.")
        return summarize_results()
    
    # Test 2: User Registration
    registration_data = test_user_registration()
    if not registration_data:
        print("\n❌ User Registration failed. Stopping tests.")
        return summarize_results()
    
    token = registration_data["access_token"]
    
    # Test 3: User Login
    login_data = test_user_login()
    if not login_data:
        print("\n❌ User Login failed. Stopping tests.")
        return summarize_results()
    
    # Use the token from login for subsequent tests
    token = login_data["access_token"]
    
    # Test 4: Protected Routes
    test_protected_route_without_token()
    user_data = test_protected_route_with_token(token)
    
    # Test 5: JWT Token Validation
    test_jwt_token_validation(token)
    
    # Test 6-7: Cycle Management
    cycle_data = test_create_cycle(token)
    if cycle_data:
        test_get_cycles(token)
    
    # Test 8: Error Handling
    test_error_handling_duplicate_email()
    test_error_handling_invalid_login()
    test_error_handling_missing_fields()
    
    return summarize_results()

def summarize_results():
    """Summarize test results"""
    total = test_results["passed"] + test_results["failed"]
    pass_percentage = (test_results["passed"] / total) * 100 if total > 0 else 0
    
    print("\n" + "="*80)
    print(f"TEST SUMMARY: {test_results['passed']}/{total} tests passed ({pass_percentage:.1f}%)")
    print("="*80)
    
    if test_results["failed"] > 0:
        print("\nFAILED TESTS:")
        for test in test_results["tests"]:
            if test["status"] == "FAILED":
                print(f"❌ {test['name']}: {test['message']}")
    
    print("\n" + "="*80)
    return test_results

if __name__ == "__main__":
    run_all_tests()