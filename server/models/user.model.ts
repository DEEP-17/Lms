require("dotenv").config();
import mongoose,{Document,Model,Schema} from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
const emailRegexPattern : RegExp=/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
export interface IUser extends Document {
    name: string;
    email: string;
    password: string;
    avatar: {
        public_id: string;
        url: string;
    },
    role: string;
    isVerified: boolean;
    courses : Array<{courseId : string}>;
    comparePassword: (password: string) => Promise<boolean>;
    signAccessToken: () => string;
    signRefreshToken: () => string;
}
const userSchema :Schema<IUser> = new Schema({
    name: { 
        type: String,
        required: [true, "Please enter your name"],
        // maxLength: [30, "Name cannot exceed 30 characters"],
        // minLength: [4, "Name should have more than 4 characters"],
    },
    email: {
        type: String,
        required: [true, "Please enter your email"],
        unique: true,
        validate: {
            validator: function (tvalue: string) {
                return emailRegexPattern.test(tvalue);
            },
            message: "Please enter a valid email",
        },
    },
    password: {
        type: String,
        // required: [true, "Please enter your password"],
        minlength: [6, "Password should be longer than 6 characters"],
        select: false,
    },
    avatar: {
        public_id: {
            type: String,
            required: true,
        },
        url: {
            type: String,
            required: true,
        },
    },
    role: {
        type: String,
        default: "user",
    },
    isVerified: {
        type: Boolean,
        default: false,
    },
    courses: [
        {
            courseId: String,
        },
    ],
},{timestamps: true});
//hashing password
userSchema.pre<IUser>("save", async function (next) {
    if (!this.isModified("password")) {
        next();
    }
    this.password = await bcrypt.hash(this.password, 10);
    next();
});
//signing access token
userSchema.methods.signAccessToken = function () {
    return jwt.sign({ id: this._id }, process.env.ACCESS_TOKEN  || "",
        { expiresIn: "5m" }
    );
};
//signing refresh token
userSchema.methods.signRefreshToken = function () {
    return jwt.sign({ id: this._id }, process.env.REFRESH_TOKEN || "",
        { expiresIn: "3d" }
     );
};
//comparing password
userSchema.methods.comparePassword = async function (enteredPassword: string): Promise<boolean> {
    return await bcrypt.compare(enteredPassword, this.password);
};
const userModel: Model<IUser> = mongoose.model<IUser>("User", userSchema);
export default userModel;