from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import os
import google.generativeai as genai
from dotenv import load_dotenv

load_dotenv()

app = FastAPI()

# Enable CORS for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure Gemini API
api_key = os.getenv("GEMINI_API_KEY")
if api_key:
    genai.configure(api_key=api_key)

SYSTEM_PROMPT = """
You are an expert Video Script Writer and Editor. 
Your goal is to analyze the provided transcript and extract viral-worthy clips.

### OUTPUT FORMAT (Strictly Follow)
For each interesting section you find, output the following in Markdown:

### **Clip [N]: [Title of Clip]**
-   **Timestamp**: `MM:SS` to `MM:SS`
-   **Duration**: ~[Approx Duration]
-   **Viral Score**: [1-10]/10 (Reasoning)
-   **Narration Intro (Script for You)**:
    *   *Context*: [A 5-10s hook context]
    *   *Script*: "[Your script here - 3rd person, curiosity gap]"
-   **Hook Line**: "[Quote the best opening line of the clip]"
-   **Key Moments (Timestamps)**:
    -   `MM:SS`: "[FULL spoken text, NO ellipses/truncation. Include the complete sentence(s)]" (Start)
    -   `MM:SS`: "[FULL spoken text, NO ellipses/truncation. Include the complete context of the aha moment]" (Peak)
    -   `MM:SS`: "[FULL spoken text, NO ellipses/truncation. Include the complete closing sentence(s)]" (End)
-   **Recommended Edit**:
    -   [Edit instructions]
-   **Caption/Tweet**: "[Draft caption]"

---

### INSTRUCTIONS
1. Analyze the transcript for "Golden Nuggets", High Emotion, or Controversy.
2. Select the top 3-5 clips.
3. Ensure timestamps are accurate based on the input text.
4. STRICTLY NO ELLIPSES (...) in the Key Moments text. Provide full context.
"""

@app.post("/analyze")
async def analyze_transcript(file: UploadFile = File(...)):
    if not api_key:
        raise HTTPException(status_code=500, detail="GEMINI_API_KEY not configured in .env")
    
    try:
        content = await file.read()
        transcript_text = content.decode("utf-8")
        
        # Call Gemini (using flash for speed and to avoid Vercel timeouts if possible)
        model = genai.GenerativeModel('gemini-1.5-flash')
        response = model.generate_content(f"{SYSTEM_PROMPT}\n\nTRANSCRIPT:\n{transcript_text}")
        
        return {"analysis": response.text}
        
    except Exception as e:
        print(f"Error generating content: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/")
def read_root():
    return {"status": "CLIPOOOR Backend Running (Gemini)"}
