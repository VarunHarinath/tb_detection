import os
import requests
import json
from pathlib import Path

# Provide a default model, but allow override via ENV
OLLAMA_MODEL = os.getenv("OLLAMA_MODEL", "llama3")
OLLAMA_API_URL = "http://localhost:11434/api/generate"

def explain_prediction(image_path: str, detections: list[dict]) -> str:
    total_bacilli = sum(d.get("count", 1) for d in detections)
    cluster_count = sum(1 for d in detections if d.get("count", 1) > 1)
    uncertain_cluster_count = sum(1 for d in detections if d.get("uncertain", False))
    
    if total_bacilli == 0:
        internal_context = "No acid-fast bacilli observed."
    else:
        internal_context = f"Total estimated acid-fast bacilli count: {total_bacilli}.\n"
        internal_context += f"Number of dense clusters observed: {cluster_count}.\n"
        internal_context += f"Number of clusters flagged as uncertain: {uncertain_cluster_count}."

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
  - software debugging terms
- Do NOT provide a definitive diagnosis
- Write as if you are a clinician interpreting a microscopy slide
- Focus on clarity and usefulness for another doctor

INTERNAL CONTEXT (USE THIS CLINICAL DATA TO INFORM YOUR REPORT):
{internal_context}

--------------------------------------------------
FORMAT YOUR RESPONSE LIKE A CLINICAL NOTE
--------------------------------------------------

Write in structured format using bullet points:

1. Microscopic Findings:
- Describe what is seen in the image (morphology, staining, background)
- Mention presence or absence of acid-fast bacilli
- Use terms like:
  - "rod-shaped structures"
  - "acid-fast bacilli"
  - "stained background"
  - "distribution of organisms"

2. Interpretation:
- Explain what these findings suggest
- Use cautious medical wording like:
  - "findings are suggestive of"
  - "consistent with"
  - "indicative of possible presence"

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
  use terms like "numerous" or "abundant"
- If moderate:
  use "multiple"
- If few:
  use "scattered"
- If none:
  clearly state no acid-fast bacilli observed

- Keep it detailed but professional
- Write like a real lab report or pathology note
- Make it easy for a doctor to understand quickly

--------------------------------------------------
FINAL NOTE
--------------------------------------------------

End with a statement that this interpretation should be correlated with clinical findings and confirmatory testing.
You MUST also explicitly state: "This system provides an estimated automated count and must be reviewed by a qualified professional, especially for dense or uncertain clusters."

Now generate the clinical interpretation based strictly on the INTERNAL CONTEXT provided. Do not invent details.
"""

    payload = {
        "model": OLLAMA_MODEL,
        "prompt": prompt,
        "stream": False
    }

    try:
        # Increase timeout because local LLMs might take a moment to generate text
        response = requests.post(OLLAMA_API_URL, json=payload, timeout=60)
        response.raise_for_status()
        result_json = response.json()
        return result_json.get("response", "Error: No response from Ollama")
    except requests.exceptions.ConnectionError:
        return "Error: Could not connect to local Ollama server at http://localhost:11434. Is Ollama running?"
    except Exception as e:
        return f"Error communicating with Ollama: {str(e)}"
