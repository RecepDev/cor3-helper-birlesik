param([string]$Klasor)
$ErrorActionPreference = 'Stop'
$Klasor = $Klasor.TrimEnd('\', '.')
$url = 'https://github.com/RecepDev/cor3-helper-birlesik/releases/latest/download/cor3-helper-birlesik.zip'
$gecici = Join-Path $env:TEMP ('cor3-guncel-' + [guid]::NewGuid())
New-Item -ItemType Directory $gecici | Out-Null
try {
    if (-not (Test-Path (Join-Path $Klasor 'manifest.json'))) { throw "hedef klasor eklenti degil: $Klasor" }
    Write-Host 'Yeni surum indiriliyor...'
    [Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12
    Invoke-WebRequest $url -OutFile "$gecici\p.zip" -UseBasicParsing
    Expand-Archive "$gecici\p.zip" "$gecici\a" -Force
    $kaynak = "$gecici\a"
    if (-not (Test-Path "$kaynak\manifest.json")) { $alt = Get-ChildItem $kaynak -Directory | Select-Object -First 1; if ($alt) { $kaynak = $alt.FullName } }
    if (-not (Test-Path "$kaynak\manifest.json")) { throw 'zip icinde manifest.json yok' }
    $yeni = (Get-Content "$kaynak\manifest.json" -Raw | ConvertFrom-Json).version
    $eski = (Get-Content "$Klasor\manifest.json" -Raw | ConvertFrom-Json).version
    robocopy $kaynak $Klasor /E /NFL /NDL /NJH /NJS /NP | Out-Null
    if ($LASTEXITCODE -ge 8) { throw "dosyalar kopyalanamadi (robocopy $LASTEXITCODE)" }
    Write-Host "Guncellendi: $eski -> $yeni" -ForegroundColor Green
    Write-Host 'Eklenti mac arasinda kendini yeniden yukler, bir sey yapmana gerek yok.'
} catch {
    Write-Host ('HATA: ' + $_.Exception.Message) -ForegroundColor Red
} finally {
    Remove-Item $gecici -Recurse -Force -ErrorAction SilentlyContinue
}
Start-Sleep 8
