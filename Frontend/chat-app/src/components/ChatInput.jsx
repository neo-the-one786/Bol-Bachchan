import styled from "styled-components";
import Picker from "emoji-picker-react";
import {BsEmojiSmileFill} from "react-icons/bs";
import {IoMdSend} from "react-icons/io";
import "../styles/ChatInput.css";
import {useState} from "react";

const ChatInputContainer = styled.div``;
export default function ChatInput(props) {
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const [msgTxt, setMsgTxt] = useState("");
    const sendChat = (event) => {
        event.preventDefault();
        props.handleSendMsg(msgTxt);
        setMsgTxt("");
    };
    return (
        <ChatInputContainer className="chat-input">
            <div className="button-container">
                <div className="emoji">
                    <BsEmojiSmileFill onClick={() => setShowEmojiPicker(!showEmojiPicker)}></BsEmojiSmileFill>
                    {showEmojiPicker && <Picker className="emoji-picker-react" onEmojiClick={(emoji) => setMsgTxt(msgTxt + emoji.emoji)}></Picker>}
                </div>
            </div>
            <form className="input-container" onSubmit={sendChat}>
                <input type="text" placeholder="type message here" value={msgTxt} onChange={(event) => setMsgTxt(event.target.value)}/>
                <button>
                    <IoMdSend></IoMdSend>
                </button>
            </form>
        </ChatInputContainer>
    )
}