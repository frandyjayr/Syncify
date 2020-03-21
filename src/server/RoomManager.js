class RoomManager {
    constructor() {
        this.roomMap = [];
        this.roomCount = {};

    }

    getCurrentRoom(userId) {
        let currentRoom = this.roomMap[userId];
        return currentRoom === undefined ? null : currentRoom;
    }

    getRoomCount(roomId) {
        return !this.roomCount[roomId] ? 0 : this.roomCount[roomId]
    }

    addUserToRoom(userId, roomId) {
        if (!this.roomCount[roomId]) {
            this.roomCount[roomId] = 1;
        } else {
            this.roomCount[roomId]++;
        }

        this.roomMap[userId] = roomId;
    }

    removeUserFromRoom(userId) {
        let roomId = this.roomMap[userId];
        this.roomCount[roomId]--;
        delete this.roomMap[userId];
    }
}

module.exports = RoomManager;