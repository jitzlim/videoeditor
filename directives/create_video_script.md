# Create Video Script Directive

**Goal**: Generate a video script or analyze a transcript using the `video-script-writer` skill.

**Inputs**:
-   **Request Type**: New Script OR Transcript Analysis
-   **Topic/Subject**: (e.g., "Productivity", "Crypto Launch")
-   **Transcript**: (Text content if analyzing)
-   **Platform**: (YouTube, TikTok, Twitter, etc.)

**Process**:
1.  **Trigger Skill**: Load `video-script-writer.skill`.
2.  **Context Analysis**:
    -   If **Script**: Determine audience, tone, and key points.
    -   If **Analysis**: Scan transcript for "Viral Markers" (Hot takes, Emotion, Nuggets).
3.  **Drafting**:
    -   Generate the content using the formats defined in the Skill (3-Column Table for scripts, Ranked List for analysis).
4.  **Review**: Ensure timestamps, visual cues, and audio coincide efficiently.

**Output**:
-   Markdown file with the script or analysis.
-   Suggestions for next steps (e.g., distinct social captions).

**Tools**:
-   `video-script-writer.skill` (Main logic)
