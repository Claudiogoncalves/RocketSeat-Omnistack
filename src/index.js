const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

const server = require("http").Server(app);
const io = require("socket.io")(server);

mongoose.connect(
  "mongodb://omnistack:stack1234@ds123675.mlab.com:23675/omnistack-backend",
  {
    useNewUrlParser: true
  }
);

app.use((req, res, next) => {
  req.io = io;

  return next();
});

// app.get("/", (req, res) => {
//   return res.send("Hello node");
// });

app.use(cors());
app.use(express.json());
app.use(require("./routes"));

server.listen(3001, () => {
  console.log("Server started on port 3001");
});
