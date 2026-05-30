import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },

        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
        },

        password: {
            type: String,
            required: true,
            minlength: 6,
        },

        role: {
            type: String,
            enum: ["candidate", "recruiter"],
            default: "candidate",
        },

        resume: {
            type: String,
            default: '',
        },

        currentResume: {
            version: Number,
            fileName: String,
            resumeUrl: String,
            publicId: String,
            uploadedAt: Date,
            active: {
                type: Boolean,
                default: false,
            },
        },

        resumeHistory: [
            {
                version: {
                    type: Number,
                    required: true,
                },
                fileName: {
                    type: String,
                },
                resumeUrl: {
                    type: String,
                },
                publicId: {
                    type: String,
                },
                uploadedAt: {
                    type: Date,
                    default: Date.now,
                },
                active: {
                    type: Boolean,
                    default: false,
                },
            },
        ],
    },
    {
        timestamps: true,
    }
);

const User = mongoose.model("User", userSchema);

export default User;