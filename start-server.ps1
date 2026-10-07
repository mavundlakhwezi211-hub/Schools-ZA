# Starts the UrSKOOL PHP development server.
#
#   powershell -ExecutionPolicy Bypass -File .\start-server.ps1
#   powershell -ExecutionPolicy Bypass -File .\start-server.ps1 -Open
#
# The site MUST be served by PHP (not by VS Code Live Server or a plain static
# server), because api/*.php has to execute to reach the database.
[CmdletBinding()]
param(
    [int]$Port = 8000,
    [switch]$Open
)

$ErrorActionPreference = 'Stop'
$root = Split-Path -Parent $MyInvocation.MyCommand.Path

function Resolve-Php {
    $candidates = @(
        (Join-Path $env:LOCALAPPDATA 'urskool-runtime\php-8.3\php.exe'),
        'C:\xampp\php\php.exe',
        'C:\wamp64\bin\php\*\php.exe',
        'C:\laragon\bin\php\*\php.exe'
    )
    foreach ($candidate in $candidates) {
        $found = Get-Item $candidate -ErrorAction SilentlyContinue | Select-Object -First 1
        if ($found -and $found.PSIsContainer -eq $false) { return $found.FullName }
    }
    $onPath = Get-Command php -ErrorAction SilentlyContinue
    if ($onPath) { return $onPath.Source }
    throw 'PHP was not found. Install PHP, or edit Resolve-Php in start-server.ps1.'
}

$php = Resolve-Php
Write-Host "PHP      : $php"
Write-Host "Serving  : $root"
Write-Host "Open     : http://127.0.0.1:$Port/create-profile.html"
Write-Host 'Stop with Ctrl+C.'
Write-Host ''

if ($Open) {
    Start-Process "http://127.0.0.1:$Port/create-profile.html" | Out-Null
}

& $php -S "127.0.0.1:$Port" -t $root
