import cv2
import numpy as np
import pywt
import hashlib
import base64
from flask import Flask, request, jsonify
from flask_cors import CORS
app = Flask(__name__)
CORS(app)

def compute_sha256_bytes(image_bytes):
    return hashlib.sha256(image_bytes).hexdigest()

def embed_watermark(image, watermark_text):
    watermarked = np.zeros_like(image)
    for c in range(3):  # Process each channel
        channel = image[:, :, c]
        coeffs2 = pywt.dwt2(channel, 'haar')
        LL, (LH, HL, HH) = coeffs2

        # Embed watermark in HH
        text_bytes = [ord(char) for char in watermark_text]
        for i in range(min(len(text_bytes), HH.shape[0], HH.shape[1])):
            HH[i, i] += text_bytes[i] % 5

        watermarked_channel = pywt.idwt2((LL, (LH, HL, HH)), 'haar')
        watermarked[:, :, c] = np.uint8(np.clip(watermarked_channel, 0, 255))

    return watermarked

@app.route('/watermark', methods=['POST'])
def watermark_file():
    if 'file' not in request.files:
        return jsonify({"error": "No file uploaded"}), 400
    
    file = request.files['file']
    image_np = np.frombuffer(file.read(), np.uint8)
    image = cv2.imdecode(image_np, cv2.IMREAD_COLOR)

    watermarked_img = embed_watermark(image, "OWNER12345")

    # Encode watermarked image as PNG in memory
    _, buffer = cv2.imencode('.png', watermarked_img)
    img_bytes = buffer.tobytes()
    img_base64 = base64.b64encode(img_bytes).decode('utf-8')

    file_hash = compute_sha256_bytes(img_bytes)
    print(file_hash)
    return jsonify({
        "message": "Watermark embedded successfully",
        "hash": file_hash,
        "image_base64": img_base64
    })

if __name__ == "__main__":
    app.run(debug=True)
