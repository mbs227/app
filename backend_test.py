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

def test_update_cycle(token, cycle_id):
    """Test 8: Enhanced Cycle Management - Update Cycle"""
    try:
        headers = {"Authorization": f"Bearer {token}"}
        update_data = {
            "current_week": 2,
            "status": "active",
            "law_of_attraction_statement": "I am manifesting my perfect life with ease and joy every day"
        }
        
        response = requests.put(
            f"{API_BASE_URL}/cycles/{cycle_id}",
            headers=headers,
            json=update_data
        )
        
        if response.status_code == 200:
            data = response.json()
            if (data["current_week"] == update_data["current_week"] and 
                data["status"] == update_data["status"] and
                data["law_of_attraction_statement"] == update_data["law_of_attraction_statement"]):
                log_test("Update Cycle", True, "Successfully updated cycle with new values")
                return data
            else:
                log_test("Update Cycle", False, "Response data doesn't match expected updated values", response)
                return None
        else:
            log_test("Update Cycle", False, f"Failed to update cycle with status code {response.status_code}", response)
            return None
    except Exception as e:
        log_test("Update Cycle", False, f"Exception: {str(e)}")
        return None

def test_create_goal(token, cycle_id):
    """Test 9: Goal Management - Create Goal"""
    try:
        headers = {"Authorization": f"Bearer {token}"}
        goal_data = TEST_GOAL.copy()
        
        response = requests.post(
            f"{API_BASE_URL}/goals",
            headers=headers,
            json={**goal_data, "cycle_id": cycle_id}
        )
        
        if response.status_code == 200:
            data = response.json()
            if "id" in data and data["title"] == goal_data["title"]:
                log_test("Create Goal", True, "Successfully created a goal with Law of Attraction integration")
                return data
            else:
                log_test("Create Goal", False, "Response data doesn't match expected goal data", response)
                return None
        else:
            log_test("Create Goal", False, f"Failed to create goal with status code {response.status_code}", response)
            return None
    except Exception as e:
        log_test("Create Goal", False, f"Exception: {str(e)}")
        return None

def test_create_second_goal(token, cycle_id):
    """Test 10: Goal Management - Create Second Goal"""
    try:
        headers = {"Authorization": f"Bearer {token}"}
        goal_data = TEST_GOAL_2.copy()
        
        response = requests.post(
            f"{API_BASE_URL}/goals",
            headers=headers,
            json={**goal_data, "cycle_id": cycle_id}
        )
        
        if response.status_code == 200:
            data = response.json()
            if "id" in data and data["title"] == goal_data["title"]:
                log_test("Create Second Goal", True, "Successfully created a second goal with different category")
                return data
            else:
                log_test("Create Second Goal", False, "Response data doesn't match expected goal data", response)
                return None
        else:
            log_test("Create Second Goal", False, f"Failed to create second goal with status code {response.status_code}", response)
            return None
    except Exception as e:
        log_test("Create Second Goal", False, f"Exception: {str(e)}")
        return None

def test_get_goals(token, cycle_id):
    """Test 11: Goal Management - Get Goals"""
    try:
        headers = {"Authorization": f"Bearer {token}"}
        response = requests.get(
            f"{API_BASE_URL}/goals?cycle_id={cycle_id}",
            headers=headers
        )
        
        if response.status_code == 200:
            data = response.json()
            if isinstance(data, list):
                log_test("Get Goals", True, f"Successfully retrieved goals. Count: {len(data)}")
                return data
            else:
                log_test("Get Goals", False, "Response is not a list of goals", response)
                return None
        else:
            log_test("Get Goals", False, f"Failed to get goals with status code {response.status_code}", response)
            return None
    except Exception as e:
        log_test("Get Goals", False, f"Exception: {str(e)}")
        return None

def test_get_specific_goal(token, goal_id):
    """Test 12: Goal Management - Get Specific Goal"""
    try:
        headers = {"Authorization": f"Bearer {token}"}
        response = requests.get(
            f"{API_BASE_URL}/goals/{goal_id}",
            headers=headers
        )
        
        if response.status_code == 200:
            data = response.json()
            if "id" in data and data["id"] == goal_id:
                log_test("Get Specific Goal", True, f"Successfully retrieved specific goal: {data['title']}")
                return data
            else:
                log_test("Get Specific Goal", False, "Response data doesn't match expected goal", response)
                return None
        else:
            log_test("Get Specific Goal", False, f"Failed to get specific goal with status code {response.status_code}", response)
            return None
    except Exception as e:
        log_test("Get Specific Goal", False, f"Exception: {str(e)}")
        return None

