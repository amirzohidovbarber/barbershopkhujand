const fetch = require("node-fetch"); // если нет, установи: npm install node-fetch

const BOT_TOKEN = "8230767475:AAHgDdFFkvyjc57orLpkMySWWVFYu5F40oQ";
const CHAT_ID = "5965188999"; // ID пользователя
const MESSAGE = "Привет! Это автоматическое сообщение от бота.";

const url = `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage?chat_id=${CHAT_ID}&text=${encodeURIComponent(MESSAGE)}`;

fetch(url)
    .then(res => res.json())
    .then(data => console.log(data))
    .catch(err => console.error(err));
