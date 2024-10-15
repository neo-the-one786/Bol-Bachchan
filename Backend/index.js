import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import usrRoutes from "./routes/usrRoutes.js";
import msgRoutes from "./routes/msgRoutes.js";
import {Server} from "socket.io";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", usrRoutes);
app.use("/api/msg", msgRoutes);

try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log("Conn success :)");
} catch (e) {
    console.log("Conn fail :(");
    console.error(e);
}

const svr = app.listen(process.env.PORT, () => {
    console.log(`Server listening at port ${process.env.PORT}`);
});

const io = new Server(svr, {
    cors: {
        origin: "http://localhost:5173",
        credentials: true,
    },
});

global.onlineUsers = new Map();

io.on("connection", (socket) => {
    global.chatSocket = socket;
    socket.on("add-user", (userId) => {
        onlineUsers.set(userId, socket.id);
    });
    socket.on("send-msg", (data) => {
        const sendUserSocket = onlineUsers.get(data.to);
        if (sendUserSocket) {
            socket.to(sendUserSocket).emit("msg-receive", data.msg);
        }
    });
});