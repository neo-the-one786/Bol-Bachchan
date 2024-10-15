import mongoose from "mongoose";
import bcrypt from "bcrypt";

const usrSchema = new mongoose.Schema({
    usrNam: {
        type: String,
        required: [true, "Username cannot be empty!"],
        unique: true,
        min: 3,
        max: 20
    },
    email: {
        type: String,
        required: [true, "Email cannot be empty!"],
        unique: true,
        max: 50
    },
    passwd: {
        type: String,
        required: [true, "Password cannot be empty"],
        min: 10
    },
    isAvatarImgSet: {
        type: Boolean,
        default: false
    },
    avatarImg: {
        type: String,
        default: ""
    }
});


usrSchema.statics.validateCredentials = async (usrNam, email) => {
    const usrExist = await User.findOne({usrNam: usrNam});
    if (usrExist) {
        return {msg: "Username already in use!", status: false}
    }
    const emailExist = await User.findOne({email: email});
    if (emailExist) {
        return {msg: "Email already in use!", status: false};
    }
    return null;
};

usrSchema.statics.findAndValidate = async (usrNam, passwd) => {
    const usr = await User.findOne({usrNam: usrNam});
    if (usr) {
        const isPassMatch = await bcrypt.compare(passwd, usr.passwd);
        if (isPassMatch) {
            return usr;
        }
    }
    return null;
};

usrSchema.pre("save", async function (next) {
    if (!this.isModified("passwd")) {
        return next();
    }
    this.passwd = await bcrypt.hash(this.passwd, 12);
    return next();
})

const User = mongoose.model("users", usrSchema);
export default User;
