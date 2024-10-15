import express from "express";
import {signup, login, setAvatar, getAllUsers} from "../controllers/usrControllers.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/setAvatar/:id", setAvatar);
router.post("/allUsers/:id", getAllUsers);

export default router;