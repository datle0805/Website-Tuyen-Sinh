import { Request, Response, NextFunction } from "express";
import { asyncHandler } from "../../utils/error";

export const getHealth = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    res.status(200).json({
        success: true,
        message: "Server is healthy",
        uptime: process.uptime(),
        timestamp: new Date().toISOString(),
    });
});
