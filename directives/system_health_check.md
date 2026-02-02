# System Health Check Directive

**Goal**: Verify that the 3-Layer Architecture is correctly instantiated and the runtime environment is functional.

**Step 1: Verify Directory Structure**
- Check that the following exist:
  - `execution/`
  - `directives/`
  - `.tmp/`
  - `.env`
  - `CLAUDE.md`
  - `GEMINI.md`
  - `AGENTS.md`

**Step 2: Verify Python Execution**
- Run a simple Python script to confirm that:
  - Python is installed and reachable.
  - The script can write to `.tmp/`.
  - The script can read `.env` (presence check).

**Step 3: Output**
- Print "System Operational: 3-Layer Architecture Ready" if all checks pass.
- Print error details if any check fails.

**Tools:**
- `execution/system_health_check.py` (Script to run the checks)
