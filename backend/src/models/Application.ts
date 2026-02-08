import mongoose, { Schema, Document } from "mongoose";

export interface IApplication extends Document {
    userId: mongoose.Types.ObjectId;
    applicationNumber: string;
    status: 'pending' | 'reviewing' | 'accepted' | 'rejected';

    // Personal Information
    fullName: string;
    dateOfBirth: Date;
    gender: string;
    phoneNumber: string;
    email: string;
    address: string;
    city: string;
    country: string;

    // Education Information
    educationLevel: string;

    // Appointment Information
    appointmentDate?: Date;
    appointmentTime?: string;
    appointmentLocation?: string;
    appointmentNotes?: string;

    // Admin Information
    reviewNotes?: string;
    reviewedBy?: mongoose.Types.ObjectId;

    createdAt: Date;
    updatedAt: Date;
}

const ApplicationSchema: Schema = new Schema(
    {
        userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
        applicationNumber: { type: String, required: true, unique: true },
        status: {
            type: String,
            enum: ['pending', 'reviewing', 'accepted', 'rejected'],
            default: 'pending'
        },

        // Personal Information
        fullName: { type: String, required: true },
        dateOfBirth: { type: Date, required: true },
        gender: { type: String, required: true },
        phoneNumber: { type: String, required: true },
        email: { type: String, required: true, lowercase: true, trim: true },
        address: { type: String, required: true },
        city: { type: String, required: true },
        country: { type: String, required: true },

        // Education Information
        educationLevel: {
            type: String,
            required: true,
            enum: [
                'Mẫu giáo',
                'Lớp 1', 'Lớp 2', 'Lớp 3', 'Lớp 4', 'Lớp 5',
                'Lớp 6', 'Lớp 7', 'Lớp 8', 'Lớp 9',
                'Lớp 10', 'Lớp 11', 'Lớp 12',
                'Đại học',
                'TOEIC'
            ]
        },

        // Appointment Information
        appointmentDate: { type: Date },
        appointmentTime: { type: String },
        appointmentLocation: { type: String },
        appointmentNotes: { type: String },

        // Admin Information
        reviewNotes: { type: String },
        reviewedBy: { type: Schema.Types.ObjectId, ref: "User" },
    },
    { timestamps: true }
);

const Application = mongoose.models.Application || mongoose.model<IApplication>("Application", ApplicationSchema);

export default Application;
