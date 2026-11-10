#!/bin/bash
cd "$(dirname "$0")"
[ -z "$ICERDE" ] && exec >> yukle.log 2>&1
bas=$(date +%s)
while [ $(( $(date +%s) - bas )) -lt 5400 ]; do
  o=$(node ext-eval.js @guvenli.js 2>&1)
  if [ "$o" = "GUVENLI" ]; then
    cp -r /d/Botlar/cor3-birlesik/dist/. "/c/Users/recep/Desktop/cor3-helper-v1.7.0/"
    node sayfa-cdp.js "opera://extensions" "new Promise(r=>chrome.developerPrivate.reload('jneipojbkfmfaegplhnahnlankihalpc',{failQuietly:false},()=>r('yenilendi')))" "opera://extensions"
    curl -s http://127.0.0.1:9241/json/list | python -I -c "
import sys,json,urllib.request
for t in json.load(sys.stdin):
  if t['type']=='page' and t['url'].startswith('opera://extensions'): urllib.request.urlopen('http://127.0.0.1:9241/json/close/'+t['id'])"
    sleep 2
    node sayfa-cdp.js "https://cor3.gg" "setTimeout(()=>location.reload(),100),'ok'"
    echo "$(date +%H:%M:%S) YUKLENDI"
    sleep 30
    node ext-eval.js "chrome.storage.local.get('ayar').then(r=>chrome.storage.local.set({ayar:Object.assign({},r.ayar,{otomatik:true}),ayarYazan:{kim:'yükleme betiği',t:Date.now()}})).then(()=>'otomatik acildi')"
    if [ "$1" = "testforce" ]; then sleep 15; echo "$(date +%H:%M:%S) TEST FORCE"; node ext-eval.js @test-force.js; fi
    exit 0
  fi
  echo "$(date +%H:%M:%S) $o" > yukle-durum.txt
  sleep 10
done
echo "ZAMAN ASIMI"
