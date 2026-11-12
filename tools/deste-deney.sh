#!/bin/bash
cd "$(dirname "$0")"
LOG=deste-deney.log
DESTELER=("universal gatling sniper acid splash" "universal sniper puddle acid splash" "freeze gatling sniper acid splash")
N=${1:-10}
yaz() { node ext-eval.js "chrome.storage.local.get('ayar').then(r=>chrome.storage.local.set({ayar:Object.assign({},r.ayar,$1),ayarYazan:{kim:'deste-deney',t:Date.now()}})).then(()=>'ok')"; }
say() { node ext-eval.js "new Promise(r=>chrome.storage.local.get('maclar',a=>{const m=(a.maclar||[]).filter(x=>!x.gecersiz&&Date.parse(x.tarih)>=$1);const f=d=>{const z=m.filter(x=>(x.deste||[]).slice().sort().join(' ')===d.split(' ').sort().join(' '));const h=z.filter(x=>!x.rakipBot);return z.length+' '+z.filter(x=>x.sonuc==='galibiyet').length+' '+h.length+' '+h.filter(x=>x.sonuc==='galibiyet').length};r(f('$2'))}))"; }
bas=${BAS:-$(node -e "console.log(Date.now())")}
echo "$(date +%H:%M:%S) basla N=$N bas=$bas" >> $LOG
for i in "${!DESTELER[@]}"; do
  d="${DESTELER[$i]}"
  s=$(say $bas "$d"); read n g _ _ <<< "$s"
  [ "${n:-0}" -ge "$N" ] && continue
  yaz "{sabitDeste:'$d',acik:true,otomatik:true,sonrakindeDur:false}" >> $LOG
  echo "$(date +%H:%M:%S) deste: $d" >> $LOG
  while true; do
    sleep 60
    ozet=""; for e in "${DESTELER[@]}"; do r=$(say $bas "$e"); read n g hn hg <<< "$r"; ozet="$ozet | $e: $n mac ${g}G (insan $hn/${hg}G)"; done
    echo "$(date +%H:%M:%S) simdi: $d$ozet" > deste-deney-durum.txt
    s=$(say $bas "$d"); read n g _ _ <<< "$s"
    [ "${n:-0}" -ge "$N" ] && { echo "$(date +%H:%M:%S) bitti $d: $s" >> $LOG; break; }
  done
done
en=""; eg=-1; for e in "${DESTELER[@]}"; do r=$(say $bas "$e"); read n g _ _ <<< "$r"; [ "${g:-0}" -gt "$eg" ] && { eg=${g:-0}; en="$e"; }; done
yaz "{sabitDeste:'$en'}" >> $LOG
echo "$(date +%H:%M:%S) secilen: $en ($eg galibiyet)" >> $LOG
