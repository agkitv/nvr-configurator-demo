# Копирует в demo только файлы макета (без .cursor и правил)
$main = "D:\Projects\github\nvr-configurator"
$here = $PSScriptRoot
if (-not (Test-Path "$main\index.html")) {
  Write-Error "Не найден основной проект: $main"
  exit 1
}
Copy-Item "$main\index.html" "$here\index.html" -Force
if (Test-Path "$here\assets") { Remove-Item "$here\assets" -Recurse -Force }
Copy-Item "$main\assets" "$here\assets" -Recurse -Force
$tzSrc = "$main\docs\tz"
$tzDst = "$here\tz"
if (Test-Path $tzSrc) {
  if (Test-Path $tzDst) { Remove-Item $tzDst -Recurse -Force }
  Copy-Item $tzSrc $tzDst -Recurse -Force
  Get-ChildItem $tzDst -Recurse -Directory -Filter node_modules -ErrorAction SilentlyContinue | Remove-Item -Recurse -Force
  Write-Host "Copied docs/tz -> tz/ (node_modules excluded)"
} else {
  Write-Warning "TZ not found: $tzSrc (skip)"
}
Write-Host "Done. Check git diff in demo repo, then commit and push if needed."
