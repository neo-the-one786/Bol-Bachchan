import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import usrRoutes from "./routes/usrRoutes.js";
import msgRoutes from "./routes/msgRoutes.js";
import {Server} from "socket.io";
import session from "express-session";

dotenv.config();

const app = express();

app.use(cors({
    origin: "http://localhost:5173", // Replace with your frontend URL
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE', // Allowed methods
    credentials: true, // Allow credentials (like cookies or authorization headers)
    optionsSuccessStatus: 204 // Handle legacy browser support
}));

app.use(express.json());

try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log("Conn success :)");
} catch (e) {
    console.log("Conn fail :(");
    console.error(e);
}

app.use(session({
    secret: process.env.SECRET,
    resave: false,              // Forces the session to be saved back to the session store
    saveUninitialized: true,    // Forces a session that is uninitialized to be saved to the store
    cookie: {
        maxAge: 1000 * 60 * 60, // Set the session cookie to expire after 1 hour
        secure: false,           // Set to true if using https
    }
}));

app.use("/api/msg", msgRoutes);
app.use("/api/auth", usrRoutes);

const svr = app.listen(process.env.PORT, () => {
    console.log(`Server listening at port ${process.env.PORT}`);
});

const io = new Server(svr, {
    cors: {
        origin: "http://localhost:5173",
        credentials: true,
    },
});

app.options("/api/avatar/:id", (req, res) => {
    res.setHeader("Access-Control-Allow-Origin", "http://localhost:5173");
    res.setHeader("Access-Control-Allow-Methods", "GET,OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");
    res.setHeader("Access-Control-Allow-Credentials", "true");
    res.sendStatus(204);
});

global.onlineUsers = new Map();

io.on("connection", (socket) => {
    global.chatSocket = socket;
    socket.on("add-user", (userId) => {
        onlineUsers.set(userId, socket.id);
    });
    socket.on("send-msg", (data) => {
        console.log(data);
        const sendUserSocket = onlineUsers.get(data.to);
        if (sendUserSocket) {
            socket.to(sendUserSocket).emit("msg-receive", data.msgTxt);
        }
    });
});