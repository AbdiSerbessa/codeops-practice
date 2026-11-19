#!/usr/bin/env bash
set -euo pipefail

BASE_URL="${1:-http://localhost:3000/api/v1}"
DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
BAD_DIR="$DIR/bad-requests"

check_five_fields_and_no_stack() {
  local body="$1"
  node -e '
    const raw = process.argv[1];
    const parsed = JSON.parse(raw);
    const keys = Object.keys(parsed).sort();
    const expected = ["code", "message", "path", "requestId", "timestamp"].sort();
    if (JSON.stringify(keys) !== JSON.stringify(expected)) {
      console.error("FAIL: Expected keys", expected, "got", keys);
      process.exit(1);
    }
    if (/at\s+[\w.<>]+\s+\(/.test(raw) || /Error:\s+/.test(parsed.message)) {
      console.error("FAIL: Stack trace leak detected in body:", raw);
      process.exit(1);
    }
    console.log("  message:", parsed.message, "| path:", parsed.path, "| requestId:", parsed.requestId);
  ' "$body"
}

for file in "$BAD_DIR"/*.json; do
  name="$(basename "$file")"
  if [[ "$name" == "12-invalid-status-transition.json" ]]; then
    url="$BASE_URL/orders/1/status"
    method="PATCH"
  else
    url="$BASE_URL/orders"
    method="POST"
  fi

  tmp_body="$(mktemp)"
  status="$(curl -s -o "$tmp_body" -w "%{http_code}" -X "$method" "$url" \
    -H "Content-Type: application/json" \
    --data-binary @"$file")"
  body="$(cat "$tmp_body")"
  rm -f "$tmp_body"

  echo "$name -> $status"
  check_five_fields_and_no_stack "$body"
done

echo "--- Forced TypeError check (/orders/debug/boom) ---"
boom_body="$(mktemp)"
boom_status="$(curl -s -o "$boom_body" -w "%{http_code}" "$BASE_URL/orders/debug/boom")"
boom_raw="$(cat "$boom_body")"
rm -f "$boom_body"
echo "debug/boom -> $boom_status"
if [[ "$boom_status" != "500" ]]; then
  echo "FAIL: Expected 500 for forced TypeError, got $boom_status"
  exit 1
fi
check_five_fields_and_no_stack "$boom_raw"