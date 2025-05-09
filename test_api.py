import requests
import json

def test_flask_api():
    """
    Simple test to verify the Flask API is working
    """
    url = "http://localhost:5000/api/chat"
    
    # Test case 1: Basic question without tags
    payload = {
        "message": "What are common maintenance issues with Boeing 737 engines?"
    }
    
    print(f"Sending request to {url}...")
    print(f"Payload: {json.dumps(payload, indent=2)}")
    
    try:
        response = requests.post(url, json=payload)
        response.raise_for_status()  # Raise an exception for HTTP errors
        
        print(f"Status code: {response.status_code}")
        print(f"Response: {json.dumps(response.json(), indent=2)}")
        
    except requests.exceptions.RequestException as e:
        print(f"Error: {e}")
    
    # Test case 2: Question with tags
    payload = {
        "message": "What should I check if there's a hydraulic leak?",
        "aircraftModel": "Airbus A320",
        "issueCategory": "Hydraulics"
    }
    
    print("\n" + "-"*50 + "\n")
    print(f"Sending request with tags...")
    print(f"Payload: {json.dumps(payload, indent=2)}")
    
    try:
        response = requests.post(url, json=payload)
        response.raise_for_status()
        
        print(f"Status code: {response.status_code}")
        print(f"Response: {json.dumps(response.json(), indent=2)}")
        
    except requests.exceptions.RequestException as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    test_flask_api()