def test_update_goal(token, goal_id):
    """Test 13: Goal Management - Update Goal Progress"""
    try:
        headers = {"Authorization": f"Bearer {token}"}
        update_data = {
            "progress": 35,
            "status": "in_progress",
            "milestones": [
                {
                    "id": "milestone-id-will-be-replaced",  # Will be replaced in the code
                    "title": "Meditate 10 minutes daily for one week",
                    "completed": True,
                    "completed_date": datetime.utcnow().isoformat()
                },
                {
                    "id": "milestone-id-will-be-replaced-2",  # Will be replaced in the code
                    "title": "Increase to 20 minutes daily",
                    "completed": False,
                    "completed_date": None
                },
                {
                    "id": "milestone-id-will-be-replaced-3",  # Will be replaced in the code
                    "title": "Experience deep state of presence",
                    "completed": False,
                    "completed_date": None
                }
            ]
        }
        
        # First get the current goal to get the milestone IDs
        goal_response = requests.get(f"{API_BASE_URL}/goals/{goal_id}", headers=headers)
        if goal_response.status_code == 200:
            current_goal = goal_response.json()
            # Replace the placeholder milestone IDs with the actual ones
            for i in range(min(len(update_data["milestones"]), len(current_goal["milestones"]))):
                update_data["milestones"][i]["id"] = current_goal["milestones"][i]["id"]
        
        response = requests.put(
            f"{API_BASE_URL}/goals/{goal_id}",
            headers=headers,
            json=update_data
        )
        
        if response.status_code == 200:
            data = response.json()
            if (data["progress"] == update_data["progress"] and 
                data["status"] == update_data["status"] and
                data["milestones"][0]["completed"] == update_data["milestones"][0]["completed"]):
                log_test("Update Goal", True, "Successfully updated goal progress and milestone completion")
                return data
            else:
                log_test("Update Goal", False, "Response data doesn't match expected updated values", response)
                return None
        else:
            log_test("Update Goal", False, f"Failed to update goal with status code {response.status_code}", response)
            return None
    except Exception as e:
        log_test("Update Goal", False, f"Exception: {str(e)}")
        return None

def test_update_goal_progress(token, goal_id):
    """Test 17: Enhanced Goal Progress - Update Progress with Notes"""
    try:
        headers = {"Authorization": f"Bearer {token}"}
        progress_update = {
            "progress": 50,
            "notes": "Made significant progress this week with consistent practice",
            "milestone_updates": None  # We'll test milestone updates separately
        }
        
        response = requests.post(
            f"{API_BASE_URL}/goals/{goal_id}/progress",
            headers=headers,
            json=progress_update
        )
        
        if response.status_code == 200:
            data = response.json()
            if data["progress"] == progress_update["progress"]:
                log_test("Update Goal Progress", True, "Successfully updated goal progress with notes")
                return data
            else:
                log_test("Update Goal Progress", False, "Response data doesn't match expected progress value", response)
                return None
        else:
            log_test("Update Goal Progress", False, f"Failed to update goal progress with status code {response.status_code}", response)
            return None
    except Exception as e:
        log_test("Update Goal Progress", False, f"Exception: {str(e)}")
        return None

