// assets/js/updater.js

const CHECK_INTERVAL = 30000; // Проверять каждые 30 секунд
let isNotificationShown = false;

async function checkVersion() {
    try {
        // Добавляем случайное число (?t=...), чтобы браузер не читал старый файл из памяти
        const response = await fetch('version.json?t=' + new Date().getTime());
        if (!response.ok) return;

        const data = await response.json();
        const serverVersion = data.version;
        const localVersion = localStorage.getItem('site_version');

        // Если игрок зашел первый раз — просто запоминаем версию
        if (!localVersion) {
            localStorage.setItem('site_version', serverVersion);
            return;
        }

        // Если версии не совпадают и уведомление еще не показано
        if (serverVersion !== localVersion && !isNotificationShown) {
            showUpdateUI(serverVersion);
        }

    } catch (err) {
        console.log('Update check failed (offline?)', err);
    }
}

function showUpdateUI(newVersion) {
    isNotificationShown = true;

    // Создаем элемент уведомления
    const div = document.createElement('div');
    div.className = 'update-notification';
    div.innerHTML = `
        <div class="update-text">
            <strong>⚡ ОБНОВЛЕНИЕ</strong>
            <span>Доступна новая версия сайта</span>
        </div>
        <button onclick="applyUpdate('${newVersion}')">ОБНОВИТЬ ↻</button>
    `;

    document.body.appendChild(div);
    
    // Звук (если есть)
    const audio = new Audio('assets/audio/notification.mp3'); // Можно убрать, если звука нет
    audio.volume = 0.3;
    audio.play().catch(()=>{});
}

function applyUpdate(newVersion) {
    // Сохраняем новую версию
    localStorage.setItem('site_version', newVersion);
    
    // Принудительная перезагрузка страницы без кеша
    location.reload();
}

// Запуск
document.addEventListener('DOMContentLoaded', () => {
    // Первая проверка через 1 секунду после загрузки
    setTimeout(checkVersion, 1000);
    // И потом каждые 30 сек
    setInterval(checkVersion, CHECK_INTERVAL);
});