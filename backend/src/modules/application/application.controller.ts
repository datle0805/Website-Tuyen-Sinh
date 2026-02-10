import { Response } from "express";
import { validationResult } from "express-validator";
import Application from "../../models/Application";
import { AuthRequest } from "../../middleware/authMiddleware";
import * as emailService from "../../services/emailService";

// Helper to generate application number: APP-YYYY-RANDOM
const generateAppNumber = () => {
    const year = new Date().getFullYear();
    const random = Math.floor(10000 + Math.random() * 90000);
    return `APP-${year}-${random}`;
};

export const submitApplication = async (req: AuthRequest, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const applicationData = {
            ...req.body,
            userId: req.user._id,
            applicationNumber: generateAppNumber(),
            status: 'pending'
        };

        const application = await Application.create(applicationData);

        // Send confirmation email
        await emailService.sendApplicationConfirmation(req.user.email, application);

        res.status(201).json(application);
    } catch (error: any) {
        res.status(500).json({ message: error.message || "Server error" });
    }
};

export const getApplications = async (req: AuthRequest, res: Response) => {
    try {
        let query = {};
        if (req.user.role !== 'admin') {
            query = { userId: req.user._id };
        }

        const applications = await Application.find(query).sort({ createdAt: -1 });
        res.json(applications);
    } catch (error: any) {
        res.status(500).json({ message: error.message || "Server error" });
    }
};

export const getApplicationById = async (req: AuthRequest, res: Response) => {
    try {
        const application = await Application.findById(req.params.id);

        if (!application) {
            return res.status(404).json({ message: "Application not found" });
        }

        // Check ownership if not admin
        if (req.user.role !== 'admin' && application.userId.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: "Not authorized to view this application" });
        }

        res.json(application);
    } catch (error: any) {
        res.status(500).json({ message: error.message || "Server error" });
    }
};

export const updateApplicationStatus = async (req: AuthRequest, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const { status, reviewNotes } = req.body;
        const application = await Application.findById(req.params.id);

        if (!application) {
            return res.status(404).json({ message: "Application not found" });
        }

        application.status = status;
        if (reviewNotes) application.reviewNotes = reviewNotes;
        application.reviewedBy = req.user._id;

        await application.save();

        // Send status update email
        await emailService.sendStatusUpdateNotification(application.email, application, status);

        res.json(application);
    } catch (error: any) {
        res.status(500).json({ message: error.message || "Server error" });
    }
};

export const setAppointment = async (req: AuthRequest, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const { appointmentDate, appointmentTime, appointmentLocation, appointmentNotes } = req.body;
        const application = await Application.findById(req.params.id);

        if (!application) {
            return res.status(404).json({ message: "Application not found" });
        }

        application.appointmentDate = appointmentDate;
        application.appointmentTime = appointmentTime;
        application.appointmentLocation = appointmentLocation;
        application.appointmentNotes = appointmentNotes;

        await application.save();

        // Send appointment email
        await emailService.sendAppointmentNotification(application.email, application);

        res.json(application);
    } catch (error: any) {
        res.status(500).json({ message: error.message || "Server error" });
    }
};

export const updateApplication = async (req: AuthRequest, res: Response) => {
    try {
        const application = await Application.findById(req.params.id);

        if (!application) {
            return res.status(404).json({ message: "Application not found" });
        }

        if (application.userId.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: "Not authorized to update this application" });
        }

        if (application.status !== 'pending') {
            return res.status(400).json({ message: "Can only update pending applications" });
        }

        const updatedApplication = await Application.findByIdAndUpdate(
            req.params.id,
            { ...req.body, updatedAt: Date.now() },
            { new: true }
        );

        res.json(updatedApplication);
    } catch (error: any) {
        res.status(500).json({ message: error.message || "Server error" });
    }
};

export const getApplicationStats = async (req: AuthRequest, res: Response) => {
    try {
        const total = await Application.countDocuments();
        const pending = await Application.countDocuments({ status: 'pending' });
        const reviewing = await Application.countDocuments({ status: 'reviewing' });
        const accepted = await Application.countDocuments({ status: 'accepted' });
        const rejected = await Application.countDocuments({ status: 'rejected' });

        res.json({
            total,
            pending,
            reviewing,
            accepted,
            rejected
        });
    } catch (error: any) {
        res.status(500).json({ message: error.message || "Server error" });
    }
};
