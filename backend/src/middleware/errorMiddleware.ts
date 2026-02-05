import { Request, Response, NextFunction } from "express";
import { AppError } from "../utils/error";

export const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
    const statusCode = err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    res.status(statusCode).json({
        success: false,
        message,
        stack: process.env.NODE_ENV === "production" ? null : err.stack,
    });
};

export const notFound = (req: Request, res: Response, next: NextFunction) => {
    const error = new AppError(`Not Found - ${req.originalUrl}`, 404);
    next(error);
};
