from flask import Flask, request, jsonify
from flask_cors import CORS, cross_origin
import pytesseract
from PIL import Image
import io
import openai

app = Flask(__name__)

# CORS configuration
CORS(app, resources={r"/*": {"origins": "*"}})  # Allow all origins for testing, or restrict to specific origins

# Azure OpenAI configuration
azure_endpoint = "https://opeanai-eastus.openai.azure.com/"
api_key = "a00d081fe4b849beb5b5c0c4ed8d837f"
model = "gpt4o"

openai.api_type = "azure"
openai.api_key = api_key
openai.api_base = azure_endpoint
openai.api_version = "2023-05-15"

@app.route('/api/summarize', methods=['POST'])
@cross_origin()  # This decorator explicitly allows CORS for this route
def summarize():
    try:
        image_file = request.files['image']
        image = Image.open(io.BytesIO(image_file.read()))
        
        extracted_text = pytesseract.image_to_string(image)
        
        summary = get_summary(extracted_text)
        
        return jsonify({'summary': summary}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

def get_summary(text):
    response = openai.ChatCompletion.create(
        engine=model,
        messages=[
            {"role": "system", "content": "You are an AI that summarizes text."},
            {"role": "user", "content": f"Summarize the following text:\n\n{text}"}
        ],
        max_tokens=150,
        temperature=0.5
    )
    return response['choices'][0]['message']['content'].strip()

if __name__ == '__main__':
    app.run(port=5000, debug=True)
