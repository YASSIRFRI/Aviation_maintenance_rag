import os
from flask import Flask, request, jsonify
from flask_cors import CORS
import time
from dotenv import load_dotenv

# Import your RAG pipeline
# Comment this out for the initial test if you want to debug connection only
from rag_pipeline import rag_pipeline

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
        start_time = time.time()
        data = request.json
        
        if not data or 'message' not in data:
            return jsonify({'error': 'No message provided'}), 400
        
        # Extract message and optional tags
        user_message = data['message']
        aircraft_model = data.get('aircraftModel')
        issue_category = data.get('issueCategory')
        
        # Print received data to console for verification
        print("="*50)
        print(f"RECEIVED MESSAGE FROM FRONTEND: '{user_message}'")
        print(f"Aircraft model: {aircraft_model}")
        print(f"Issue category: {issue_category}")
        print("="*50)
        
        # Add tags to the message if available
        enhanced_message = user_message
        if aircraft_model:
            enhanced_message = f"[Aircraft: {aircraft_model}] {enhanced_message}"
        if issue_category:
            enhanced_message = f"[Issue Category: {issue_category}] {enhanced_message}"
        
        print(f"Enhanced message to be processed: '{enhanced_message}'")
        
        # Process with RAG pipeline
        try:
            # Generate response using RAG pipeline
            response = rag_pipeline(enhanced_message)
            print(f"RAG pipeline response received: {response[:100]}...")  # Print first 100 chars
        except Exception as rag_error:
            print(f"Error in RAG pipeline: {rag_error}")
            response = f"I encountered an error processing your request: {str(rag_error)}"
        
        # Calculate processing time
        processing_time = round(time.time() - start_time, 2)
        print(f"Processing time: {processing_time}s")
        
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
    Simple health check endpoint to verify the server is running
    """
    return jsonify({
        'status': 'ok',
        'message': 'Flask API is running with RAG pipeline integration'
    })

if __name__ == "__main__":
    port = int(os.environ.get('PORT', 5000))
    print(f"Starting Flask server with RAG pipeline on port {port}...")
    print(f"Server will receive messages from frontend running at http://localhost:5173")
    print(f"Health check available at: http://localhost:{port}/api/health")
    app.run(host='0.0.0.0', port=port, debug=True)