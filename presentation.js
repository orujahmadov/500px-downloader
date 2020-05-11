const fs = require('fs')
// read values from file
const rs = fs.createReadStream('/dev/urandom')
const ws = fs.createWriteStream('./random_output')
let size = 0
// because buffers are used, the program does not crash due to infinite data
rs.on((val) => {
  size += data.length
  ws.write(`File.size: ${size}\n`)
  console.log('File size:', size)
})
