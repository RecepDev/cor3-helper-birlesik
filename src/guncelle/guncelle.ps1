param([string]$Klasor, [string]$ID)
$ErrorActionPreference = 'Stop'
if (-not $Klasor -and $ID) {
    Write-Host 'Eklenti klasoru araniyor...'
    $sha = [Security.Cryptography.SHA256]::Create()
    $kokler = @([Environment]::GetFolderPath('Desktop'), (Join-Path $env:USERPROFILE 'Downloads'), [Environment]::GetFolderPath('MyDocuments'), $env:USERPROFILE) + @(Get-PSDrive -PSProvider FileSystem | Where-Object { $_.Root -ne 'C:\' } | ForEach-Object { $_.Root })
    foreach ($k in $kokler) {
        if ($Klasor -or -not (Test-Path $k)) { continue }
        foreach ($m in (Get-ChildItem $k -Filter manifest.json -Recurse -Depth 3 -File -ErrorAction SilentlyContinue | Where-Object { $_.FullName -notmatch '\\(AppData|node_modules)\\' })) {
            $h = $sha.ComputeHash([Text.Encoding]::Unicode.GetBytes($m.DirectoryName))
            if ((-join ($h[0..15] | ForEach-Object { [char](97 + ($_ -shr 4)) + [char](97 + ($_ -band 15)) })) -eq $ID) { $Klasor = $m.DirectoryName; break }
        }
    }
    if (-not $Klasor) { Write-Host 'Eklenti klasoru bulunamadi.' -ForegroundColor Red; Start-Sleep 10; exit }
}
$Klasor = $Klasor.TrimEnd('\', '.')
Write-Host "Eklenti klasoru: $Klasor"
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
    robocopy $kaynak $Klasor /E /XF manifest.json /NFL /NDL /NJH /NJS /NP | Out-Null
    if ($LASTEXITCODE -ge 8) { throw "dosyalar kopyalanamadi (robocopy $LASTEXITCODE)" }
    Copy-Item "$kaynak\manifest.json" "$Klasor\manifest.json" -Force
    Write-Host "Guncellendi: $eski -> $yeni" -ForegroundColor Green
    Write-Host 'Eklenti birkac saniye icinde kendini yeniden yukler.'
} catch {
    Write-Host ('HATA: ' + $_.Exception.Message) -ForegroundColor Red
} finally {
    Remove-Item $gecici -Recurse -Force -ErrorAction SilentlyContinue
}
Start-Sleep 4
