import mongoose from "mongoose";

const msgSchema = new mongoose.Schema({
    msg: {
        text: {
            type: String,
            required: true
        }
    },
    users: {
        type: Array
    },
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    }
}, {timestamps: true});

const Message = mongoose.model("messages", msgSchema);
export default Message;