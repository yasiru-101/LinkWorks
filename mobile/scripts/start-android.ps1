param(
  [string]$Avd = 'LinkWorks_Dev',
  [string]$Sdk = 'D:\Android\Sdk',
  [int]$Port = 8081
)

$ErrorActionPreference = 'Stop'
$projectDirectory = Split-Path $PSScriptRoot -Parent
$adb = Join-Path $Sdk 'platform-tools\adb.exe'
$emulator = Join-Path $Sdk 'emulator\emulator.exe'
$logDirectory = Join-Path $projectDirectory '.expo'
foreach ($executable in @($adb, $emulator)) {
  if (!(Test-Path $executable)) { throw "Android SDK executable missing: $executable. Pass -Sdk with your SDK location." }
}
New-Item -ItemType Directory -Path $logDirectory -Force | Out-Null

function Find-Device {
  foreach ($line in (& $adb devices)) {
    if ($line -match '^(emulator-\d+)\s+device\b') {
      $candidate = $Matches[1]
      $name = @(& $adb -s $candidate emu avd name 2>$null)[0]
      if ($name -eq $Avd) { return $candidate }
    }
  }
  return $null
}

function Test-Metro {
  try {
    $response = Invoke-WebRequest -Uri "http://127.0.0.1:$Port/status" -UseBasicParsing -TimeoutSec 2
    $content = $response.Content
    if ($content -is [byte[]]) { $content = [Text.Encoding]::UTF8.GetString($content) }
    return $content -match 'packager-status:running'
  } catch { return $false }
}

$device = Find-Device
if (!$device) {
  if ($Avd -notin @(& $emulator -list-avds)) { throw "Create an Android virtual device named $Avd in Android Studio first." }
  Write-Host "Cold booting $Avd with software graphics..."
  Start-Process -FilePath $emulator -ArgumentList @('-avd', $Avd, '-no-snapshot', '-gpu', 'swiftshader', '-memory', '2048', '-no-audio', '-no-boot-anim') -WindowStyle Hidden -RedirectStandardOutput (Join-Path $logDirectory 'emulator-boot.log') -RedirectStandardError (Join-Path $logDirectory 'emulator-boot-error.log') | Out-Null
}
$deadline = (Get-Date).AddMinutes(3)
do {
  $device = Find-Device
  if ($device -and ((& $adb -s $device shell getprop sys.boot_completed 2>$null) -join '').Trim() -eq '1') { break }
  if ((Get-Date) -gt $deadline) { throw "Android did not boot. Close the stalled $Avd emulator and retry. Logs: $logDirectory\emulator-boot-error.log" }
  Start-Sleep -Seconds 2
} while ($true)
Write-Host "Android is ready: $device"

$package = (& $adb -s $device shell pm path com.linkworks.linkworks) -join ''
if ($package -notmatch '^package:') { throw 'Install the LinkWorks development APK on this emulator, then run this script again.' }

if (!(Test-Metro)) {
  $listener = Get-NetTCPConnection -State Listen -LocalPort $Port -ErrorAction SilentlyContinue
  if ($listener) { throw "Port $Port has an unresponsive or different server. Close its terminal, then retry; or pass -Port 8082." }
  Write-Host 'Starting Metro on IPv4 localhost...'
  $node = (Get-Command node -ErrorAction Stop).Source
  Start-Process -FilePath $node -ArgumentList @('--dns-result-order=ipv4first', 'node_modules/expo/bin/cli', 'start', '--dev-client', '--localhost', '--port', $Port) -WorkingDirectory $projectDirectory -WindowStyle Hidden -RedirectStandardOutput (Join-Path $logDirectory 'android-metro.log') -RedirectStandardError (Join-Path $logDirectory 'android-metro-error.log') | Out-Null
  $deadline = (Get-Date).AddMinutes(2)
  while (!(Test-Metro)) {
    if ((Get-Date) -gt $deadline) { throw "Metro did not start. Check $logDirectory\android-metro-error.log" }
    Start-Sleep -Seconds 2
  }
}
& $adb -s $device reverse "tcp:$Port" "tcp:$Port"
if ($LASTEXITCODE -ne 0) { throw 'Could not forward the Metro port to Android.' }
$url = [Uri]::EscapeDataString("http://127.0.0.1:$Port")
& $adb -s $device shell am start -a android.intent.action.VIEW -d "linkworks://expo-development-client/?url=$url"
if ($LASTEXITCODE -ne 0) { throw 'Could not open LinkWorks.' }
Write-Host "LinkWorks opened. Metro: http://127.0.0.1:$Port. Development logs are in $logDirectory."
