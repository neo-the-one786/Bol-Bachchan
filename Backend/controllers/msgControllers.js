import Message from "../model/messages.js";

export async function addMsg(req, res, next) {
    try {
        const {from, to, msgTxt} = req.body;
        const newMsg = new Message({
            msg: {text: msgTxt},
            users: [from, to],
            sender: from
        });
        try {
            await newMsg.save();
            return res.json({msg: "Message sent successfully :)", status: true});
        } catch (e) {
            return res.json({msg: "Message failed :)", status: false});
        }
    } catch (e) {
        next(e);
    }
}

export async function getAllMsg(req, res, next) {
    try {
        const {from, to} = req.body;
        const messages = await Message.find({users: {$all: [from, to]}}).sort({updatedAt: 1});
        const projectMsg = messages.map(message => {
            return {
                fromSelf: message.sender.toString() === from,
                msgTxt: message.msg.text
            };
        });
        res.json(projectMsg);
    } catch (e) {
        next(e);
    }
}