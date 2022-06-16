const Decoder = require('../../decoder')

module.exports = {
  decode: rawData => {
    return new Decoder(rawData).readBytes()
  },

  parse: data => {
    return JSON.parse(data.toString())
  },
}
