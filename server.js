const app = require('express')();
const server = require('http').Server(app);
const io = require('socket.io')(server);
const bodyParser= require('body-parser');

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))

app.post('/notify/:token', (req, res) => {
  io.emit(req.params.token, req.body);
  res.send({}).status(200);
})

io.on('connection', (socket) => {
  socket.on('chat-message', (data) => {
    if(data.room){
      const date = new Date(data.created_at);
      io.emit(data.room, {
        from: data.from,
        message: data.message,
        created_at: date.getTime()
      })
    }
  })
});

server.listen(process.env.PORT || 3000);
