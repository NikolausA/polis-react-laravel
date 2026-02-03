## Запуск проекта

Проект использует Laravel Sail для Docker-контейнеризации.

### Требования

- Docker Desktop
- WSL2 (для Windows)

### Установка

1. Клонировать репозиторий
2. Скопировать .env.example в .env
3. Запустить контейнеры: `./vendor/bin/sail up -d`
4. Выполнить миграции: `./vendor/bin/sail artisan migrate --seed`
