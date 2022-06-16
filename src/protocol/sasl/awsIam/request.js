const Encoder = require('../../encoder')

module.exports = payload => ({
  encode: () => {
    return new Encoder().writeBytes(JSON.stringify(payload))
  },
})
