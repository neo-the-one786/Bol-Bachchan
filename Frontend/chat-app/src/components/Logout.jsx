import {useNavigate} from "react-router-dom";
import {BiPowerOff} from "react-icons/bi";
import styled from "styled-components";
import "../styles/Button.css";

const Button = styled.div``;

export default function Logout() {
    const navigate = useNavigate();
    const handleClick = () => {
        localStorage.clear();
        navigate("/login");
    };
    return (
        <Button className="button" onClick={handleClick}>
            <BiPowerOff></BiPowerOff>
        </Button>
    )
}