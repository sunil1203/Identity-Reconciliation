import { Request, Response, NextFunction } from "express";

import * as ContactService from "../services/contact.service";

export const identify = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { email, phoneNumber } = req.body;
        const result = await ContactService.identifyContact({ email, phoneNumber });
        res.json(result);
    } catch (err) {
        next(err);
    }
};