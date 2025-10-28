require('dotenv').config({ debug: true });
const app = require('./app')
const connectDB = require('./db/db')
const initSocketServer = require('./sockets/socket.server')
const httpServer = require("http").createServer(app);




connectDB();
initSocketServer(httpServer)

httpServer.listen(3000, () =>{
    console.log('Server is running on port 3000')
})