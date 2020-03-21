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
        let currentRoom = roomManager.getCurrentRoom(socket.id);
        if (currentRoom === payload.roomId) return;

        // If the user was already in another room
        if (currentRoom) {
            socket.leave(currentRoom);
            roomManager.removeUserFromRoom(socket.id);
          }

        // Add user to the new room
        roomManager.addUserToRoom(socket.id, payload.roomId);
        let currentSong = queueManager.getCurrentSong(payload.roomId);
        let queue = queueManager.getQueue(payload.roomId);
        let numberInRoom = roomManager.getRoomCount(payload.roomId)
        socket.join(payload.roomId);


        // If you are the first person to enter a room and a song was paused
        if (numberInRoom === 1 && currentSong) {
            playCurrentSong(io, null, payload.roomId, 'playClick')
        } else {
            io.to(socket.id).emit('updateNewUser',  currentSong); 
        }
        
        // If there is a queue with at least 1 song, send the updated queue to user
        if (queue && queue.length > 0) {
            payload = {
                queue: queue ? queue : []
            }

            io.to(socket.id).emit('updateNewUserQueue', payload.queue);
        }

    });


    socket.on('addToQueue', function(payload) {   
        let roomId = roomManager.getCurrentRoom(socket.id);
        queueManager.addItem(roomId, payload.trackInfo);
        io.to(roomId).emit('updateQueue', queueManager.getQueue(roomId));
    });

    socket.on('removeFromQueue', function(payload) {
        let roomId = roomManager.getCurrentRoom(socket.id);
        queueManager.removeItem(roomId, payload.trackInfo.queuePosition);
        io.to(roomId).emit('updateQueue', queueManager.getQueue(roomId));
    })

    socket.on('playClick', function(payload) {
        let roomId = roomManager.getCurrentRoom(socket.id);
        let currentSong = queueManager.getCurrentSong(roomId);

        if (currentSong && payload.trackInfo.paused) {
            let newPayload = {
                trackInfo: {
                    uri: currentSong.uri,
                    positionTimestamp: payload.trackInfo.positionTimestamp,
                    durationTimestamp: payload.trackInfo.durationTimestamp,
                    positionSliderValue: payload.trackInfo.positionSliderValue,
                    paused: payload.trackInfo.paused
                  }
            }
            console.log('playclick', newPayload);
            io.to(roomId).emit('playClick', newPayload);
        } else if (currentSong && !payload.trackInfo.paused) {
            io.to(roomId).emit('pauseClick');
        } else {
            playNext(io, payload, roomId, 'playClick');
        }
        
    })

    socket.on('nextClick', function(payload) {
        let roomId = roomManager.getCurrentRoom(socket.id);
        playNext(io, payload, roomId, 'nextClick');
    })

    socket.on('prevClick', function(payload) {
        let roomId = roomManager.getCurrentRoom(socket.id);

        if (queueManager.hasPrevSong(roomId)) {
            queueManager.setPrevSong(roomId);
            playCurrentSong(io, payload, roomId, 'prevClick');
        }
    })

    socket.on('disconnect', function() {
        roomManager.removeUserFromRoom(socket.id);
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
            startTimestamp: Date.now(),
            positionTimestamp: currentSong.positionTimestamp           
        }
    }
    io.to(roomId).emit(type, newPayload);
    io.to(roomId).emit('updateQueue', queueManager.getQueue(roomId));
}
