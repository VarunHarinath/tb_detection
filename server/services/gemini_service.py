import os
from pathlib import Path
import google.generativeai as genai
from dotenv import load_dotenv
load_dotenv()

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
genai.configure(api_key=GEMINI_API_KEY)

model = genai.GenerativeModel("gemini-2.5-flash")


def explain_prediction(image_path: str, detections: list[dict]) -> str:
    if not detections:
        summary = "No TB detections were found by the detection model."
    else:
        summary_lines = []
        for i, d in enumerate(detections, start=1):
            summary_lines.append(
                f"{i}. class={d['class_name']}, confidence={d['confidence']:.2f}, bbox={d['bbox']}"
            )
        summary = "\n".join(summary_lines)

    prompt = f"""
You are assisting with a tuberculosis microscopy detection demo.

Rules:
- Do not claim a medical diagnosis.
- Explain only what the image appears to show and what the detection model predicted.
- Mention that this is an AI-generated supportive explanation for demo use.
- Keep the response short, clear, and professional.

Detection summary:
{summary}

Now explain the uploaded image and the detected regions in 4 to 6 sentences.
"""

    image_bytes = Path(image_path).read_bytes()

    response = model.generate_content([
        prompt,
        {
            "mime_type": "image/jpeg",
            "data": image_bytes
        }
    ])

    return response.text