def test_update_goal_progress_with_milestones(token, goal_id):
    """Test 18: Enhanced Goal Progress - Update Progress with Milestone Tracking"""
    try:
        headers = {"Authorization": f"Bearer {token}"}
        
        # First get the current goal to get the milestone IDs
        goal_response = requests.get(f"{API_BASE_URL}/goals/{goal_id}", headers=headers)
        if goal_response.status_code != 200:
            log_test("Update Goal Progress with Milestones", False, "Failed to get current goal data", goal_response)
            return None
            
        current_goal = goal_response.json()
        milestones = current_goal["milestones"]
        
        if len(milestones) < 2:
            log_test("Update Goal Progress with Milestones", False, "Not enough milestones to test with")
            return None
        
        # Update the second milestone to completed
        milestones[1]["completed"] = True
        milestones[1]["completed_date"] = datetime.utcnow().isoformat()
        
        progress_update = {
            "progress": 75,
            "notes": "Completed the second milestone! Moving to the final stage.",
            "milestone_updates": milestones
        }
        
        response = requests.post(
            f"{API_BASE_URL}/goals/{goal_id}/progress",
            headers=headers,
            json=progress_update
        )
        
        if response.status_code == 200:
            data = response.json()
            if (data["progress"] == progress_update["progress"] and 
                data["milestones"][1]["completed"] == True):
                log_test("Update Goal Progress with Milestones", True, "Successfully updated goal progress with milestone tracking")
                return data
            else:
                log_test("Update Goal Progress with Milestones", False, "Response data doesn't match expected values", response)
                return None
        else:
            log_test("Update Goal Progress with Milestones", False, f"Failed to update goal progress with status code {response.status_code}", response)
            return None
    except Exception as e:
        log_test("Update Goal Progress with Milestones", False, f"Exception: {str(e)}")
        return None

def test_get_goal_progress_history(token, goal_id):
    """Test 19: Enhanced Goal Progress - Get Progress History"""
    try:
        headers = {"Authorization": f"Bearer {token}"}
        response = requests.get(
            f"{API_BASE_URL}/goals/{goal_id}/progress-history",
            headers=headers
        )
        
        if response.status_code == 200:
            data = response.json()
            if "goal_id" in data and data["goal_id"] == goal_id and "snapshots" in data:
                log_test("Get Goal Progress History", True, f"Successfully retrieved progress history with {len(data['snapshots'])} snapshots")
                return data
            else:
                log_test("Get Goal Progress History", False, "Response data doesn't match expected structure", response)
                return None
        else:
            log_test("Get Goal Progress History", False, f"Failed to get progress history with status code {response.status_code}", response)
            return None
    except Exception as e:
        log_test("Get Goal Progress History", False, f"Exception: {str(e)}")
        return None

def test_create_reflection(token, cycle_id):
    """Test 14: Weekly Reflection - Create Reflection"""
    try:
        headers = {"Authorization": f"Bearer {token}"}
        reflection_data = TEST_REFLECTION.copy()
        reflection_data["cycle_id"] = cycle_id
        
        response = requests.post(
            f"{API_BASE_URL}/reflections",
            headers=headers,
            json=reflection_data
        )
        
        if response.status_code == 200:
            data = response.json()
            if "id" in data and data["week_number"] == reflection_data["week_number"]:
                log_test("Create Reflection", True, "Successfully created a weekly reflection with manifestation data")
                return data
            else:
                log_test("Create Reflection", False, "Response data doesn't match expected reflection data", response)
                return None
        else:
            log_test("Create Reflection", False, f"Failed to create reflection with status code {response.status_code}", response)
            return None
    except Exception as e:
        log_test("Create Reflection", False, f"Exception: {str(e)}")
        return None

def test_get_reflections(token, cycle_id):
    """Test 15: Weekly Reflection - Get Reflections"""
    try:
        headers = {"Authorization": f"Bearer {token}"}
        response = requests.get(
            f"{API_BASE_URL}/reflections?cycle_id={cycle_id}",
            headers=headers
        )
        
        if response.status_code == 200:
            data = response.json()
            if isinstance(data, list):
                log_test("Get Reflections", True, f"Successfully retrieved reflections. Count: {len(data)}")
                return data
            else:
                log_test("Get Reflections", False, "Response is not a list of reflections", response)
                return None
        else:
            log_test("Get Reflections", False, f"Failed to get reflections with status code {response.status_code}", response)
            return None
    except Exception as e:
        log_test("Get Reflections", False, f"Exception: {str(e)}")
        return None

def test_get_specific_reflection(token, reflection_id):
    """Test 16: Weekly Reflection - Get Specific Reflection"""
    try:
        headers = {"Authorization": f"Bearer {token}"}
        response = requests.get(
            f"{API_BASE_URL}/reflections/{reflection_id}",
            headers=headers
        )
        
        if response.status_code == 200:
            data = response.json()
            if "id" in data and data["id"] == reflection_id:
                log_test("Get Specific Reflection", True, f"Successfully retrieved specific reflection for week {data['week_number']}")
                return data
            else:
                log_test("Get Specific Reflection", False, "Response data doesn't match expected reflection", response)
                return None
        else:
            log_test("Get Specific Reflection", False, f"Failed to get specific reflection with status code {response.status_code}", response)
            return None
    except Exception as e:
        log_test("Get Specific Reflection", False, f"Exception: {str(e)}")
        return None

