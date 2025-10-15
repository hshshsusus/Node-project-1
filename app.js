const express = require("express");
const connectDB = require("./src/config/database");
const authRouter = require("./src/Routers/auth");
const profileRouter = require("./src/Routers/profile");
const requetRouter = require("./src/Routers/requests");
const userRouter = require("./src/Routers/user");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const http = require("http");
const initializeSocket = require("./src/utils/socket");

const app = express();

const port = 7777;

app.use(cors({
    origin:"http://localhost:5173",
    credentials:true
}))
app.use(express.json());
app.use(cookieParser())

app.use("/", authRouter);
app.use("/",profileRouter);
app.use("/", requetRouter);
app.use("/", userRouter);

const server = http.createServer(app);
initializeSocket(server);

connectDB()
    .then(() => {
        console.log("Database connected successfully ...")
        server.listen(port, () => {
            console.log(`server running at ${port}...`)
        })
    })
    .catch((err) => {
        console.log("ERROR: " + err.message);
    })

