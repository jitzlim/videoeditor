from fastapi import FastAPI, UploadFile, File, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import os
import json
import logging
import re
import time
from openai import OpenAI

from dotenv import load_dotenv

# Strategic Logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

load_dotenv()

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

OPENROUTER_API_KEY = os.getenv("OPENROUTER_API_KEY")

# Primary Clients
client = OpenAI(
    base_url="https://openrouter.ai/api/v1",
    api_key=OPENROUTER_API_KEY,
    timeout=120.0, # Kill hung connections after 2 minutes
)

# REFINED SYSTEM PROMPT (Claude-Style Precision)
SYSTEM_PROMPT = """
You are a Lead Content Strategist. Your objective is to extract exactly 3 high-leverage viral segments.

### CRITICAL FORMATTING
1. Return ONLY valid JSON.
2. Use 'single quotes' for text inside strings.
3. Wrap JSON in ```json blocks.

### OUTPUT SCHEMA (EXAMPLE)
{
    "clips": [
        {
            "id": 1,
            "title": "THE HIDDEN COST OF SPEED",
            "timestamp": "04:20 to 05:15",
            "duration": "55s",
            "viral_score": 9,
            "strategy": {
                "hook_type": "Pattern Interrupt",
                "psychological_trigger": "Loss Aversion",
                "logic": "The speaker challenges the common belief that faster is always better, creating immediate cognitive dissonance."
            },
            "narration_intro": {
                "context": "Setup of the current speed-obsessed market",
                "script": "The market is moving at light speed, but **nobody is talking about the cost**. Here is why you might be losing by being too fast."
            },
            "variants": [
                {"type": "Pattern Interrupt", "text": "If you are trading in under 10 milliseconds, you are not trading, you are **gambling against a supercomputer**."},
                {"type": "Narrative Loop", "text": "There is a **hidden tax** on every trade you make. Most people ignore it until they've lost everything."},
                {"type": "Direct Benefit", "text": "Scale your trading frequency by **10x** without increasing your risk profile."}
            ],
            "key_moments": [
                {"time": "04:20", "text": "Segment In-Point: The exact verbatim opening sentence."},
                {"time": "04:35", "text": "Narrative Build: A crucial middle sentence that develops the technical case."},
                {"time": "04:55", "text": "The Peak Insight: The 'aha' moment spoken by the guest."},
                {"time": "05:05", "text": "Secondary Proof: A supporting sentence that reinforces the claim."},
                {"time": "05:15", "text": "Segment Out-Point: The closing sentence that wraps the point."}
            ],
            "recommended_edit": "Flash text overlays of 'GAMBLING' vs 'TRADING' with glitch transitions.",
            "caption": "Winning isn't about being first, it is about being right. 🧵"
        }
    ]
}

### CRITICAL RULES
1. **VERBATIM FIDELITY**: In the 'key_moments' section, you MUST provide EXACTLY 5 exact spoken sentences from the transcript. NEVER summarize. I need the actual words to help with video editing.
2. **NO PLACEHOLDERS**: Every field must contain unique content from the transcript. NEVER use example text.
3. **MAX 3 CLIPS**: Only extract the top 3 clips to ensure model stability.
4. **SIGNAL VARIANTS**: Provide exactly 3 hook variations per clip in the 'variants' array: Pattern Interrupt, Narrative Loop, and Direct Benefit.
5. **JSON ONLY**: Return only the JSON object.
"""

def heuristic_json_fix(json_str):
    logger.info("Attempting Heuristic JSON Fix...")
    json_str = re.sub(r'<think>.*?</think>', '', json_str, flags=re.DOTALL)
    match = re.search(r'(\{.*\})', json_str, re.DOTALL)
    if match:
        json_str = match.group(1)
    json_str = re.sub(r',\s*([\]}])', r'\1', json_str)
    open_braces = json_str.count('{')
    close_braces = json_str.count('}')
    if open_braces > close_braces:
        json_str += '}' * (open_braces - close_braces)
    if json_str.count('[') > json_str.count(']'):
        json_str = json_str.rstrip('}') + ']}' 
    return json_str

