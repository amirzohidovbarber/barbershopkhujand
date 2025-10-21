
Barber PRESTIGE V2 - README
---------------------------
Что включено:
- index.html, css/, js/, booking/ (frontend-only)
- PWA manifest + service worker stub (sw/)
- install/install.sh - простой скрипт для копирования файлов на сервер
- booking sends messages to Telegram via Bot API (see below)

Как настроить Telegram уведомления:
1) Создай бота у @BotFather и получи BOT_TOKEN (пример: 123456:ABC-DEF...).
2) Получи CHAT_ID — можно отправить сообщение боту и запросить обновления с getUpdates, или узнать id группы/чата.
3) В файле js/booking.js замени значения BOT_TOKEN и CHAT_ID на свои.
   const BOT_TOKEN = '123456:ABC-DEF...';
   const CHAT_ID = '123456789';

Как запустить локально:
- Просто открой index.html в браузере (некоторые PWA и service worker функции требуют HTTPS).
- Для корректной работы service worker и установки PWA — помести проект на статический хост (например, GitHub Pages, Netlify) или локальный сервер (python -m http.server).

Установка на сервер (пример):
scp -r BarberPRESTIGE_V2 user@server:/var/www/
или запусти install/install.sh (при доступе к серверу).

Примечание:
- Booking по Telegram работает через fetch к API Telegram. Браузеры могут блокировать CORS при вызове к api.telegram.org из file:// — запусти через http(s).
- Если отправка в Telegram не удалась, запись сохраняется в localStorage как резерв.
