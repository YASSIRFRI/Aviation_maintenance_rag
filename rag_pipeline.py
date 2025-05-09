import os
import json
import time
import requests
import re
from dotenv import load_dotenv
from qdrant_client import QdrantClient
from sentence_transformers import SentenceTransformer
import os.path
import warnings
from sklearn.metrics.pairwise import cosine_similarity
import numpy as np

# Import the free web search function
from duckduckgo_search import DDGS

# Load environment variables
load_dotenv()

# Configuration
QDRANT_URL = os.getenv("QDRANT_URL")
QDRANT_API_KEY = os.getenv("QDRANT_API_KEY")
GROQ_API_KEY = os.getenv("GROQ_API_KEY")
COLLECTION_1 = "aircraft_maintenance_logs"
COLLECTION_2 = "acn"
EMBED_MODEL_NAME = "all-MiniLM-L6-v2"
EMBED_BATCH = 16
SIM_THRESHOLD = 0.5  # Balanced threshold
WEB_SEARCH_ENABLED = True  # Enable web search
HYBRID_MODE = True  # Use both vector DB and web search
WEB_SEARCH_NUM = 3  # Number of search results to return
DIAGNOSTIC_MODE = True  # Print diagnostic information to help troubleshoot

# Determine which model to use
def get_groq_model():
    """
    Get the Groq model to use, checking for a saved successful model first
    """
    # Check if we've saved a successful model from a previous test
    if os.path.exists("successful_model.txt"):
        with open("successful_model.txt", "r") as f:
            saved_model = f.read().strip()
            if saved_model:
                print(f"Using saved successful model: {saved_model}")
                return saved_model
    
    # Fallback to a known model
    default_model = "llama3-8b-8192"
    print(f"Using default model: {default_model}")
    return default_model

# Get the model to use
GROQ_MODEL = get_groq_model()

# Validate environment variables
required_vars = ["QDRANT_URL", "QDRANT_API_KEY", "GROQ_API_KEY"]
for var in required_vars:
    if not os.getenv(var):
        raise RuntimeError(f"Please set {var} in your .env")

# Initialize clients
print("Initializing clients...")
qdrant = QdrantClient(url=QDRANT_URL, api_key=QDRANT_API_KEY, timeout=30)
embedder = SentenceTransformer(EMBED_MODEL_NAME)

def is_relevant_to_query(query, text, min_relevance=0.4):
    """
    Check if text is relevant to query using semantic similarity
    """
    if not text or not query:
        return False
    
    # Get embeddings
    query_embedding = embedder.encode([query], normalize_embeddings=True)[0].reshape(1, -1)
    text_embedding = embedder.encode([text], normalize_embeddings=True)[0].reshape(1, -1)
    
    # Calculate cosine similarity
    similarity = cosine_similarity(query_embedding, text_embedding)[0][0]
    
    if DIAGNOSTIC_MODE:
        print(f"Direct relevance check: '{query}' vs text - Similarity: {similarity:.3f}")
    
    return similarity > min_relevance

def contains_template_language(text):
    """Check if text contains generic template language"""
    template_patterns = [
        r"step-by-step (troubleshooting|process)",
        r"initial assessment",
        r"visual inspection",
        r"check the.*system",
        r"verify the.*reading",
        r"\d+\.\s+\*\*[A-Z]"  # Numbered steps with bold headers
    ]
    
    matches = 0
    for pattern in template_patterns:
        if re.search(pattern, text, re.IGNORECASE):
            matches += 1
    
    # If text matches multiple patterns, it's likely template text
    return matches >= 3

