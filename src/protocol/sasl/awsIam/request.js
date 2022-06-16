const INT32_SIZE = 4

module.exports = payload => ({
  encode: async () => {
    const stringifiedPayload = JSON.stringify(payload)
    const byteLength = Buffer.byteLength(stringifiedPayload, 'utf8')
    const buf = Buffer.alloc(INT32_SIZE + byteLength)
    buf.writeUInt32BE(byteLength, 0)
    buf.write(stringifiedPayload, INT32_SIZE, byteLength, 'utf8')
    return buf
  },
})
