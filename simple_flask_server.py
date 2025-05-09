import os
from flask import Flask, request, jsonify
from flask_cors import CORS
import time

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes - critical for connecting to React

@app.route('/api/chat', methods=['POST'])
def chat():
    """
    Simple endpoint for chat messages that just logs received messages
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
        
        # For testing, just return a simple response
        # Later you'll replace this with your actual RAG pipeline
        mock_response = f"I received your message about: {user_message}"
        
        # Calculate processing time
        processing_time = round(time.time() - start_time, 2)
        print(f"Processing time: {processing_time}s")
        
        return jsonify({
            'response': mock_response,
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
        'message': 'Flask API is running'
    })

if __name__ == "__main__":
    port = int(os.environ.get('PORT', 5000))
    print(f"Starting Flask server on port {port}...")
    print(f"Server will receive messages from frontend running at http://localhost:5173")
    print(f"Health check available at: http://localhost:{port}/api/health")
    app.run(host='0.0.0.0', port=port, debug=True)