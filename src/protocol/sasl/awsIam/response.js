const INT32_SIZE = 4

module.exports = {
  decode: rawData => {
    const byteLength = rawData.readInt32BE(0)
    return rawData.slice(INT32_SIZE, INT32_SIZE + byteLength)
  },

  parse: data => {
    return JSON.parse(data.toString())
  },
}