def test_get_cycle_analytics(token, cycle_id):
    """Test 20: Cycle Analytics - Get Comprehensive Analytics"""
    try:
        headers = {"Authorization": f"Bearer {token}"}
        response = requests.get(
            f"{API_BASE_URL}/cycles/{cycle_id}/analytics",
            headers=headers
        )
        
        if response.status_code == 200:
            data = response.json()
            if ("cycle_id" in data and data["cycle_id"] == cycle_id and
                "completion_rate" in data and "goals_completed" in data and
                "average_mood" in data and "manifestation_count" in data):
                log_test("Get Cycle Analytics", True, f"Successfully retrieved cycle analytics with completion rate: {data['completion_rate']:.1f}%")
                return data
            else:
                log_test("Get Cycle Analytics", False, "Response data doesn't match expected analytics structure", response)
                return None
        else:
            log_test("Get Cycle Analytics", False, f"Failed to get cycle analytics with status code {response.status_code}", response)
            return None
    except Exception as e:
        log_test("Get Cycle Analytics", False, f"Exception: {str(e)}")
        return None

def test_get_dashboard_analytics(token):
    """Test 21: Dashboard Analytics - Get User Dashboard Analytics"""
    try:
        headers = {"Authorization": f"Bearer {token}"}
        response = requests.get(
            f"{API_BASE_URL}/analytics/dashboard",
            headers=headers
        )
        
        if response.status_code == 200:
            data = response.json()
            if ("total_cycles" in data and "active_cycles" in data and
                "completed_cycles" in data and "total_goals" in data and
                "completed_goals" in data and "average_completion_rate" in data and
                "recent_manifestations" in data and "mood_trend" in data):
                log_test("Get Dashboard Analytics", True, f"Successfully retrieved dashboard analytics with {data['total_cycles']} cycles and {data['total_goals']} goals")
                return data
            else:
                log_test("Get Dashboard Analytics", False, "Response data doesn't match expected dashboard analytics structure", response)
                return None
        else:
            log_test("Get Dashboard Analytics", False, f"Failed to get dashboard analytics with status code {response.status_code}", response)
            return None
    except Exception as e:
        log_test("Get Dashboard Analytics", False, f"Exception: {str(e)}")
        return None

def test_complete_cycle(token, cycle_id):
    """Test 22: Cycle Completion - Complete Cycle with Success Story"""
    try:
        headers = {"Authorization": f"Bearer {token}"}
        completion_data = {
            "completion_notes": "This 12-week journey has been transformative. I've achieved most of my goals and developed new habits.",
            "success_story": "My biggest success was establishing a daily meditation practice that has improved my focus and manifestation abilities.",
            "overall_satisfaction": 9
        }
        
        response = requests.post(
            f"{API_BASE_URL}/cycles/{cycle_id}/complete",
            headers=headers,
            json=completion_data
        )
        
        if response.status_code == 200:
            data = response.json()
            if (data["status"] == "completed" and data["current_week"] == 12):
                log_test("Complete Cycle", True, "Successfully completed cycle with success story")
                return data
            else:
                log_test("Complete Cycle", False, "Response data doesn't show cycle as completed", response)
                return None
        else:
            log_test("Complete Cycle", False, f"Failed to complete cycle with status code {response.status_code}", response)
            return None
    except Exception as e:
        log_test("Complete Cycle", False, f"Exception: {str(e)}")
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

# Password Reset Tests
def test_forgot_password_valid_email(email):
    """Test 23: Forgot Password - Valid Email"""
    try:
        response = requests.post(
            f"{API_BASE_URL}/auth/forgot-password",
            json={"email": email}
        )
        
        if response.status_code == 200:
            data = response.json()
            if "reset_token" in data and "message" in data:
                log_test("Forgot Password - Valid Email", True, 
                         f"Successfully requested password reset token for {email}")
                return data["reset_token"]
            else:
                log_test("Forgot Password - Valid Email", False, 
                         "Response missing reset token or message", response)
                return None
        else:
            log_test("Forgot Password - Valid Email", False, 
                     f"Failed with status code {response.status_code}", response)
            return None
    except Exception as e:
        log_test("Forgot Password - Valid Email", False, f"Exception: {str(e)}")
        return None

