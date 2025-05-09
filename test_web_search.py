import os
from dotenv import load_dotenv
import requests
import time

# Import the web search function
from duckduckgo_search import DDGS

# Load environment variables
load_dotenv()

# Configuration
GROQ_API_KEY = os.getenv("GROQ_API_KEY", "").strip()
GROQ_MODEL = "llama3-8b-8192"  # The model you're using

def web_search(keywords, num_results=5):
    """
    Simple DuckDuckGo search function.
    """
    try:
        # Initialize the DuckDuckGo search engine
        search = DDGS()
        
        print(f"Searching DuckDuckGo for: {keywords}")
        
        # Perform the search
        results = list(search.text(keywords, max_results=num_results))
        
        if not results:
            print("No results found!")
            return "No search results found."
        
        print(f"Found {len(results)} search results")
        
        # Format the results
        formatted_results = []
        for i, res in enumerate(results, 1):
            title = res.get("title", "")
            body = res.get("body", "")
            href = res.get("href", "")
            
            print(f"Result {i}: {title}")
            print(f"  Content: {body[:100]}...")
            
            formatted_results.append(f"Source {i}: {title}\nContent: {body}\nURL: {href}")
        
        return "\n\n".join(formatted_results)
    except Exception as e:
        print(f"Error in web search: {e}")
        return f"Error performing web search: {str(e)}"

def call_groq_api(prompt, max_tokens=1024, temperature=0.1):
    """
    Call the Groq API to generate a response from a prompt.
    """
    headers = {
        "Authorization": f"Bearer {GROQ_API_KEY}",
        "Content-Type": "application/json"
    }
    
    data = {
        "model": GROQ_MODEL,
        "messages": [{"role": "user", "content": prompt}],
        "max_tokens": max_tokens,
        "temperature": temperature
    }
    
    try:
        print(f"Sending request to Groq API with model: {GROQ_MODEL}")
        
        response = requests.post(
            "https://api.groq.com/openai/v1/chat/completions",
            headers=headers,
            json=data,
            timeout=30
        )
        
        print(f"Response status code: {response.status_code}")
        
        if response.status_code != 200:
            print(f"Error response: {response.text}")
            return f"Error: {response.text}"
            
        return response.json()["choices"][0]["message"]["content"]
    except Exception as e:
        print(f"Error calling Groq API: {e}")
        return f"Error generating response: {str(e)}"

def test_direct_query(query, search_term=None):
    """
    Test a direct query with web search results.
    """
    print(f"\n--- Testing Direct Query: {query} ---")
    start_time = time.time()
    
    # Use the provided search term or the query itself
    search_term = search_term or query
    
    # Perform web search
    search_results = web_search(search_term, num_results=3)
    
    # Create prompt with web search results
    prompt = f"""
You are an aircraft maintenance assistant. Answer the question directly based on the web search results below.

Web search results:
{search_results}

Question: {query}

Provide a clear, factual answer based specifically on the web search results provided. Focus only on answering the question directly without adding generic troubleshooting steps unless they relate directly to the question.
    """
    
    # Call Groq API
    answer = call_groq_api(prompt)
    
    # Print results
    print(f"\n--- Answer (in {time.time() - start_time:.2f}s) ---")
    print(answer)
    
    return answer

if __name__ == "__main__":
    # Test a specific query
    test_direct_query(
        "What are the common causes of compressor stalls in jet engines?",
        "jet engine compressor stall causes"
    )