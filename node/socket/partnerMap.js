const partners = new Map();

module.exports = {
  set: (nickname, partnerNickname) => partners.set(nickname, partnerNickname),
  get: (nickname) => partners.get(nickname),
  has: (nickname) => partners.has(nickname),
  delete: (nickname) => partners.delete(nickname),
  all: () => {
    const result = {};
    for (let [key, value] of partners.entries()) {
      result[key] = value;
    }
    return result;
  }
};
