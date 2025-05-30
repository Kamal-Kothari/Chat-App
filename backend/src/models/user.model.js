import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    fullName : {
        type: String,
        required: true,
    },
    email : {
        type: String,
        required: true,
        unique: true,
    },
    password : {
        type: String,
        minlength: 6,
        required: true,
    },
    profilePic : {
        type: String,
        default: "https://www.w3schools.com/howto/img_avatar.png",
    },
},{
    timestamps: true,
})

const User = mongoose.model("User", userSchema);
export default User;