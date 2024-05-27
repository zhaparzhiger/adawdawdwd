const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const fs = require('fs');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

const PORT = process.env.PORT || 3000;
const messagesFile = 'messages.json';

// Загружаем существующие сообщения из файла или создаем новый файл, если его нет
let messages = [];
if (fs.existsSync(messagesFile)) {
    messages = JSON.parse(fs.readFileSync(messagesFile, 'utf8'));
} else {
    fs.writeFileSync(messagesFile, JSON.stringify([]));
}

// Генерация случайного имени пользователя
const generateUsername = () => {
    const words = JSON.parse(fs.readFileSync('words.json', 'utf8'));
    const word1 = words[Math.floor(Math.random() * words.length)];
    const word2 = words[Math.floor(Math.random() * words.length)];
    return `${word1}${word2}`;
};

io.on('connection', (socket) => {
    console.log('New client connected');
    
    // Отправляем последние 10 сообщений новому пользователю
    socket.emit('previousMessages', messages.slice(-10));

    const username = generateUsername();

    socket.on('sendMessage', (message) => {
        const msg = { username, text: message, timestamp: new Date() };
        messages.push(msg);

        // Сохраняем сообщения в файл
        fs.writeFileSync(messagesFile, JSON.stringify(messages));
        
        io.emit('newMessage', msg);
    });

    socket.on('disconnect', () => {
        console.log('Client disconnected');
    });
});

app.use(express.static(path.join(__dirname, 'public')));

server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