def test_forgot_password_invalid_email():
    """Test 24: Forgot Password - Invalid Email"""
    invalid_email = f"nonexistent_{random.randint(1000, 9999)}@example.com"
    try:
        response = requests.post(
            f"{API_BASE_URL}/auth/forgot-password",
            json={"email": invalid_email}
        )
        
        if response.status_code == 200:
            # For security, the API should not reveal if an email exists or not
            # So a 200 status is expected even for non-existent emails
            data = response.json()
            if "message" in data:
                log_test("Forgot Password - Invalid Email", True, 
                         "Correctly handled non-existent email without revealing its status")
                return True
            else:
                log_test("Forgot Password - Invalid Email", False, 
                         "Response missing expected message", response)
                return False
        else:
            log_test("Forgot Password - Invalid Email", False, 
                     f"Expected 200 status code for security, got {response.status_code}", response)
            return False
    except Exception as e:
        log_test("Forgot Password - Invalid Email", False, f"Exception: {str(e)}")
        return False

def test_validate_reset_token(token):
    """Test 25: Validate Reset Token - Valid Token"""
    try:
        response = requests.post(
            f"{API_BASE_URL}/auth/validate-reset-token?token={token}"
        )
        
        if response.status_code == 200:
            data = response.json()
            if "valid" in data and data["valid"] == True:
                log_test("Validate Reset Token - Valid Token", True, 
                         "Successfully validated reset token")
                return True
            else:
                log_test("Validate Reset Token - Valid Token", False, 
                         "Response indicates token is not valid", response)
                return False
        else:
            log_test("Validate Reset Token - Valid Token", False, 
                     f"Failed with status code {response.status_code}", response)
            return False
    except Exception as e:
        log_test("Validate Reset Token - Valid Token", False, f"Exception: {str(e)}")
        return False

def test_validate_invalid_token():
    """Test 26: Validate Reset Token - Invalid Token"""
    invalid_token = ''.join(random.choices(string.ascii_letters + string.digits, k=32))
    try:
        response = requests.post(
            f"{API_BASE_URL}/auth/validate-reset-token?token={invalid_token}"
        )
        
        if response.status_code == 400:
            log_test("Validate Reset Token - Invalid Token", True, 
                     "Correctly rejected invalid reset token")
            return True
        else:
            log_test("Validate Reset Token - Invalid Token", False, 
                     f"Expected 400 status code, got {response.status_code}", response)
            return False
    except Exception as e:
        log_test("Validate Reset Token - Invalid Token", False, f"Exception: {str(e)}")
        return False

def test_reset_password_valid_token(token, new_password):
    """Test 27: Reset Password - Valid Token"""
    try:
        response = requests.post(
            f"{API_BASE_URL}/auth/reset-password",
            json={
                "token": token,
                "new_password": new_password
            }
        )
        
        if response.status_code == 200:
            data = response.json()
            if "message" in data and "successful" in data["message"].lower():
                log_test("Reset Password - Valid Token", True, 
                         "Successfully reset password with valid token")
                return True
            else:
                log_test("Reset Password - Valid Token", False, 
                         "Response missing success message", response)
                return False
        else:
            log_test("Reset Password - Valid Token", False, 
                     f"Failed with status code {response.status_code}", response)
            return False
    except Exception as e:
        log_test("Reset Password - Valid Token", False, f"Exception: {str(e)}")
        return False

def test_reset_password_invalid_token(new_password):
    """Test 28: Reset Password - Invalid Token"""
    invalid_token = ''.join(random.choices(string.ascii_letters + string.digits, k=32))
    try:
        response = requests.post(
            f"{API_BASE_URL}/auth/reset-password",
            json={
                "token": invalid_token,
                "new_password": new_password
            }
        )
        
        if response.status_code == 400:
            log_test("Reset Password - Invalid Token", True, 
                     "Correctly rejected password reset with invalid token")
            return True
        else:
            log_test("Reset Password - Invalid Token", False, 
                     f"Expected 400 status code, got {response.status_code}", response)
            return False
    except Exception as e:
        log_test("Reset Password - Invalid Token", False, f"Exception: {str(e)}")
        return False

