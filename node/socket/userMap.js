const users = new Map();

module.exports = {
  set: (nickname, socketId) => users.set(nickname, socketId),
  get: (nickname) => users.get(nickname),
  has: (nickname) => users.has(nickname),
  delete: (nickname) => users.delete(nickname),
  all: () => {
    const result = {};
    for (let [key, value] of users.entries()) {
      result[key] = value;
    }
    return result;
  },
  keys: () => Array.from(users.keys())
};
