const server = require("./socket/server")
const port= process.env.PORT || 3001

server.listen(port)