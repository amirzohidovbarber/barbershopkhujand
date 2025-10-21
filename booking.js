// js/booking.js

const BOT_TOKEN = 'REPLACE_WITH_YOUR_BOT_TOKEN';
const CHAT_ID = 'REPLACE_WITH_YOUR_CHAT_ID';

// --- Авто-установка текущего года ---
document.getElementById('year').textContent = new Date().getFullYear();

// --- Очистка устаревших записей ---
function cleanExpiredBookings() {
  let queue = JSON.parse(localStorage.getItem('bookingQueue') || '[]');
  const now = Date.now();
  queue = queue.filter(b => b.expire && b.expire > now);
  localStorage.setItem('bookingQueue', JSON.stringify(queue));
}
cleanExpiredBookings();

// --- Сериализация формы ---
function serializeBooking(form) {
  const tomorrow = new Date();
  tomorrow.setHours(24, 0, 0, 0); // 00:00 следующего дня
  return {
    name: form.name.value.trim(),
    phone: form.phone.value.trim(),
    date: form.date.value,
    time: form.time.value,
    master: form.master.value,
    service: Array.from(form.service.selectedOptions).map(opt => opt.value),
    created: new Date().toISOString(),
    expire: tomorrow.getTime()
  };
}

// --- Отправка в Telegram ---
async function sendToTelegram(message) {
  const BOT_TOKEN = "8230767475:AAHgDdFFkvyjc57orLpkMySWWVFYu5F40oQ"; // твой бот
  const CHAT_ID = "5965188999"; // ID пользователя, которому отправлять

  const url = `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`;
  const body = {
    chat_id: CHAT_ID,
    parse_mode: 'HTML',
    text: message
  };
  const res = await fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
  return res.ok;
}

// --- Форматирование сообщения ---
function formatMessage(data, queueNumber) {
  const created = new Date(data.created).toLocaleString('ru-RU', {
    timeZone: 'Asia/Dushanbe'
  });

  return `<b>Новая запись — Barber PRESTIGE</b>%0A` +
    `Имя: ${data.name}%0A` +

    `Телефон: ${data.phone}%0A` +
    `Дата: ${data.date} ${data.time}%0A` +
    `Мастер: ${data.master}%0A` +
    `Услуга: ${Array.isArray(data.service) ? data.service.join(', ') : data.service}%0A` +
    `Номер в очереди: ${queueNumber}%0A` +
    `Время: ${created}`;
}

let queue = Promise.resolve(); // очередь для отправки сообщений

function sendToTelegram(message) {
  const BOT_TOKEN = '8230767475:AAHgDdFFkvyjc57orLpkMySWWVFYu5F40oQ';
  const CHAT_ID = '5965188999';
  const url = `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage?chat_id=${CHAT_ID}&parse_mode=HTML&text=${message}`;

  // Добавляем задачу в очередь
  queue = queue.then(async () => {
    try {
      const response = await fetch(url);
      if (!response.ok) {
        console.error('Ошибка при отправке:', await response.text());
      } else {
        console.log('✅ Сообщение отправлено по порядку');
      }
      // Небольшая задержка между сообщениями (чтобы Telegram точно не запутался)
      await new Promise(res => setTimeout(res, 500));
    } catch (err) {
      console.error('⚠️ Ошибка соединения:', err);
    }
  });
}



// --- Отправка формы ---
document.getElementById('bookingForm').addEventListener('submit', async function (e) {
  e.preventDefault();
  const form = e.target;

  // --- Проверка имени ---
  const nameValue = form.name.value.trim();
  if (!/^[a-zA-Zа-яА-ЯёЁ\s]+$/.test(nameValue)) {
    alert('Имя может содержать только буквы.');
    return;
  }

  // --- Проверка телефона ---
  let phoneValue = form.phone.value.replace(/\D/g, '');
  if (!phoneValue.startsWith('992') || phoneValue.length !== 12) {
    alert('Введите корректный номер телефона. Формат: +992901234567');
    return;
  }
  form.phone.value = '+992' + phoneValue.slice(3);

  // --- Проверка времени ---
  const timeValue = form.time.value;
  if (!/^([01]\d|2[0-3]):([0-5]\d)$/.test(timeValue)) {
    alert('Введите корректное время в формате ЧЧ:ММ');
    return;
  }

  // --- Очистка устаревших записей ---
  cleanExpiredBookings();

  // --- Сохранение записи ---
  const data = serializeBooking(form);
  const queue = JSON.parse(localStorage.getItem('bookingQueue') || '[]');
  queue.push(data);
  localStorage.setItem('bookingQueue', JSON.stringify(queue));
  const queueNumber = queue.length;

  // --- Отправка в Telegram ---
  const message = formatMessage(data, queueNumber);
  let sent = false;
  try {
    sent = await sendToTelegram(message);
  } catch (err) {
    console.warn('Telegram send failed:', err);
  }

  if (sent) {
    alert('Запись отправлена в Telegram. Номер в очереди: ' + queueNumber);
  } else {
    alert('Запись сохранена локально. Номер в очереди: ' + queueNumber + '. ');
  }

  form.reset();
  const today = new Date().toISOString().split('T')[0];
  form.date.value = today;
});

// --- Просмотр очереди ---
document.getElementById('viewQueue').addEventListener('click', function () {
  cleanExpiredBookings();
  const queue = JSON.parse(localStorage.getItem('bookingQueue') || '[]');
  const panel = document.getElementById('queuePanel');
  if (queue.length === 0) {
    panel.textContent = 'Очередь пуста.';
    return;
  }
  panel.innerHTML = '<strong>Текущая очередь:</strong><ol>' +
    queue.map(q => `<li>${q.date} ${q.time} — ${q.name} (${Array.isArray(q.service) ? q.service.join(', ') : q.service})</li>`).join('') +
    '</ol>';
});

// --- Авто-установка даты ---
const dateInput = document.querySelector('input[name="date"]');
const today = new Date().toISOString().split('T')[0];
dateInput.value = today;
dateInput.setAttribute('min', today);

// --- Имя: только буквы ---
document.querySelector('input[name="name"]').addEventListener('input', function () {
  this.value = this.value.replace(/[^a-zA-Zа-яА-ЯёЁ\s]/g, '');
});

// --- Телефон: только цифры и + ---
const phoneInput = document.getElementById('phone');
phoneInput.addEventListener('focus', function () {
  if (!this.value.startsWith('+992')) this.value = '+992 ';
});
phoneInput.addEventListener('input', function () {
  if (!this.value.startsWith('+992')) this.value = '+992 ';
  let rest = this.value.slice(5).replace(/[^0-9\s]/g, '');
  let digitsOnly = rest.replace(/\s/g, '').slice(0, 9);
  let formatted = '';
  for (let i = 0; i < digitsOnly.length; i++) {
    if (i === 2 || i === 5) formatted += ' ';
    formatted += digitsOnly[i];
  }
  this.value = '+992 ' + formatted;
});

// --- Экспорт для тестов ---
window.__BarberPrestige = {
  getQueue: () => JSON.parse(localStorage.getItem('bookingQueue') || '[]'),
  clearQueue: () => localStorage.removeItem('bookingQueue')
};
