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

const musicRoomIO = io.of('/music-room');
const chatRoomIO = io.of('/chat-room');

musicRoomIO.on('connection', function(socket) {
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
            playCurrentSong(musicRoomIO, payload.roomId, 'playClick')
        } else {
            musicRoomIO.to(socket.id).emit('updateNewUser',  {trackInfo: currentSong} ); 
        }
        
        // If there is a queue with at least 1 song, send the updated queue to user
        if (queue && queue.length > 0) {
            payload = {
                queue: queue ? queue : []
            }
            musicRoomIO.to(socket.id).emit('updateNewUserQueue', payload.queue);
        } else {
            musicRoomIO.to(socket.id).emit('updateNewUserQueue', []);
        }

    });


    socket.on('addToQueue', function(payload) {   
        console.log(payload);
        let roomId = roomManager.getCurrentRoom(socket.id);
        queueManager.addItem(roomId, payload.trackInfo);
        musicRoomIO.to(roomId).emit('updateQueue', queueManager.getQueue(roomId));
    });

    socket.on('removeFromQueue', function(payload) {
        let roomId = roomManager.getCurrentRoom(socket.id);
        queueManager.removeItem(roomId, payload.trackInfo.queuePosition);
        musicRoomIO.to(roomId).emit('updateQueue', queueManager.getQueue(roomId));
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
                    paused: payload.trackInfo.paused,
                    albumSrc: currentSong.albumSrc,
                    albumName: currentSong.albumName, 
                    name: currentSong.name
                  }
            }
            console.log('playclick', newPayload);
            musicRoomIO.to(roomId).emit('playClick', newPayload);
        } else if (currentSong && !payload.trackInfo.paused) {
            musicRoomIO.to(roomId).emit('pauseClick');
        } else {
            playNext(musicRoomIO, roomId, 'playClick');
        }
        
    })

    socket.on('nextClick', function() {
        let roomId = roomManager.getCurrentRoom(socket.id);
        playNext(musicRoomIO, roomId, 'nextClick');
    })

    socket.on('prevClick', function() {
        let roomId = roomManager.getCurrentRoom(socket.id);

        if (queueManager.hasPrevSong(roomId)) {
            queueManager.setPrevSong(roomId);
            playCurrentSong(musicRoomIO, roomId, 'prevClick');
        }
    })

    socket.on('seekTrack', function(payload) {
        console.log('seekTrack: ', payload)

        let roomId = roomManager.getCurrentRoom(socket.id);
        let currentSong = queueManager.getCurrentSong(roomId);

        if (currentSong) {
            // try calling a seek track versus calling a play new song
            queueManager.setCurrentSongPosition(roomId, payload.trackInfo.positionTimestamp);
            playCurrentSong(musicRoomIO, roomId, 'playClick');
        }
    });

    socket.on('disconnect', function() {
        roomManager.removeUserFromRoom(socket.id);
        console.log('user disconnected');
    });
});

server.listen(4000, function(){
    console.log('listening on *:4000');
});


function playNext(musicRoomIO, roomId, type) {
    if (queueManager.getQueue(roomId) && queueManager.getQueue(roomId).length > 0) {
        queueManager.setNextSong(roomId);
        playCurrentSong(musicRoomIO, roomId, type);
    }
}

function playCurrentSong(musicRoomIO, roomId, type) {
    let currentSong = queueManager.getCurrentSong(roomId);
    if (!currentSong) return;

    queueManager.setSongPlayingStatus(roomId, true);
    queueManager.setSongStartTime(roomId);

    let newPayload = {
        trackInfo: {
            uri: currentSong.uri,
            name: currentSong.name,  
            startTimestamp: Date.now(),
            positionTimestamp: currentSong.positionTimestamp,
            albumSrc: currentSong.albumSrc,
            albumName: currentSong.albumName   
        }
    }
    musicRoomIO.to(roomId).emit(type, newPayload);
    musicRoomIO.to(roomId).emit('updateQueue', queueManager.getQueue(roomId));
}