def is_helpful_for_query(query, text):
    """More sophisticated check if the text is actually helpful for the query"""
    # Check for query-specific keywords
    query_keywords = set(query.lower().split())
    text_contains_keywords = False
    
    # Remove common stop words
    stop_words = set(['the', 'a', 'an', 'are', 'is', 'for', 'in', 'on', 'at', 'of', 'to', 'with', 'and', 'or'])
    query_keywords = query_keywords - stop_words
    
    # Check if important keywords from query appear in text
    important_words = [w for w in query_keywords if len(w) > 3]  # Only consider words longer than 3 chars
    matches = sum(1 for word in important_words if word in text.lower())
    keyword_match_ratio = matches / len(important_words) if important_words else 0
    
    # Check if text is generic template
    is_template = contains_template_language(text)
    
    if DIAGNOSTIC_MODE:
        print(f"Keyword match ratio: {keyword_match_ratio:.2f}, Is template: {is_template}")
    
    # Text is helpful if it has good keyword matches and isn't just a template
    return keyword_match_ratio > 0.3 and not is_template

def retrieve_contexts(query, query_embedding, top_k=3):
    """
    Search both collections, return merged contexts sorted by score.
    Using the search method since that's what's working in your system.
    """
    results = []
    relevant_count = 0
    
    for coll in (COLLECTION_1, COLLECTION_2):
        try:
            # Check if collection exists
            collections = qdrant.get_collections().collections
            collection_names = [c.name for c in collections]
            
            if coll not in collection_names:
                print(f"Warning: Collection '{coll}' not found. Available collections: {collection_names}")
                continue
                
            # Use the original search method with DeprecationWarning suppressed
            with warnings.catch_warnings():
                warnings.filterwarnings("ignore", category=DeprecationWarning)
                hits = qdrant.search(
                    collection_name=coll,
                    query_vector=query_embedding,
                    limit=top_k,
                    with_payload=True
                )
            
            for hit in hits:
                # Extract payload
                payload = hit.payload if hasattr(hit, 'payload') else {}
                score = hit.score if hasattr(hit, 'score') else 0
                
                # Extract text based on collection schema
                if coll == COLLECTION_1:  # aircraft_maintenance_logs
                    text = f"Problem: {payload.get('problem', '')}\nAction: {payload.get('action', '')}"
                else:  # acn collection
                    text = payload.get("text_chunk", "")
                    synopsis = payload.get("synp", "")
                    if synopsis:
                        text += f"\n\nSynopsis: {synopsis}"
                
                # Check if the text is actually helpful for this query
                is_helpful = is_helpful_for_query(query, text)
                is_relevant = is_relevant_to_query(query, text)
                
                if DIAGNOSTIC_MODE:
                    print(f"\nDocument from {coll}:")
                    print(f"Raw score: {score:.3f}")
                    print(f"Is relevant: {is_relevant}")
                    print(f"Is helpful: {is_helpful}")
                    print(f"Text snippet: {text[:100]}...")
                
                # Only include if it's actually relevant or has a very high score
                if is_helpful or is_relevant or score > 0.85:
                    results.append({
                        "collection": coll,
                        "score": score,
                        "payload": payload,
                        "text": text,
                        "is_helpful": is_helpful,
                        "is_relevant": is_relevant
                    })
                    
                    if is_helpful or is_relevant:
                        relevant_count += 1
        except Exception as e:
            print(f"Error searching collection {coll}: {e}")
    
    # Sort by a combined score that prioritizes helpfulness
    for res in results:
        combined_score = res["score"]
        if res["is_helpful"]:
            combined_score += 0.2
        if res["is_relevant"]:
            combined_score += 0.1
        res["combined_score"] = combined_score
    
    results.sort(key=lambda x: x["combined_score"], reverse=True)
    
    if DIAGNOSTIC_MODE:
        print(f"\nFound {len(results)} total hits, {relevant_count} relevant hits")
        if results:
            print(f"Top result combined score: {results[0]['combined_score']:.3f}")
    
    # Return info about relevance along with results
    return {
        "results": results[:top_k*2],  # Return top results from both collections
        "found_relevant": relevant_count > 0,
        "top_score": results[0]["combined_score"] if results else 0
    }