def test_reset_password_short_password(token):
    """Test 29: Reset Password - Short Password"""
    short_password = "short"  # Less than 6 characters
    try:
        response = requests.post(
            f"{API_BASE_URL}/auth/reset-password",
            json={
                "token": token,
                "new_password": short_password
            }
        )
        
        if response.status_code == 400:
            log_test("Reset Password - Short Password", True, 
                     "Correctly rejected password reset with too short password")
            return True
        else:
            log_test("Reset Password - Short Password", False, 
                     f"Expected 400 status code, got {response.status_code}", response)
            return False
    except Exception as e:
        log_test("Reset Password - Short Password", False, f"Exception: {str(e)}")
        return False

def test_token_used_after_reset(token):
    """Test 30: Token Used After Reset"""
    try:
        # Try to use the token again after a successful reset
        response = requests.post(
            f"{API_BASE_URL}/auth/reset-password",
            json={
                "token": token,
                "new_password": "AnotherNewPassword123!"
            }
        )
        
        if response.status_code == 400:
            log_test("Token Used After Reset", True, 
                     "Correctly rejected reuse of already used token")
            return True
        else:
            log_test("Token Used After Reset", False, 
                     f"Expected 400 status code, got {response.status_code}. Tokens should be one-time use only.", response)
            return False
    except Exception as e:
        log_test("Token Used After Reset", False, f"Exception: {str(e)}")
        return False

def test_login_with_new_password(email, new_password):
    """Test 31: Login With New Password"""
    try:
        response = requests.post(
            f"{API_BASE_URL}/auth/login",
            json={
                "email": email,
                "password": new_password
            }
        )
        
        if response.status_code == 200:
            data = response.json()
            if "access_token" in data and "user" in data:
                log_test("Login With New Password", True, 
                         f"Successfully logged in with new password")
                return data
            else:
                log_test("Login With New Password", False, 
                         "Response missing token or user data", response)
                return None
        else:
            log_test("Login With New Password", False, 
                     f"Failed with status code {response.status_code}", response)
            return None
    except Exception as e:
        log_test("Login With New Password", False, f"Exception: {str(e)}")
        return None

def test_login_with_old_password(email, old_password):
    """Test 32: Login With Old Password"""
    try:
        response = requests.post(
            f"{API_BASE_URL}/auth/login",
            json={
                "email": email,
                "password": old_password
            }
        )
        
        if response.status_code == 401:
            log_test("Login With Old Password", True, 
                     "Correctly rejected login with old password")
            return True
        else:
            log_test("Login With Old Password", False, 
                     f"Expected 401 status code, got {response.status_code}. Old password should no longer work.", response)
            return False
    except Exception as e:
        log_test("Login With Old Password", False, f"Exception: {str(e)}")
        return False

