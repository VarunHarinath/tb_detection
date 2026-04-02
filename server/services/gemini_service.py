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
You are a medical professional reviewing a Ziehl–Neelsen stained sputum smear for suspected tuberculosis.

Your task is to write a clinically meaningful interpretation of the image, similar to how a doctor or microbiologist would describe findings in a lab report.

STRICT RULES:
- Use only medical and clinical language
- Do NOT mention:
  - AI model
  - detection system
  - confidence
  - bounding boxes
  - regions or coordinates
- Do NOT provide a definitive diagnosis
- Write as if you are a clinician interpreting a microscopy slide
- Focus on clarity and usefulness for another doctor

INTERNAL CONTEXT (DO NOT REPEAT DIRECTLY):
{summary}

--------------------------------------------------
FORMAT YOUR RESPONSE LIKE A CLINICAL NOTE
--------------------------------------------------

Write in structured format using bullet points:

1. Microscopic Findings:
- Describe what is seen in the image (morphology, staining, background)
- Mention presence or absence of acid-fast bacilli
- Use terms like:
  - “rod-shaped structures”
  - “acid-fast bacilli”
  - “stained background”
  - “distribution of organisms”

2. Interpretation:
- Explain what these findings suggest
- Use cautious medical wording like:
  - “findings are suggestive of”
  - “consistent with”
  - “indicative of possible presence”

3. Clinical Significance:
- Briefly explain why this matters clinically
- Mention relevance to tuberculosis infection

4. Recommendation:
- State that clinical correlation is required
- Suggest further evaluation or confirmation

--------------------------------------------------
GUIDELINES
--------------------------------------------------

- If many detections:
  use terms like “numerous” or “abundant”
- If moderate:
  use “multiple”
- If few:
  use “scattered”
- If none:
  clearly state no acid-fast bacilli observed

- Keep it detailed but professional
- Write like a real lab report or pathology note
- Make it easy for a doctor to understand quickly

--------------------------------------------------
FINAL NOTE
--------------------------------------------------

End with a statement that this interpretation should be correlated with clinical findings and confirmatory testing.

Now generate the clinical interpretation.
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