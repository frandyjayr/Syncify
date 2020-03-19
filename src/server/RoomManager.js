class RoomManager {
    constructor() {
        this.roomMap = [];
    }

    getCurrentRoom(userId) {
        let currentRoom = this.roomMap[userId];
        return currentRoom === undefined ? null : currentRoom;
    }

    addUserToRoom(userId, roomId) {
        this.roomMap[userId] = roomId;
        console.log('Added user to room: ', this.roomMap[userId]);
    }

    removeUserFromRoom(userId) {
        delete this.roomMap[userId];
    }
}

module.exports = RoomManager;