def test_multiple_reset_requests(email):
    """Test 33: Multiple Reset Requests"""
    try:
        # Request first token
        response1 = requests.post(
            f"{API_BASE_URL}/auth/forgot-password",
            json={"email": email}
        )
        
        if response1.status_code != 200 or "reset_token" not in response1.json():
            log_test("Multiple Reset Requests", False, 
                     "Failed to get first reset token", response1)
            return False
        
        token1 = response1.json()["reset_token"]
        
        # Request second token
        response2 = requests.post(
            f"{API_BASE_URL}/auth/forgot-password",
            json={"email": email}
        )
        
        if response2.status_code != 200 or "reset_token" not in response2.json():
            log_test("Multiple Reset Requests", False, 
                     "Failed to get second reset token", response2)
            return False
        
        token2 = response2.json()["reset_token"]
        
        # Verify both tokens are different
        if token1 != token2:
            # Verify both tokens are valid
            valid1 = requests.post(
                f"{API_BASE_URL}/auth/validate-reset-token?token={token1}"
            ).status_code == 200
            
            valid2 = requests.post(
                f"{API_BASE_URL}/auth/validate-reset-token?token={token2}"
            ).status_code == 200
            
            if valid1 and valid2:
                log_test("Multiple Reset Requests", True, 
                         "Successfully generated multiple valid reset tokens")
                return True
            else:
                log_test("Multiple Reset Requests", False, 
                         f"Not all tokens are valid. Token1 valid: {valid1}, Token2 valid: {valid2}")
                return False
        else:
            log_test("Multiple Reset Requests", False, 
                     "Generated identical tokens for multiple requests")
            return False
    except Exception as e:
        log_test("Multiple Reset Requests", False, f"Exception: {str(e)}")
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
    if not cycle_data:
        print("\n❌ Cycle Creation failed. Stopping tests.")
        return summarize_results()
    
    cycle_id = cycle_data["id"]
    cycles = test_get_cycles(token)
    
    # Test 8: Enhanced Cycle Management
    updated_cycle = test_update_cycle(token, cycle_id)
    
    # Test 9-13: Goal Management
    goal_data = test_create_goal(token, cycle_id)
    if not goal_data:
        print("\n❌ Goal Creation failed. Stopping tests.")
        return summarize_results()
    
    goal_id = goal_data["id"]
    
    goal_data_2 = test_create_second_goal(token, cycle_id)
    if goal_data_2:
        goal_id_2 = goal_data_2["id"]
    
    goals = test_get_goals(token, cycle_id)
    specific_goal = test_get_specific_goal(token, goal_id)
    updated_goal = test_update_goal(token, goal_id)
    
    # Test 14-16: Weekly Reflection System
    reflection_data = test_create_reflection(token, cycle_id)
    if not reflection_data:
        print("\n❌ Reflection Creation failed. Stopping tests.")
        return summarize_results()
    
    reflection_id = reflection_data["id"]
    reflections = test_get_reflections(token, cycle_id)
    specific_reflection = test_get_specific_reflection(token, reflection_id)
    
    # Test 17-19: Enhanced Goal Progress APIs
    updated_goal_progress = test_update_goal_progress(token, goal_id)
    if not updated_goal_progress:
        print("\n❌ Goal Progress Update failed. Stopping tests.")
        return summarize_results()
    
    updated_goal_with_milestones = test_update_goal_progress_with_milestones(token, goal_id)
    goal_progress_history = test_get_goal_progress_history(token, goal_id)
    
    # Test 20: Cycle Analytics
    cycle_analytics = test_get_cycle_analytics(token, cycle_id)
    
    # Test 21: Dashboard Analytics
    dashboard_analytics = test_get_dashboard_analytics(token)
    
    # Test 22: Cycle Completion
    completed_cycle = test_complete_cycle(token, cycle_id)
    
    # Test Error Handling
    test_error_handling_duplicate_email()
    test_error_handling_invalid_login()
    test_error_handling_missing_fields()
    
    # Password Reset Tests
    print("\n🔍 Starting Password Reset Tests...\n")
    
    # Create a new test user for password reset
    password_reset_user = {
        "email": generate_random_email(),
        "password": "OriginalPassword123!",
        "full_name": "Password Reset Test User"
    }
    
    # Register the user
    password_reset_registration = requests.post(
        f"{API_BASE_URL}/auth/register",
        json=password_reset_user
    ).json()
    
    if "access_token" not in password_reset_registration:
        print("\n❌ Failed to create test user for password reset. Stopping tests.")
        return summarize_results()
    
    # Store the original password for later testing
    original_password = password_reset_user["password"]
    email = password_reset_user["email"]
    
    # Test 23-24: Forgot Password
    reset_token = test_forgot_password_valid_email(email)
    if not reset_token:
        print("\n❌ Failed to get reset token. Stopping tests.")
        return summarize_results()
    
    test_forgot_password_invalid_email()
    
    # Test 25-26: Validate Reset Token
    test_validate_reset_token(reset_token)
    test_validate_invalid_token()
    
    # Test 29: Test password validation (too short)
    test_reset_password_short_password(reset_token)
    
    # Test 27: Reset Password with Valid Token
    new_password = "NewTestPassword456!"
    reset_success = test_reset_password_valid_token(reset_token, new_password)
    if not reset_success:
        print("\n❌ Failed to reset password. Stopping tests.")
        return summarize_results()
    
    # Test 30: Verify token is marked as used
    test_token_used_after_reset(reset_token)
    
    # Test 28: Reset Password with Invalid Token
    test_reset_password_invalid_token("AnotherPassword789!")
    
    # Test 31-32: Login with new/old password
    login_data = test_login_with_new_password(email, new_password)
    if not login_data:
        print("\n❌ Failed to login with new password. Stopping tests.")
        return summarize_results()
    
    test_login_with_old_password(email, original_password)
    
    # Test 33: Multiple reset requests
    test_multiple_reset_requests(email)
    
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