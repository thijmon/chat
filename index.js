const app = require('express')();
const server = require('http').Server(app);
const io = require('socket.io')(server);
const port = process.env.PORT || 3000;
const fs = require("fs");
const db = require('./queries');

server.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/username.html');
});

app.get('/rooms', (req, res) => {
    res.sendFile(__dirname + '/public/index.html');
});

app.get('/javascript', (req, res) => {
    res.sendFile(__dirname + '/public/javascript.html');
});

app.get('/swift', (req, res) => {
    res.sendFile(__dirname + '/public/swift.html');
});

app.get('/css', (req, res) => {
    res.sendFile(__dirname + '/public/css.html');
});

// tech namespace
const tech = io.of('/tech');

const readFile = () => {

    fs.readFile('messages.json', 'utf8', (err, d) => {
        if (err) return console.log('error')
        const data = JSON.parse(d)
        console.log(data)

    })

}


tech.on('connection', (socket) => {
    socket.on('join', (data) => {
        socket.join(data.room);
        tech.in(data.room).emit('message', `New user joined ${data.room} room!`)
    })


    socket.on('message', (data) => {
        console.log(`message: ${data.msg}`);
        const json = [{ msg: data.msg }]
        fs.writeFileSync('messages.json', JSON.stringify(json), 'utf8', err => {
            if (err) return console.log(err)
            console.log(`${data.msg} > messages.json`)
            tech.in(data.room).emit('message', data.msg);

        })
    });

    socket.on('disconnect', () => {
        console.log('user disconnected');

        io.emit('message', 'user disconnected');
    })
})
