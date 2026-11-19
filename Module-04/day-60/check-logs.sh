#!/usr/bin/env bash
set -euo pipefail

LOG_FILE="${1:-logs.jsonl}"

if [ ! -f "$LOG_FILE" ]; then
  echo "Log file not found: $LOG_FILE"
  exit 1
fi

# Verify every non-empty line is valid JSON
node -e '
const fs = require("fs");
const lines = fs.readFileSync(process.argv[1], "utf8").split(/\r?\n/).filter(Boolean);
for (const [idx, line] of lines.entries()) {
  JSON.parse(line);
}
console.log(`Verified ${lines.length} JSON log lines.`);
' "$LOG_FILE"

# Check for unredacted secrets or phone numbers
if grep -E -i "(authorization|x-api-key|dev-secret-key|\+?2519[0-9]{8}|[0-9]{3}[-. ]?[0-9]{3}[-. ]?[0-9]{4})" "$LOG_FILE" | grep -v "\[REDACTED\]"; then
  echo "FAIL: Found unredacted sensitive data in $LOG_FILE"
  exit 1
fi

echo "PASS: No unredacted secrets or phone numbers found."