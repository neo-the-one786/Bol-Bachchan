import express from "express";
import {addMsg, getAllMsg} from "../controllers/msgControllers.js";

const router = express.Router();

router.post("/addMsg", addMsg);
router.post("/getAllMsg", getAllMsg);

export default router;