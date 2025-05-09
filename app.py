import os
import time
from flask import Flask, request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv
import json

# Import the RAG pipeline from the existing code
from rag_pipeline import retrieve_contexts, generate_answer, web_search, embedder

# Load environment variables
load_dotenv()

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

@app.route('/api/chat', methods=['POST'])
def chat():
    """
    Endpoint for chat messages that uses the RAG pipeline
    """
    try:
        data = request.json
        
        if not data or 'message' not in data:
            return jsonify({'error': 'No message provided'}), 400
        
        # Extract message and optional tags
        user_message = data['message']
        aircraft_model = data.get('aircraftModel')
        issue_category = data.get('issueCategory')
        
        # Log the incoming request
        print(f"Received message: {user_message}")
        print(f"Aircraft model: {aircraft_model}")
        print(f"Issue category: {issue_category}")
        
        # Add tags to query if provided
        enhanced_query = user_message
        if aircraft_model:
            enhanced_query = f"[{aircraft_model}] {enhanced_query}"
        if issue_category:
            enhanced_query = f"[{issue_category}] {enhanced_query}"
        
        # Start timing the response
        start_time = time.time()
        
        # Generate query embedding
        query_embedding = embedder.encode([enhanced_query], normalize_embeddings=True)[0]
        
        # Retrieve relevant contexts from both collections
        contexts = retrieve_contexts(query_embedding, top_k=3)
        
        # Generate response using the RAG pipeline
        response = generate_answer(enhanced_query, contexts)
        
        # Log processing time
        processing_time = time.time() - start_time
        print(f"Generated response in {processing_time:.2f} seconds")
        
        return jsonify({
            'response': response,
            'processingTime': processing_time
        })
    
    except Exception as e:
        print(f"Error in /api/chat: {e}")
        return jsonify({'error': str(e)}), 500

@app.route('/api/health', methods=['GET'])
def health_check():
    """
    Simple health check endpoint
    """
    return jsonify({'status': 'ok', 'message': 'API is running'})

if __name__ == "__main__":
    # Get port from environment or use default
    port = int(os.environ.get('PORT', 5000))
    
    # Use debug mode in development
    debug = os.environ.get('FLASK_ENV') == 'development'
    
    print(f"Starting Flask server on port {port}...")
    app.run(host='0.0.0.0', port=port, debug=debug)