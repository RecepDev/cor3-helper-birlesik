#!/bin/bash
set -e
cd "$(dirname "$0")/.."
s=$(node -p "require('./package.json').version")
notlar="${1:-}"
TD_KAYNAK="$(pwd -W)/td-kaynak" npm run build >/dev/null
node -e "require('fs').writeFileSync('surum.json', JSON.stringify({surum: process.argv[1], notlar: process.argv[2]}, null, 2) + '\n')" "$s" "$notlar"
rm -f cor3-helper-birlesik.zip
(cd dist && powershell -NoProfile -Command "Compress-Archive -Path * -DestinationPath ../cor3-helper-birlesik.zip -Force")
git add -A
git commit -m "Release $s" -m "$notlar" || true
git push recep HEAD:main
gh release create "v$s" cor3-helper-birlesik.zip -R RecepDev/cor3-helper-birlesik -t "$s" -n "$notlar"
npm run build >/dev/null
echo "YAYINLANDI $s"
