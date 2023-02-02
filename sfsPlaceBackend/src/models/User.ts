import { model, Schema } from "mongoose"
import * as joi from "joi";


export interface IUser {
    username: string
    password: string
    email: string
    placedParts: number,
    validatedEmail: boolean
}

export const userSchema = new Schema<IUser>({
    username: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    placedParts: { type: Number, required: true },
    validatedEmail: { type: Boolean, required: true }
});


export const userRequestSchema = joi.object(({
    username: joi.string().alphanum()
        .min(3)
        .max(30).required(),
    email: joi.string().email().required(),
    password: joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')).required()
}))

export const User = model<IUser>('User', userSchema);