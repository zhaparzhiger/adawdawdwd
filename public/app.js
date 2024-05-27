const socket = io();

const messagesContainer = document.getElementById('messages');
const messageInput = document.getElementById('message-input');
const sendButton = document.getElementById('send-button');

const addMessage = (message) => {
    const messageElement = document.createElement('div');
    messageElement.textContent = `${message.username}: ${message.text}`;
    messagesContainer.appendChild(messageElement);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
};

socket.on('previousMessages', (messages) => {
    messages.forEach(addMessage);
});

socket.on('newMessage', addMessage);

const sendMessage = () => {
    const message = messageInput.value;
    if (message) {
        socket.emit('sendMessage', message);
        messageInput.value = '';
    }
};

sendButton.addEventListener('click', sendMessage);
messageInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
        sendMessage();
    }
});
