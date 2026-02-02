---
name: video-script-writer
description: Creates engaging video scripts for YouTube, social media, and marketing, and analyzes transcripts to identify viral-worthy clips. Use this skill when the user wants to write a video script (YouTube, TikTok, Reels, etc.) or needs to extract short clips from a longer video transcript.
---

# Video Script Writer

This skill helps you create high-engagement video scripts and analyze transcripts for viral clip potential.

## Capabilities

1.  **Script Generation**: Full scripts for short-form (TikTok, Reels) and long-form (YouTube, Video Sales Letters) content.
2.  **Transcript Analysis**: identifying "viral moments" from long-form content (podcasts, interviews, raw footage).

## 1. Script Generation Workflow

When the user asks for a script (e.g., "Write a 60s script about X"), follow this structure:

### Phase 1: Planning
-   **Identify the Goal**: Educational, Entertainment, Viral/Hype, or Promotional?
-   **Target Audience**: Who is watching?
-   **Platform**: YouTube (Landscape, Slower pace) vs. TikTok/Reels (Portrait, Fast pace).

### Phase 2: Writing the Script
Use the **Standard 3-Column Format** (unless otherwise requested):

| Time | Visual / Action | Audio (Narration/Dialogue) |
| :--- | :--- | :--- |
| **0:00-0:03** | **HOOK**: [Visual description, e.g., Fast cut, text overlay "STOP DOING THIS"] | "You're ruining your productivity with this one mistake." |
| **0:03-0:15** | **THE PROBLEM**: [Show struggle, b-roll of failure] | "We all think multitasking works, but science says it drops IQ by 15 points." |
| **0:15-0:50** | **THE SOLUTION**: [Talking head vs B-roll, diagrams] | "Here is the 3-step method to fix it..." (Content body) |
| **0:50-1:00** | **CTA**: [End screen, Subscribe button] | "Try this today. Subscribe for more." |

### Key Elements to Include:
1.  **The Hook (First 3s)**: Must be visually and verbally arresting.
2.  **Visual Directions**: Be specific. Don't just say "B-roll". Say "B-roll of hands typing frantically on a backlit keyboard."
3.  **Pacing**: Short sentences. Rhythm.
4.  **Text Overlays**: Indicate where text should pop up on screen.
5.  **Audio Cues**: Suggest SFX (e.g., *woosh*, *ding*) and Music vibe (e.g., "Upbeat Lo-Fi").

## 2. Transcript Analysis Workflow

When the user provides a transcript and asks for clips (e.g., "Find the best 3 clips for Twitter"):

### Step 1: Scan for "Viral Markers"
Look for:
-   **Hot Takes / Controversy**: Statements that spark debate.
-   **High Emotion**: Laughter, shock, tearing up, intense passion.
-   **"Golden Nuggets"**: Unexpected facts or "Aha!" moments.
-   **Story Loops**: A self-contained story with a clear beginning and punchline.

### Step 2: Rate and Select
Select the top candidates and present them in this format:

### **Clip 1: [Title of Clip]**
-   **Timestamp**: `MM:SS` to `MM:SS`
-   **Duration**: ~30s
-   **Viral Score**: 9/10 (Why? e.g., "Strong contrarian opinion")
-   **Narration Intro (Script for You)**:
    *   *Context*: A 5-10s hook for you to record as an intro before the clip plays.
    *   *Script*: "You won't believe what [Guest Name] just revealed about [Topic]. Watch this..." (Use 3rd person, creating high curiosity).
-   **Hook Line**: "[Quote the best opening line of the clip]"
-   **Key Moments (Timestamps)**:
    -   `MM:SS`: "[FULL spoken text, NO ellipses/truncation. Include the complete sentence(s)]" (Start)
    -   `MM:SS`: "[FULL spoken text, NO ellipses/truncation. Include the complete context of the aha moment]" (Peak)
    -   `MM:SS`: "[FULL spoken text, NO ellipses/truncation. Include the complete closing sentence(s)]" (End)
-   **Recommended Edit**:
    -   *Cut lines A and B to speed it up.*
    -   *Add text overlay on the word "failure" for emphasis.*
-   **Caption/Tweet**: "[Draft a short distinct caption for social posting]"

---

## 3. Example Output Templates

### Short-Form Script (TikTok/Shorts)
```markdown
**Title**: 3 Productivity Hacks
**Total Duration**: 50s
**Vibe**: Energetic, Fast

| Time | Visual | Audio |
|:---|:---|:---|
| 0:00 | **Face tight on camera** + Text: "STOP!" | Stop scrolling if you want to save 2 hours today! |
| ... | ... | ... |
```

### Long-Form Script (YouTube)
*Structure*: Hook -> Intro (Quick) -> The "Meat" (Points 1, 2, 3) -> Summary -> CTA.

## Guidelines
-   **Show, Don't Just Tell**: Always providing visual counterparts to words.
-   **Be Concise**: Scripts are usually read faster than conversation.
-   **Tone Matching**: Match the user's desired tone (Professional, Hype, Casual).
