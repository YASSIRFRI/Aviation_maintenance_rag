import os
import requests
import json
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

def test_groq_connection():
    """
    Simple test function to verify Groq API connection
    """
    # Get the API key from environment
    api_key = os.getenv("GROQ_API_KEY", "").strip()
    
    if not api_key:
        print("❌ ERROR: GROQ_API_KEY not found in environment variables")
        return False
    
    # Print the API key format (first 4 chars and length)
    print(f"API Key starts with: {api_key[:4]}... (total length: {len(api_key)})")
    print(f"API Key format check - starts with 'gsk_': {api_key.startswith('gsk_')}")
    
    # List available models to confirm connection
    headers = {
        "Authorization": f"Bearer {api_key}",
        "Content-Type": "application/json"
    }
    
    print("\nStep 1: Listing available models...")
    try:
        models_response = requests.get(
            "https://api.groq.com/openai/v1/models",
            headers=headers,
            timeout=10
        )
        
        print(f"Models API response status: {models_response.status_code}")
        
        if models_response.status_code == 200:
            models_data = models_response.json()
            print("✅ Successfully connected to Groq API!")
            print("\nAvailable models:")
            models = []
            for model in models_data.get("data", []):
                model_id = model.get('id')
                models.append(model_id)
                print(f"- {model_id}")
            
            # Save first 5 models for the test
            test_models = [
                "llama3-8b-8192",           # First choice
                "llama-3.3-70b-versatile",  # Second choice
                "llama3-70b-8192",          # Third choice
                models[0]                   # Fallback to first available model
            ]
            
            # Find first available model from our priority list
            test_model = None
            for model in test_models:
                if model in models:
                    test_model = model
                    break
                    
            if not test_model:
                test_model = models[0]  # Just use the first model if none of our preferred ones exist
                
            print(f"\nSelected model for test: {test_model}")
        else:
            print(f"❌ Error listing models: {models_response.text}")
            return False
    except Exception as e:
        print(f"❌ Exception listing models: {e}")
        return False
    
    # Test a simple completion with the selected model
    print("\nStep 2: Testing a simple chat completion...")
    
    data = {
        "model": test_model,
        "messages": [{"role": "user", "content": "What are common causes of aircraft engine vibration?"}],
        "max_tokens": 100,
        "temperature": 0.0
    }
    
    try:
        chat_response = requests.post(
            "https://api.groq.com/openai/v1/chat/completions",
            headers=headers,
            json=data,
            timeout=30
        )
        
        print(f"Chat API response status: {chat_response.status_code}")
        
        if chat_response.status_code == 200:
            chat_data = chat_response.json()
            print("✅ Successfully received chat completion!")
            print("\nAPI Response preview:")
            preview = chat_data["choices"][0]["message"]["content"][:150]
            print(f"{preview}...")
            
            # Save the successful model name
            with open("successful_model.txt", "w") as f:
                f.write(test_model)
            print(f"\n✅ Saved successful model name '{test_model}' to successful_model.txt")
            
            return True
        else:
            print(f"❌ Error with chat completion: {chat_response.text}")
            return False
    except Exception as e:
        print(f"❌ Exception testing chat completion: {e}")
        return False

if __name__ == "__main__":
    print("=== GROQ API CONNECTION TEST ===")
    success = test_groq_connection()
    
    if success:
        print("\n✅ All tests passed! Your Groq API connection is working correctly.")
    else:
        print("\n❌ Tests failed. Please check your API key and connection.")
        print("\nTroubleshooting tips:")
        print("1. Verify your API key format (should start with 'gsk_')")
        print("2. Check your internet connection")
        print("3. Make sure your Groq account is active and has credits")
        print("4. Try regenerating a new API key at https://console.groq.com/keys")