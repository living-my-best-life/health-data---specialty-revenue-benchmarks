#!/bin/bash
# Healthcare Dashboard Data Research & Update Automation
# Runs monthly to check for updated data across all dashboard categories
# Uses Claude CLI with appropriate agents to research and update

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
DASHBOARD_DIR="$(dirname "$SCRIPT_DIR")"
DATA_DIR="$DASHBOARD_DIR/data"
LOG_DIR="$DASHBOARD_DIR/scripts/logs"
DATE=$(date +%Y-%m-%d)
LOG_FILE="$LOG_DIR/research-update-$DATE.log"

mkdir -p "$LOG_DIR"

log() {
  echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1" | tee -a "$LOG_FILE"
}

log "=== Healthcare Dashboard Research Update Started ==="
log "Dashboard dir: $DASHBOARD_DIR"
log "Data dir: $DATA_DIR"

# Check for Claude CLI
if ! command -v claude &>/dev/null; then
  log "ERROR: Claude CLI not found. Install from https://claude.com/claude-code"
  exit 1
fi

# ─── Phase 1: Research for data updates ───────────────────────────────────────
log "--- Phase 1: Researching data sources for updates ---"

RESEARCH_PROMPT="You are a healthcare data research analyst. Your task is to check whether newer data is available for the Digital Healthcare Strategic Dashboard.

Current data vintages in the dashboard:
1. SPECIALTY BENCHMARK: CMS Medicare Provider Utilization 2023 (latest year in data)
   - 9 specialties tracked: Internal Medicine, Nurse Practitioner, Family Practice, Dermatology, Physician Assistant, Orthopedic Surgery, Emergency Medicine, Psychiatry, Clinical Psychology
   - Trends from 2013-2023
   - Source: data.cms.gov Medicare Provider Utilization and Payment Data

2. PAYER RATES: Transparency in Coverage machine-readable files
   - 10 payers: UHC, Aetna, Cigna, BCBS MN, BCBS AL, Blue Shield CA, Premera, HealthPartners, UCare, Healthcare Bluebook
   - 9 billing codes: 11102, 17003, 20610, 27447, 90834, 90837, 99213, 99214, 99215
   - Source: Payer MRFs per No Surprises Act

3. MEDICARE FEE SCHEDULE: CMS Physician Fee Schedule
   - Same 9 HCPCS codes, facility and non-facility rates
   - Source: CMS PFS lookup

4. GLP-1 TRENDS: CMS Part D Spending by Drug data
   - Drugs: Ozempic, Mounjaro, Rybelsus, Wegovy, Zepbound
   - Latest period: 2025 H1 (Jan-Jun 2025)
   - Source: data.cms.gov Part D spending

5. ED TRENDS: CMS Medicare ED utilization
   - Years: 2018-2023
   - Source: CMS Medicare Provider Utilization

6. PROVIDER DENSITY: State-level provider counts per 10K beneficiaries
   - Source: CMS Medicare Provider Utilization (aggregated by state)

7. HPSA SHORTAGE: HRSA Health Professional Shortage Areas
   - Primary care and mental health shortage areas by state
   - Source: data.hrsa.gov HPSA data

For each category, search the web to determine:
- Is there a newer data release available? (e.g., 2024 Medicare data, updated Part D spending, new PFS rates)
- What is the latest available data vintage?
- Where can the updated data be downloaded?
- Any significant methodology changes?

Also research these EMERGING topics that should be added to the dashboard:
- Medicare Advantage market share changes
- Telehealth utilization trends (post-PHE)
- AI/ML adoption in clinical settings (CMS AI-related codes)
- Prior authorization reform impacts
- Site-of-service cost differentials

Output a structured JSON report with this schema:
{
  \"research_date\": \"$DATE\",
  \"categories\": [
    {
      \"name\": \"category name\",
      \"current_vintage\": \"what we have\",
      \"latest_available\": \"what's available now\",
      \"update_needed\": true/false,
      \"data_url\": \"download URL if available\",
      \"notes\": \"any methodology changes or important context\"
    }
  ],
  \"emerging_topics\": [
    {
      \"topic\": \"topic name\",
      \"data_available\": true/false,
      \"source\": \"where to get it\",
      \"recommendation\": \"should we add this to the dashboard?\"
    }
  ]
}

IMPORTANT: Only report factual findings. Do not hallucinate data URLs or release dates. If you cannot confirm a newer release, say so."

log "Running research with Claude CLI..."
RESEARCH_OUTPUT="$LOG_DIR/research-findings-$DATE.json"

