import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'
const schemaOptions = {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
};
const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, "Tên tài khoản là bắt buộc"],
        unique: true,
        maxLength: [10, "Tên tài khoản tối đa 10 ký tự"]
    },
    email: {
        type: String,
        required: [true, "Email là bắt buộc"],
        unique: true,
        lowercase: true,
        trim: true
    },
    image: {
        type: String,
        default: "https://w7.pngwing.com/pngs/195/539/png-transparent-account-user-person-profile-people-outline-style-icon.png"
    },
    age: {
        type: Number,
    },
    password: {
        type: String,
        required: [true, "Password is required"],
        minlength: [6, 'Mật khẩu tối thiểu 6 kí tự!']
    },
    isLocked: {
        type: Boolean,
        default: false
    },
    pushToken: {
        type: String,
    },
    clerkId: {
        type: String,
        required: true
    },
    role: {
        type: String,
        default: "USER"
    },
    gender: {
        type: String
    },
    weight: {
        type: Number
    },
    targetWeight: {
        type: Number
    },
    bmi: {
        type: Number
    },
    targetBMI: {
        type: Number
    },
    height: {
        type: Number
    },
    focusBodyPart: [
        {
            type: String
        }
    ],
    healthGoal: {
        type: String
    },
    level: {
        type: String
    },
    bmr: {
        type: String
    },
    orm: {
        type: Number
    },
    activityLevel: {
        type: Number
    },
    tdee: {
        type: Number
    },
    daysShouldTraining: {
        type: Number
    },
    caloriesPerTraining: {
        type: Number
    },
    totalDaysToReachTarget: {
        type: Number
    },
    fatRequirement: {
        type: Number,
    },
    proteinRequirement: {
        type: Number,
    },
    mealDistribution: {
        breakfast: {
            type: Number
        },
        lunch: {
            type: Number,
        },
        dinner: {
            type: Number
        }
    }
}, schemaOptions)


UserSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();

    try {
        const salt = await bcrypt.genSalt(10)
        this.password = await bcrypt.hash(this.password, salt)
        next()
    } catch (error) {
        next(error)
    }
})

//tk: nam
//mk: 123456

// req mk: 1234567 => invalid credentials

UserSchema.methods.comparePassword = async function (password) {
    return bcrypt.compare(password, this.password)
}

const User = mongoose.model('User', UserSchema);

export default User