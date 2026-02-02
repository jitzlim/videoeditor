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

# Configure OpenRouter via OpenAI client
# Note: Using the free OSS model as requested
OPENROUTER_API_KEY = os.getenv("OPENROUTER_API_KEY")
client = OpenAI(
    base_url="https://openrouter.ai/api/v1",
    api_key=OPENROUTER_API_KEY,
)

SYSTEM_PROMPT = """
You are an expert Video Script Writer and Editor. 
Your goal is to analyze the provided transcript and extract viral-worthy clips.

### OUTPUT FORMAT (Strictly Follow)
For each interesting section you find, output the following in Markdown:

### **Clip [N]: [Title of Clip]**
-   **Timestamp**: `MM:SS` to `MM:SS`
-   **Duration**: ~60 seconds
-   **Viral Score**: [1-10]/10 (Reasoning)
-   **Narration Intro (Script for You)**:
    *   *Context*: [The high-stakes problem or setup this clip addresses]
    *   *Script*: "[3rd person high-impact narration. Start with a shocking claim, a profound question, or a 'secret' being revealed. Narrate ABOUT the speaker and the clip like a top-tier documentary narrator or TikTok storyteller. Use curiosity gaps like 'He literally just...', 'The industry is missing this one thing...', 'Wait until you hear how he...'. Make it unskippable.]"
-   **Hook Line**: "[The absolute most punchy, 'Golden Nugget' quote from the clip that stops the scroll immediately.]"
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
2. Select the top 3-5 clips, targeting segments that are approximately 60 seconds long to allow for deeper storytelling.
3. If a single point is too short, look for the surrounding context or related follow-up points to build a full 1-minute narrative arc.
4. Ensure timestamps are accurate based on the input text.
5. STRICTLY NO ELLIPSES (...) in the Key Moments text. Provide full context.
"""

@app.post("/analyze")
async def analyze_transcript(file: UploadFile = File(...)):
    if not OPENROUTER_API_KEY:
        raise HTTPException(status_code=500, detail="OPENROUTER_API_KEY not configured in .env")
    
    try:
        content = await file.read()
        transcript_text = content.decode("utf-8")
        
        # Call OpenRouter
        response = client.chat.completions.create(
            extra_headers={
                "HTTP-Referer": "https://clipooor.vercel.app", # Optional
                "X-Title": "CLIPOOOR", # Optional
            },
            model="openai/gpt-oss-120b:free",
            messages=[
                {"role": "system", "content": SYSTEM_PROMPT},
                {"role": "user", "content": f"TRANSCRIPT:\n{transcript_text}"}
            ]
        )
        
        analysis_text = response.choices[0].message.content
        return {"analysis": analysis_text}
        
    except Exception as e:
        print(f"Error generating content: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/")
def read_root():
    return {"status": "CLIPOOOR Backend Running (OpenRouter)"}
