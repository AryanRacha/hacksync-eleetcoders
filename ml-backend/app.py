from flask import Flask, request, jsonify
from fastai.vision.all import load_learner, PILImage
import requests
import pathlib
from io import BytesIO

temp = pathlib.PosixPath
pathlib.PosixPath = pathlib.WindowsPath

app = Flask(__name__)

# Load the exported model
try:
    learn_inference = load_learner('export.pkl')
    print("Model loaded successfully.")
except Exception as e:
    print(f"Error loading model: {e}")
    learn_inference = None

@app.route('/')
def home():
    return "Image Classification API. Use /predict endpoint."

@app.route('/predict', methods=['GET'])
def predict_image_url():
    if learn_inference is None:
        return jsonify({'error': 'Model not loaded'}), 500

    image_url = request.args.get('img_url')
    if not image_url:
        return jsonify({'error': 'No image_url provided in parameters.'}), 400

    try:
        response = requests.get(image_url)
        response.raise_for_status() # Raise an exception for HTTP errors
        img = PILImage.create(BytesIO(response.content))
        
        pred, pred_idx, probs = learn_inference.predict(img)
        
        return jsonify({
            'prediction': str(pred),
            'probability': float(probs[pred_idx]),
            'categories': [str(c) for c in learn_inference.dls.vocab]
        })
    except requests.exceptions.RequestException as e:
        return jsonify({'error': f'Failed to download image from URL: {e}'}), 400
    except Exception as e:
        return jsonify({'error': f'Prediction failed: {e}'}), 500

if __name__ == '__main__':
    # To run this in a production-like environment, use a WSGI server like Gunicorn
    # For local development:
    app.run(host='0.0.0.0', port=5000, debug=False, threaded=False)