def call_groq_api(prompt, max_tokens=512, temperature=0.0):
    """
    Call the Groq API to generate a response from a prompt.
    Uses the determined model name from get_groq_model().
    """
    # Get API key from environment
    api_key = os.getenv("GROQ_API_KEY", "").strip()
    
    headers = {
        "Authorization": f"Bearer {api_key}",
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
            
        response.raise_for_status()
        return response.json()["choices"][0]["message"]["content"]
    except Exception as e:
        print(f"Error calling Groq API: {e}")
        if hasattr(e, 'response') and e.response is not None:
            print(f"Response status: {e.response.status_code}")
            print(f"Response body: {e.response.text}")
        return f"Error generating response: {str(e)}"

def generate_search_query(user_q):
    """
    Use Groq to produce search keywords based on the user query.
    """
    # For short queries, just use the query directly
    if len(user_q.split()) <= 5:
        # Add "aircraft" or "airplane" if the query doesn't contain aviation terms
        aviation_terms = ["aircraft", "airplane", "jet", "engine", "aviation", "boeing", "airbus"]
        has_aviation_term = any(term in user_q.lower() for term in aviation_terms)
        
        if not has_aviation_term:
            return user_q + " aircraft maintenance"
        return user_q
    
    # For longer queries, use the LLM to extract keywords
    prompt = f"""
    As a search query generator, extract 3-5 concise search terms (comma-separated) from this aircraft maintenance question:
    
    "{user_q}"
    
    Just give me the comma-separated keywords, nothing else.
    """
    
    response = call_groq_api(prompt, max_tokens=64, temperature=0.3)
    
    # Clean up the response
    cleaned = response.strip()
    
    # If response doesn't have commas but has multiple words, just return as is
    if "," not in cleaned and len(cleaned.split()) <= 6:
        return cleaned
    
    # If we got a comma-separated list, extract just the comma-separated part
    if "," in cleaned:
        # Take only the first line that has commas
        for line in cleaned.split("\n"):
            if "," in line:
                return line.strip()
    
    # Fallback to just using the query
    return user_q

def web_search(keywords, num_results=5):
    """
    Enhanced DuckDuckGo search that ensures results are properly formatted
    and adds debug information.
    """
    try:
        # Initialize the DuckDuckGo search engine
        from duckduckgo_search import DDGS
        search = DDGS()
        
        print(f"Searching DuckDuckGo for: {keywords}")
        
        # Add aviation/maintenance terms for more relevant results
        search_terms = keywords
        if "aircraft" not in search_terms.lower() and "airplane" not in search_terms.lower():
            search_terms += " aircraft maintenance"
        
        # Perform the search
        results = list(search.text(search_terms, max_results=num_results))
        
        if not results:
            print("No DuckDuckGo results found!")
            return "No search results found."
        
        print(f"Found {len(results)} search results")
        
        # Format the results with more structure
        formatted_results = []
        for i, res in enumerate(results, 1):
            title = res.get("title", "")
            body = res.get("body", "")
            href = res.get("href", "")
            
            # Print the first result for debugging
            if i == 1:
                print(f"First result: {title[:50]}... - {body[:100]}...")
            
            formatted_results.append(f"Source {i}: {title}\nContent: {body}\nURL: {href}")
        
        return "\n\n".join(formatted_results)
    except Exception as e:
        print(f"Error in web search: {e}")
        return f"Error performing web search: {str(e)}"

def generate_answer(user_q, vector_results, web_snippets=None):
    """
    Build a RAG prompt combining user question, retrieved contexts, and optional web snippets.
    This improved version ensures web results are properly incorporated.
    """
    # Format vector search results into a string
    vector_contexts = []
    for c in vector_results:
        # Only include helpful results when we also have web search
        if web_snippets and not (c.get("is_helpful", False) or c.get("is_relevant", False)):
            continue
            
        ctx = f"[{c['collection']} | score={c['score']:.3f}]\n{c['text']}"
        vector_contexts.append(ctx)
    
    ctx_text = "\n\n".join(vector_contexts) if vector_contexts else "No relevant information found in the database."
    
    # Create a web-focused prompt when web search is used
    if web_snippets:
        # Override template if no good vector DB results and we have web results
        if not any(c.get("is_helpful", False) for c in vector_results):
            prompt = f"""
You are an aircraft maintenance assistant. Answer the question using PRIMARILY the web search results below.

Web search results:
{web_snippets}

Database information (less relevant):
{ctx_text}

Question: {user_q}

Provide a clear, factual answer based on the web search results. Focus specifically on answering the question directly without including generic troubleshooting steps unless they're directly relevant to the question.
            """
        else:
            # For hybrid mode with some good vector results
            prompt = f"""
You are an aircraft maintenance assistant. Answer the question using BOTH the web search results and database information below.

Web search results:
{web_snippets}

Database information:
{ctx_text}

Question: {user_q}

Provide a clear, factual answer that combines information from both sources, prioritizing the most relevant information.
            """
    else:
        # Use only vector DB results if no web search was performed
        prompt = f"""
You are an aircraft maintenance assistant. Answer the question using the following context:

{ctx_text}

Question: {user_q}

Provide a clear, factual answer based on the available information.
        """
    
    # Print the actual prompt we're using for debugging
    print("Prompt length:", len(prompt))
    print("Prompt preview (first 200 chars):", prompt[:200])
    # Print the beginning of the prompt for debugging
    print("\nPrompt preview:")
    print(prompt[:200] + "...")
    # Call Groq API to generate the answer
    return call_groq_api(prompt, max_tokens=1024, temperature=0.1)
def rag_pipeline(user_q):
    """
    Main RAG pipeline that balances vector DB and web search:
    1. Embeds the user query
    2. Retrieves relevant contexts with smart filtering
    3. Performs web search based on relevance and user settings
    4. Generates an answer using both sources when appropriate
    """
    # Embed the user query
    q_emb = embedder.encode([user_q], normalize_embeddings=True)[0]
    
    # Retrieve contexts from Qdrant with improved relevance checking
    context_info = retrieve_contexts(user_q, q_emb, top_k=3)
    contexts = context_info["results"]
    
    # Print how many contexts were found
    print(f"Found {len(contexts)} relevant contexts")
    
    # Determine if we should use web search
    use_web_search = False
    web_snips = None
    
    if WEB_SEARCH_ENABLED:
        # Use web search if:
        # 1. No relevant vector results found
        # 2. In hybrid mode
        # 3. Vector search scores are low
        if not context_info["found_relevant"] or HYBRID_MODE or context_info["top_score"] < SIM_THRESHOLD:
            print("[🌐] Using web search to supplement or replace vector results")
            
            # Generate search keywords
            kws = generate_search_query(user_q)
            print(f"Generated search keywords: {kws}")
            
            # Perform web search
            web_snips = web_search(kws)
            use_web_search = True
    
    # Generate answer based on context availability
    if contexts or web_snips:
        # In hybrid mode, use both sources when available
        if HYBRID_MODE and contexts and web_snips:
            print("[🔄] Using hybrid approach with both vector DB and web search")
        
        # Generate the answer
        return generate_answer(user_q, contexts, web_snips)
    else:
        return "Sorry, I couldn't find relevant information in the database or on the web to answer your question."

if __name__ == "__main__":
    print("RAG pipeline ready. Enter your question (CTRL+C to quit).")
    try:
        while True:
            q = input("\n> ").strip()
            if not q:
                continue
            
            print(f"Processing query: {q}")
            start = time.time()
            answer = rag_pipeline(q)
            print(f"\n— Answer (in {time.time()-start:.2f}s) —\n{answer}\n")
    except KeyboardInterrupt:
        print("\nGoodbye!")