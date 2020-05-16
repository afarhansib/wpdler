const http = require('http')
const https = require('https')
const express = require('express')
const fs = require('fs')
const app = express()
const server = http.createServer(app)
const io = require('socket.io').listen(server)

app.get('/', (req, res) => {
  console.log('Homepage')
  res.sendFile(`${__dirname}/index.html`)
})

app.use('/assets', express.static('assets'))

io.on('connection', socket => {
  console.log('a user connected')
  socket.on('download', data => {
    download(data.url, data.id + data["url"].substring(data["url"].lastIndexOf(".")), () => {
      socket.emit('download status', { statusCode: 1 })
    })
    console.log(data)
  })
})

const download = (url, dest, cb) => {
  var file = fs.createWriteStream(`./wallpapers/${dest}`);
  var request = https.get(url, function(response) {
    response.pipe(file);
    file.on('finish', function() {
      file.close(cb);
    });
  });
}

server.listen(3000, () => {
  console.log('server is running on port', server.address().port)
})