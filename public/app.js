const socket = io();

const messagesContainer = document.getElementById('messages');
const messageInput = document.getElementById('message-input');
const sendButton = document.getElementById('send-button');

let username;

// Функция добавления сообщения
const addMessage = (message) => {
    const messageElement = document.createElement('div');
    messageElement.textContent = `${message.username}: ${message.text}`;
    messageElement.classList.add('message');
    if (message.username === username) {
        messageElement.classList.add('sent');
    } else {
        messageElement.classList.add('received');
    }
    messagesContainer.appendChild(messageElement);
    // Прокрутка вниз после добавления сообщения
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
};

// Обработчики событий сокетов
socket.on('previousMessages', (messages) => {
    messages.forEach(addMessage);
});

socket.on('newMessage', addMessage);

socket.on('setUsername', (user) => {
    username = user;
});

// Отправка сообщения
const sendMessage = () => {
    const message = messageInput.value;
    if (message) {
        const msg = { username, text: message }; // Создаем объект сообщения
        socket.emit('sendMessage', message); // Отправляем сообщение на сервер
        messageInput.value = '';
    }
};

// Обработчики событий кнопок и ввода
sendButton.addEventListener('click', sendMessage);
messageInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
        sendMessage();
    }
});

// При загрузке страницы запрашиваем у сервера имя пользователя
socket.emit('getUsername');

