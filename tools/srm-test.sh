#!/bin/bash
cd "$(dirname "$0")"
exec >> yukle.log 2>&1
ICERDE=1 bash ./yukle-guvenli.sh
bas=$(date +%s)
while [ $(( $(date +%s) - bas )) -lt 14400 ]; do
  o=$(node ext-eval.js @srm-hazir.js 2>&1)
  echo "$(date +%H:%M:%S) SRM $o" > srm-durum.txt
  case "$o" in
    HAZIR) echo "$(date +%H:%M:%S) SRM TEST FORCE"; node ext-eval.js @srm-force.js; exit 0;;
    "ZATEN BAKIMDA"|"hedef yok") echo "$(date +%H:%M:%S) SRM $o"; exit 0;;
  esac
  sleep 60
done
echo "SRM zaman asimi"