claude -p "$RESEARCH_PROMPT" \
  --allowedTools "WebSearch,WebFetch" \
  --output-format json \
  > "$RESEARCH_OUTPUT" 2>>"$LOG_FILE" || {
    log "WARNING: Research phase completed with errors, checking output..."
  }

if [ -f "$RESEARCH_OUTPUT" ] && [ -s "$RESEARCH_OUTPUT" ]; then
  log "Research findings saved to: $RESEARCH_OUTPUT"
else
  log "WARNING: Research output empty or missing, running in text mode..."
  claude -p "$RESEARCH_PROMPT" \
    --allowedTools "WebSearch,WebFetch" \
    > "$RESEARCH_OUTPUT" 2>>"$LOG_FILE" || true
fi

# ─── Phase 2: Data update (if research found newer data) ─────────────────────
log "--- Phase 2: Checking if data updates are needed ---"

UPDATE_PROMPT="You are a healthcare data engineer updating the Digital Healthcare Strategic Dashboard.

Read the research findings below and the current data files, then determine what needs updating.

Research findings are at: $RESEARCH_OUTPUT

Current data directory: $DATA_DIR
Current data files:
$(ls -la "$DATA_DIR"/*.json 2>/dev/null | awk '{print $NF, $5}')

For any category where newer data IS confirmed available:
1. Fetch the updated data from the identified source
2. Transform it to match the existing JSON schema exactly
3. Update the data file in $DATA_DIR
4. Log what changed

For categories where data is NOT yet updated:
- Skip and note in the log

CRITICAL RULES:
- Match existing JSON schema exactly (same field names, types, structure)
- Preserve all historical data, only ADD newer periods
- Do NOT delete or modify existing data points
- Validate that updated files are valid JSON before saving
- If a data source requires manual download, note the URL and skip

After updates, provide a summary of:
- Files updated (with before/after row counts)
- Files skipped (with reason)
- Recommended manual actions"

log "Running data update check..."
UPDATE_OUTPUT="$LOG_DIR/update-results-$DATE.md"

claude -p "$UPDATE_PROMPT" \
  --allowedTools "Read,Write,Edit,WebSearch,WebFetch,Bash,Glob" \
  > "$UPDATE_OUTPUT" 2>>"$LOG_FILE" || {
    log "WARNING: Update phase completed with errors"
  }

log "Update results saved to: $UPDATE_OUTPUT"

# ─── Phase 3: Rebuild and deploy if changes were made ─────────────────────────
log "--- Phase 3: Checking for changes and rebuilding ---"

cd "$DASHBOARD_DIR"

# Check if any data files changed
if git diff --quiet data/ 2>/dev/null; then
  log "No data file changes detected. Skipping rebuild."
else
  log "Data changes detected! Files modified:"
  git diff --name-only data/ 2>>"$LOG_FILE" | tee -a "$LOG_FILE"

  # Build the dashboard to validate
  log "Building dashboard to validate changes..."
  if npm run build >> "$LOG_FILE" 2>&1; then
    log "Build successful!"

    # Stage and commit
    git add data/
    git commit -m "data: monthly healthcare dashboard update $DATE

Updated data sources:
$(git diff --cached --stat data/ 2>/dev/null)

Co-Authored-By: Claude Opus 4.6 <noreply@anthropic.com>" >> "$LOG_FILE" 2>&1 || log "WARNING: Commit failed"

    log "Changes committed. Run 'vercel --prod' or push to deploy."
  else
    log "ERROR: Build failed after data update! Reverting changes..."
    git checkout data/
    log "Changes reverted. Manual investigation needed."
  fi
fi

# ─── Phase 4: Generate summary report ─────────────────────────────────────────
log "--- Phase 4: Generating summary report ---"

SUMMARY="$LOG_DIR/monthly-summary-$DATE.md"
cat > "$SUMMARY" << EOF
# Healthcare Dashboard Monthly Update — $DATE

## Research Findings
$(cat "$RESEARCH_OUTPUT" 2>/dev/null | head -200 || echo "See $RESEARCH_OUTPUT")

## Update Results
$(cat "$UPDATE_OUTPUT" 2>/dev/null | head -200 || echo "See $UPDATE_OUTPUT")

## Data File Status
$(ls -la "$DATA_DIR"/*.json 2>/dev/null | awk '{printf "- %s (%s bytes, %s)\n", $NF, $5, $6" "$7" "$8}')

## Next Steps
- Review research findings for manual data updates
- Check emerging topics for dashboard expansion
- Verify dashboard at https://digital-health-rouge.vercel.app/
EOF

log "Summary report: $SUMMARY"
log "=== Healthcare Dashboard Research Update Complete ==="
