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
Write-Host "Готово. Проверьте diff и сделайте commit в demo-репозитории."
