const app = require('express')();
const http = require('http').createServer(app);
var io = require('socket.io')(http, { origins: '*:*'});

const SOCKET_PORT = process.env.PORT || 3001;
let connectedUsersCount = 0;

io.on('connection', (socket) => {
  if (connectedUsersCount > 2) {
    return
  }

  console.log('one of the users');
  connectedUsersCount += 1

  if (connectedUsersCount === 1) {
    socket.emit("setPlayerTwo")
  }


  function calculateInitialNumber() {
    let createRandomNumber = parseInt(Math.random() * 100, 10)
    if(createRandomNumber < 2)
      this.calculateInitialNumber()
    else 
      return createRandomNumber
  };

  if (connectedUsersCount === 2) {
    console.log(connectedUsersCount)
    socket.emit("setPlayerOne")

    io.emit("action", {
      isGameStart: true,
      turnArray: [
        {
          id: 0,
          player: "playerOne",
          value: calculateInitialNumber()
        },
      ],
      turnCount: 0
    })
  }

  socket.on("action", (action) => {
    io.emit("action", action)
  })

  socket.on('disconnect', () => {
    connectedUsersCount -= 1
    console.log('user disconnected');
  });
});

http.listen(SOCKET_PORT, () => {
  console.log('listening on 0.0.0.0:' + SOCKET_PORT);
});