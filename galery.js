
    const uploadBtn = document.getElementById('uploadBtn');
    const fileInput = document.getElementById('fileInput');
    const gallery = document.querySelector('.gallery');

    // Lightbox
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.querySelector('.lightbox-img');
    const closeLightbox = document.getElementById('closeLightbox');

    // Функция для добавления картинки с кнопкой удаления
    function addImage(src, id) {
        const item = document.createElement('div');
    item.className = 'gallery-item';
    item.dataset.id = id;

    const img = document.createElement('img');
    img.src = src;

    const delBtn = document.createElement('button');
    delBtn.className = 'delete-btn';
    delBtn.textContent = '🗑️';
        delBtn.addEventListener('click', () => {
        gallery.removeChild(item);
    let images = JSON.parse(localStorage.getItem('galleryImages') || '[]');
            images = images.filter(i => i.id !== id);
    localStorage.setItem('galleryImages', JSON.stringify(images));
        });

    item.appendChild(img);
    item.appendChild(delBtn);
    gallery.prepend(item);
    }

    // Загружаем сохранённые картинки при загрузке страницы
    window.addEventListener('load', () => {
        const images = JSON.parse(localStorage.getItem('galleryImages') || '[]');
        images.forEach(i => addImage(i.src, i.id));
    });

    // Опубликовать
    uploadBtn.addEventListener('click', () => fileInput.click());

    // Выбор файла
    fileInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function (event) {
            const id = Date.now();
    addImage(event.target.result, id);

    // Сохраняем в LocalStorage
    const images = JSON.parse(localStorage.getItem('galleryImages') || '[]');
    images.unshift({id, src: event.target.result });
    localStorage.setItem('galleryImages', JSON.stringify(images));
        };
    reader.readAsDataURL(file);
    });

    // Lightbox открытие картинки при клике
    gallery.addEventListener('click', (e) => {
        if (e.target.tagName === 'IMG') {
        lightbox.style.display = 'flex';
    lightboxImg.src = e.target.src;
        }
    });

    // Закрываем окно
    closeLightbox.addEventListener('click', () => {
        lightbox.style.display = 'none';
    });

    // Закрытие при клике вне картинки
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) {
        lightbox.style.display = 'none';
        }
    });
