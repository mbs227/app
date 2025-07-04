import requests
import json
import time
import random
import string
from datetime import datetime, timedelta

# Get the base URL from frontend .env file
BACKEND_URL = "https://8e339c75-6530-4d24-9a1d-5a894763e0dd.preview.emergentagent.com"
API_BASE_URL = f"{BACKEND_URL}/api"

# Test data
def generate_random_email():
    """Generate a random email for testing"""
    random_str = ''.join(random.choices(string.ascii_lowercase + string.digits, k=8))
    return f"test_{random_str}@example.com"

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

def create_test_user():
    """Create a test user for password reset testing"""
    test_user = {
        "email": generate_random_email(),
        "password": "TestPassword123!",
        "full_name": "Password Reset Test User"
    }
    
    try:
        response = requests.post(
            f"{API_BASE_URL}/auth/register",
            json=test_user
        )
        
        if response.status_code == 200:
            data = response.json()
            if "access_token" in data and "user" in data:
                print(f"Created test user: {test_user['email']}")
                return test_user, data["access_token"]
            else:
                print("Failed to create test user: Response missing token or user data")
                return None, None
        else:
            print(f"Failed to create test user: Status code {response.status_code}")
            return None, None
    except Exception as e:
        print(f"Exception creating test user: {str(e)}")
        return None, None

def test_forgot_password_valid_email(email):
    """Test 1: Request password reset token with valid email"""
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
    """Test 2: Request password reset token with invalid email"""
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

def test_validate_valid_token(token):
    """Test 3: Validate a valid reset token"""
    try:
        # Send token as a query parameter instead of JSON body
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
    """Test 4: Validate an invalid reset token"""
    invalid_token = ''.join(random.choices(string.ascii_letters + string.digits, k=32))
    try:
        # Send token as a query parameter instead of JSON body
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
    """Test 5: Reset password with valid token"""
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
    """Test 6: Reset password with invalid token"""
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
    """Test 7: Reset password with too short password"""
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
    """Test 8: Verify token is marked as used after successful reset"""
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
    """Test 9: Verify login works with new password"""
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
                return True
            else:
                log_test("Login With New Password", False, 
                         "Response missing token or user data", response)
                return False
        else:
            log_test("Login With New Password", False, 
                     f"Failed with status code {response.status_code}", response)
            return False
    except Exception as e:
        log_test("Login With New Password", False, f"Exception: {str(e)}")
        return False

def test_login_with_old_password(email, old_password):
    """Test 10: Verify login fails with old password"""
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
    """Test 11: Test multiple reset requests"""
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

def run_password_reset_tests():
    """Run all password reset tests"""
    print("\n🔍 Starting Password Reset Functionality Tests...\n")
    
    # Create a test user
    test_user, token = create_test_user()
    if not test_user:
        print("\n❌ Failed to create test user. Stopping tests.")
        return summarize_results()
    
    # Store the original password for later testing
    original_password = test_user["password"]
    email = test_user["email"]
    
    # Test 1-2: Forgot Password
    reset_token = test_forgot_password_valid_email(email)
    if not reset_token:
        print("\n❌ Failed to get reset token. Stopping tests.")
        return summarize_results()
    
    test_forgot_password_invalid_email()
    
    # Test 3-4: Validate Reset Token
    test_validate_valid_token(reset_token)
    test_validate_invalid_token()
    
    # Test 7: Test password validation (too short)
    test_reset_password_short_password(reset_token)
    
    # Test 5: Reset Password with Valid Token
    new_password = "NewTestPassword456!"
    reset_success = test_reset_password_valid_token(reset_token, new_password)
    if not reset_success:
        print("\n❌ Failed to reset password. Stopping tests.")
        return summarize_results()
    
    # Test 8: Verify token is marked as used
    test_token_used_after_reset(reset_token)
    
    # Test 6: Reset Password with Invalid Token
    test_reset_password_invalid_token("AnotherPassword789!")
    
    # Test 9-10: Login with new/old password
    test_login_with_new_password(email, new_password)
    test_login_with_old_password(email, original_password)
    
    # Test 11: Multiple reset requests
    test_multiple_reset_requests(email)
    
    return summarize_results()

def summarize_results():
    """Summarize test results"""
    total = test_results["passed"] + test_results["failed"]
    pass_percentage = (test_results["passed"] / total) * 100 if total > 0 else 0
    
    print("\n" + "="*80)
    print(f"PASSWORD RESET TEST SUMMARY: {test_results['passed']}/{total} tests passed ({pass_percentage:.1f}%)")
    print("="*80)
    
    if test_results["failed"] > 0:
        print("\nFAILED TESTS:")
        for test in test_results["tests"]:
            if test["status"] == "FAILED":
                print(f"❌ {test['name']}: {test['message']}")
    
    print("\n" + "="*80)
    return test_results

if __name__ == "__main__":
    run_password_reset_tests()