const Stack = require('../app/js/Utility/DataStructures/Stack.js');

class QueueManager {
    constructor() {
        this.playedStack = {}
        this.queue = {};
        this.currentSong = {};
    }

    getQueue(roomId) {
        return this.queue[roomId] === undefined ? null : this.queue[roomId];
    }

    addItem(roomId, queueItem) {
        if (!this.queue[roomId]) {
            this.queue[roomId] = [];
        }
        this.queue[roomId].push(queueItem);      
    }

    getCurrentSong(roomId) {
        return this.currentSong[roomId] === undefined ? null : this.currentSong[roomId]
    }

    hasPrevSong(roomId) {
        return this.playedStack[roomId].size();
    }

    setNextSong(roomId) {
        
        console.log('called playNextSong()');
        if (this.queue[roomId].length > 0) {
            if (!this.playedStack[roomId]) {
                this.playedStack[roomId] = new Stack();
            }
            this.playedStack[roomId].push(this.currentSong[roomId]);
            this.currentSong[roomId] = this.queue[roomId][0];
            console.log('original queue: ', this.queue[roomId]);
            this.queue[roomId].shift();
            console.log('new queue: ', this.queue[roomId]);
        } else {
            this.currentSong[roomId] = null;
        }
    }

    setPrevSong(roomId) {
        this.queue[roomId].unshift(this.currentSong[roomId]);
        this.currentSong[roomId] = this.playedStack[roomId].pop();
    }

    setSongPlayingStatus(roomId, status) {
        this.currentSong[roomId]['playing'] = status;
    }

    setSongStartTime(roomId, startTime = Date.now()) {
        this.currentSong[roomId]['startTimestamp'] = startTime;
    }
}

module.exports = QueueManager;