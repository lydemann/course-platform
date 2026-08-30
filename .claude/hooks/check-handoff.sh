#!/usr/bin/env bash
# Non-blocking Stop hook. Warns when .ai/HANDOFF.md is older than the most
# recently changed file in the working tree, i.e. work happened that the
# handoff does not describe. See the Continuous AI Handoff section of AGENTS.md.
#
# Never blocks: always exits 0. Emits JSON with a systemMessage when stale.
set -uo pipefail

root=$(git rev-parse --show-toplevel 2>/dev/null) || exit 0
cd "$root" || exit 0

handoff=".ai/HANDOFF.md"

# Collect changed paths. -z avoids git's quoting of unusual filenames; the
# 3-character status prefix is stripped with ${line:3}.
changed=()
while IFS= read -r -d '' line; do
  f="${line:3}"
  [ -n "$f" ] || continue
  [ "$f" = "$handoff" ] && continue
  [ -f "$f" ] || continue
  changed+=("$f")
done < <(git status --porcelain -uall -z 2>/dev/null)

[ "${#changed[@]}" -eq 0 ] && exit 0

mtime() { stat -f %m "$1" 2>/dev/null || stat -c %Y "$1" 2>/dev/null; }

emit() {
  # Escape backslashes then quotes so the message is valid JSON.
  local m="$1"
  m="${m//\\/\\\\}"
  m="${m//\"/\\\"}"
  printf '{"systemMessage":"%s"}\n' "$m"
  exit 0
}

if [ ! -f "$handoff" ]; then
  emit "AGENTS.md requires .ai/HANDOFF.md and it does not exist, but ${#changed[@]} file(s) have changed. Create it before handing off."
fi

handoff_m=$(mtime "$handoff") || exit 0

newest=0
newest_file=""
for f in "${changed[@]}"; do
  m=$(mtime "$f") || continue
  if [ "$m" -gt "$newest" ]; then
    newest="$m"
    newest_file="$f"
  fi
done

if [ "$newest" -gt "$handoff_m" ]; then
  emit "Handoff may be stale: ${#changed[@]} changed file(s); '${newest_file}' was modified after .ai/HANDOFF.md was last written. AGENTS.md asks for the handoff to be updated before handing off."
fi

exit 0
