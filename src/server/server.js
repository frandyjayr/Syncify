var app = require('express')();
var server = require('http').createServer(app);
var io = require('socket.io')(server);
const QueueManager = require('../server/QueueManager.js');
const RoomManager = require('../server/RoomManager.js');

const queueManager = new QueueManager();
const roomManager = new RoomManager();

app.get('/', function(req, res){
  res.send('<h1>Hello world</h1>');
});

io.on('connection', function(socket) {
    console.log('a user connected');

    socket.on('joinRoom', function(payload) {
        let currentRoom = roomManager.getCurrentRoom(payload.userId);
        if (currentRoom) {
            socket.leave(currentRoom);
            roomManager.removeUserFromRoom(payload.userId);
        }
        roomManager.addUserToRoom(payload.userId, payload.roomId);
        let currentSong = queueManager.getCurrentSong(payload.roomId);
        socket.join(payload.roomId);
        if (currentSong) {            
            console.log('join room current song: ', currentSong);
            io.to(socket.id).emit('updateNewUser', currentSong);
        }

    });


    socket.on('addToQueue', function(payload) {   
        let roomId = roomManager.getCurrentRoom(payload.userInfo.userId);
        queueManager.addItem(roomId, payload.trackInfo);
        io.to(roomId).emit('addToQueue', queueManager.getQueue(roomId));
    });

    socket.on('playClick', function(payload) {
        let roomId = roomManager.getCurrentRoom(payload.userInfo.userId);
        let currentSong = queueManager.getCurrentSong(roomId);

        if (currentSong) {
            let newPayload = {
                trackInfo: {
                    uri: currentSong.uri,
                    positionStamp: payload.trackInfo.positionStamp,
                    durationStamp: payload.trackInfo.durationStamp,
                    positionSliderValue: payload.trackInfo.positionSliderValue,
                    paused: payload.trackInfo.paused
                  }
            }
            io.to(roomId).emit('playClick', newPayload);
        } else {
            playNext(io, payload, roomId, 'playClick');
        }
        
    })

    socket.on('nextClick', function(payload) {
        let roomId = roomManager.getCurrentRoom(payload.userInfo.userId);
        playNext(io, payload, roomId, 'nextClick');
    })

    socket.on('prevClick', function(payload) {
        let roomId = roomManager.getCurrentRoom(payload.userInfo.userId);

        if (queueManager.hasPrevSong(roomId)) {
            queueManager.setPrevSong(roomId);
            playCurrentSong(io, payload, roomId, 'prevClick');
        }
    })

    socket.on('disconnect', function() {
        console.log('user disconnected');
    });
});

server.listen(4000, function(){
  console.log('listening on *:4000');
});

function playNext(io, payload, roomId, type) {
    if (queueManager.getQueue(roomId) && queueManager.getQueue(roomId).length > 0) {
        queueManager.setNextSong(roomId);
        playCurrentSong(io, payload, roomId, type);
    }
}

function playCurrentSong(io, payload, roomId, type) {
    let currentSong = queueManager.getCurrentSong(roomId);
    if (!currentSong) return;
    queueManager.setSongPlayingStatus(roomId, true);
    queueManager.setSongStartTime(roomId);

    let newPayload = {
        trackInfo: {
            uri: currentSong.uri,
            name: currentSong.name,  
            startTimestamp: Date.now()            
          }
    }
    console.log('newpayload ', newPayload);
    io.to(roomId).emit(type, newPayload);
}
