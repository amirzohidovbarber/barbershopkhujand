const express = require('express');
const bodyParser = require('body-parser');
const fetch = require('node-fetch');
const cors = require('cors');

const app = express();
const PORT = 3000;

// Настройка CORS (доступ с твоего сайта)
app.use(cors());
app.use(bodyParser.json());

// Токен и ID бота (только на сервере!)
const BOT_TOKEN = '8230767475:AAHgDdFFkvyjc57orLpkMySWWVFYu5F40oQ';
const CHAT_ID = '8230767475';

// Роут для отправки формы
app.post('/sendBooking', async (req, res) => {
    const data = req.body;

    if (!data.name || !data.phone || !data.date || !data.time) {
        return res.status(400).json({ ok: false, error: 'Неполные данные' });
    }

    const message = `
<b>Новая запись — Barber PRESTIGE</b>
Имя: ${data.name}
Телефон: ${data.phone}
Дата: ${data.date} ${data.time}
Мастер: ${data.master}
Услуга: ${Array.isArray(data.service) ? data.service.join(', ') : data.service}
Время записи: ${new Date().toLocaleString()}
`;

    try {
        const response = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                chat_id: CHAT_ID,
                parse_mode: 'HTML',
                text: message
            })
        });

        const result = await response.json();
        if (result.ok) {
            res.json({ ok: true });
        } else {
            res.status(500).json({ ok: false, error: result.description });
        }
    } catch (err) {
        res.status(500).json({ ok: false, error: err.message });
    }
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
