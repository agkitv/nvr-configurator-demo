# nvr-configurator-demo

Публичный **показ** макета веб-конфигуратора. Основная разработка — в репозитории `nvr-configurator` (private).

## Обновить демо из основного проекта

1. Скопировать из `D:\Projects\github\nvr-configurator`:
   - `index.html`
   - папку `assets\`
2. В этой папке: Commit → Push.

Или в PowerShell из корня demo:

```powershell
$main = "D:\Projects\github\nvr-configurator"
Copy-Item "$main\index.html" . -Force
Copy-Item "$main\assets" .\assets -Recurse -Force
```

## GitHub Pages

**Включить показ:** GitHub → Settings → Pages → Branch `main`, folder `/ (root)`.

Ссылка: `https://agkitv.github.io/nvr-configurator-demo/`

**Выключить показ:** Settings → Pages → Source: **None** (или удалить деплой на Vercel, если используете его).

## Доступ к коду

- **Private** репозиторий: код видят только приглашённые collaborators.
- Сайт по ссылке Pages при **public** репо или публичном Pages — доступен всем, у кого есть URL (это не пароль).
