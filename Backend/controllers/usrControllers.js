import User from "../model/usrModel.js";

export async function signup(req, res, next) {
    try {
        const {usrNam, email, passwd} = req.body;
        const error = await User.validateCredentials(usrNam, email);
        if (error) {
            return res.json(error);
        }
        const newUsr = new User({
            usrNam: usrNam,
            email: email,
            passwd: passwd
        });
        await newUsr.save();
        return res.json({user: newUsr, status: true});
    } catch (e) {
        next(e);
    }
}

export async function login(req, res, next) {
    try {
        const {usrNam, passwd} = req.body;
        const usr = await User.findAndValidate(usrNam, passwd);
        if (usr) {
            return res.json({user: usr, status: true})
        } else {
            return res.json({msg: "Incorrect username or password", status: false});
        }
    } catch (e) {
        next(e);
    }
}

export async function setAvatar(req, res, next) {
    try {
        const usrID = req.params.id;
        const avatarImg = req.body.img;
        const usr = await User.findByIdAndUpdate(usrID, {isAvatarImgSet: true, avatarImg: avatarImg});
        return res.json({isSet: usr.isAvatarImgSet, img: usr.avatarImg})
    } catch (e) {
        next(e);
    }
}

export async function getAllUsers(req, res, next) {
    try {
        const id = req.params.id;
        const contacts = await User.find({_id: {$ne: id}}).select(["_id", "usrNam", "email", "avatarImg"]);
        return res.json({users: contacts});
    } catch (e) {
        next(e);
    }
}