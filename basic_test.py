import requests
import sys

# Get the backend URL from the frontend .env file
BACKEND_URL = "https://6eb0a435-7bf2-4c21-9793-66613bae33b3.preview.emergentagent.com/api"

def test_basic_endpoints():
    """Test basic endpoints to see if the backend is accessible"""
    try:
        # Test root endpoint
        response = requests.get(f"{BACKEND_URL}/")
        print(f"Root endpoint status: {response.status_code}")
        print(f"Response: {response.text}")
        
        # Test health endpoint
        response = requests.get(f"{BACKEND_URL}/health")
        print(f"Health endpoint status: {response.status_code}")
        print(f"Response: {response.text}")
        
    except Exception as e:
        print(f"Error: {e}")
        
if __name__ == "__main__":
    test_basic_endpoints()