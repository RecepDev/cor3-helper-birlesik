#!/bin/bash
set -e
cd "$(dirname "$0")/.."
s=$(node -p "require('./package.json').version")
notlar="${1:-}"
rm -rf td-kaynak && cp -r ../cor3-td-bot/eklenti td-kaynak && rm -f td-kaynak/*.rar
npm run build >/dev/null
node -e "require('fs').writeFileSync('surum.json', JSON.stringify({surum: process.argv[1], notlar: process.argv[2]}, null, 2) + '\n')" "$s" "$notlar"
rm -f cor3-helper-birlesik.zip
(cd dist && powershell -NoProfile -Command "Compress-Archive -Path * -DestinationPath ../cor3-helper-birlesik.zip -Force")
git add -A
git commit -m "Release $s" -m "$notlar" || true
git push recep HEAD:main
gh release create "v$s" cor3-helper-birlesik.zip -R RecepDev/cor3-helper-birlesik -t "$s" -n "$notlar"
echo "YAYINLANDI $s"
