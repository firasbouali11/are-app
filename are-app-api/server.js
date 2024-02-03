const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors")

const app = express();
const port = process.env.PORT || 5555;

const users = require("./routes/users")
const signin = require("./routes/signin");
const materials = require("./routes/materials");


// 0w4t3034RL730yZQ
mongoose.connect(
  "mongodb+srv://root:0w4t3034RL730yZQ@cluster0.i27xs.mongodb.net/root?retryWrites=true&w=majority",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
);

mongoose.connection.on("connected", () => {
  console.log("connected to mongoDB");
});

mongoose.connection.on("error", (err) => {
  console.log("error: ", err);
});
app.use(cors())
app.use(express.json());
app.use("/users",users)
app.use("/signin",signin)
app.use("/materials",materials)



app.listen(port, () => {
  console.log("the server is running on ", port);
});


