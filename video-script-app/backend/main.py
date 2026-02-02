from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import os
from openai import OpenAI
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

# Configure OpenRouter/OpenAI API
api_key = os.getenv("OPENROUTER_API_KEY")
site_url = os.getenv("SITE_URL", "http://localhost:5173")
site_name = os.getenv("SITE_NAME", "CLIPOOOR")

if api_key:
    client = OpenAI(
        base_url="https://openrouter.ai/api/v1",
        api_key=api_key,
    )
else:
    client = None

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
    if not client:
        raise HTTPException(status_code=500, detail="OPENROUTER_API_KEY not configured in .env")
    
    try:
        content = await file.read()
        transcript_text = content.decode("utf-8")
        
        # Call OpenRouter (Google Gemma 3 free model)
        completion = client.chat.completions.create(
            extra_headers={
                "HTTP-Referer": site_url,
                "X-Title": site_name,
            },
            model="google/gemma-3n-e4b-it:free",
            messages=[
                {
                    "role": "user",
                    "content": f"{SYSTEM_PROMPT}\n\nTRANSCRIPT:\n{transcript_text}"
                }
            ]
        )
        
        response_text = completion.choices[0].message.content
        return {"analysis": response_text}
        
    except Exception as e:
        # Print error to logs for debugging
        print(f"Error generating content: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/")
def read_root():
    return {"status": "Video Script App Backend Running (OpenRouter)"}