@app.post("/api/analyze")
@app.post("/analyze")
@app.post("/")
async def analyze_transcript(
    file: UploadFile = File(...),
    model: str = Form("openai/gpt-oss-20b:free")
):
    start_time = time.time()
    try:
        content = await file.read()
        transcript_text = content.decode("utf-8")
        
        # Limit transcript length
        max_chars = 15000
        if len(transcript_text) > max_chars:
            transcript_text = transcript_text[:max_chars] + "...[TRUNCATED]"

        logger.info(f"INITIATING_RECON: Model={model} | Length={len(transcript_text)}")

        # UNIFIED INTELLIGENCE ROUTING (OpenRouter)
        if not OPENROUTER_API_KEY:
             logger.error("MISSION_CRITICAL_FAILURE: OPENROUTER_API_KEY is null")
             raise HTTPException(status_code=500, detail="OpenRouter API Key missing. Please set it in Vercel settings.")
            
        # Map Gemini Direct to OpenRouter ID if needed
        target_model = model
        if "gemini-2.0-flash" in model or "gemini-3" in model:
            target_model = "google/gemini-2.0-flash-exp" # Valid OpenRouter model ID

        logger.info(f"SIGNAL_DISPATCH: TargetModel={target_model}")
        api_start = time.time()
        
        try:
            response = client.chat.completions.create(
                extra_headers={"HTTP-Referer": "https://clipr.vercel.app", "X-Title": "CLIPR"},
                model=target_model,
                messages=[
                    {"role": "system", "content": SYSTEM_PROMPT},
                    {"role": "user", "content": f"TRANSCRIPT:\n{transcript_text}"}
                ],
                response_format={"type": "json_object"} if "gemini" in target_model or "gpt-4o" in target_model else None,
                extra_body={"reasoning": {"enabled": True}} if "gpt-oss" in target_model or "r1" in target_model else {},
                temperature=0.1
            )
        except Exception as api_err:
            logger.error(f"API_BRIDGE_COLLAPSE: {str(api_err)}")
            raise HTTPException(status_code=500, detail=f"AI Bridge Error: {str(api_err)}")

        api_end = time.time()
        logger.info(f"SIGNAL_RECEIVED: API_Latency={api_end - api_start:.2f}s")

        raw_output = response.choices[0].message.content or ""
        clean_output = re.sub(r'<think>.*?</think>', '', raw_output, flags=re.DOTALL).strip()
        json_match = re.search(r'```json\s*(\{.*?\})\s*```', clean_output, re.DOTALL)
        if not json_match:
            json_match = re.search(r'(\{.*\})', clean_output, re.DOTALL)
        json_str = json_match.group(1) if json_match else clean_output

        try:
            data = json.loads(json_str)
        except json.JSONDecodeError:
            try:
                fixed_json = heuristic_json_fix(json_str)
                data = json.loads(fixed_json)
            except Exception:
                raise HTTPException(status_code=500, detail="Strategic signal malformed. Try a shorter segment.")

        if "clips" in data:
            data["clips"] = [c for c in data["clips"] if isinstance(c, dict)]
            data["clips"].sort(key=lambda x: x.get("viral_score", 0), reverse=True)
            
        logger.info(f"RECON_COMPLETE: Total_Duration={time.time() - start_time:.2f}s")
        return data
    except HTTPException:
        raise
    except Exception as e:
        logger.exception("SYSTEM_CRASH")
        raise HTTPException(status_code=500, detail=f"INTERNAL_COLLAPSE: {str(e)}")

@app.get("/api/analyze")
@app.get("/analyze")
@app.get("/")
def read_root():
    return {"status": "G3-Enhanced Engine Active // HEARTBEAT_STABLE"}
