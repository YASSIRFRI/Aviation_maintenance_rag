import os
import requests
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

def list_groq_models():
    """
    Lists all available models from Groq API
    """
    api_key = os.getenv("GROQ_API_KEY", "").strip()
    
    if not api_key:
        print("Error: GROQ_API_KEY not found in environment variables")
        return
    
    headers = {
        "Authorization": f"Bearer {api_key}",
        "Content-Type": "application/json"
    }
    
    try:
        response = requests.get(
            "https://api.groq.com/openai/v1/models",
            headers=headers,
            timeout=10
        )
        
        print(f"Response status code: {response.status_code}")
        
        if response.status_code == 200:
            print("Available Groq models:")
            data = response.json()
            for model in data.get("data", []):
                print(f"- {model.get('id')}")
        else:
            print(f"Error: {response.text}")
    except Exception as e:
        print(f"Exception: {e}")

if __name__ == "__main__":
    list_groq_models()