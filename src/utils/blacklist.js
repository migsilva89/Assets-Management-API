// blacklist.js

const blacklist = []

module.exports = {
  addToken: (token) => {
    blacklist.push(token)
  },
  isBlacklisted: (token) => {
    return blacklist.includes(token)
  }
}
