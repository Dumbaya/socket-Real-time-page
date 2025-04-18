const roomMap = new Map();

module.exports = {
  addUserToRoom: (room, nickname) => {
    if (!roomMap.has(room)) {
      roomMap.set(room, new Set());
    }
    roomMap.get(room).add(nickname);
  },
  removeUserFromRoom: (room, nickname) => {
    if (roomMap.has(room)) {
      roomMap.get(room).delete(nickname);
      if (roomMap.get(room).size === 0) {
        roomMap.delete(room);
      }
    }
  },
  getUsersInRoom: (room) => {
    return roomMap.has(room) ? Array.from(roomMap.get(room)) : [];
  },
  getRooms: () => {
    return Array.from(roomMap.keys());
  }
};

