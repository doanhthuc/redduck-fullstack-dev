import Mongoose from 'mongoose';
import { getModelForClass, prop } from '@typegoose/typegoose';
export class Token {
    _id!: Mongoose.Types.ObjectId;

    @prop({ required: true })
    userId!: string;

    @prop({ required: true })
    token!: string;

    @prop({ default: Date.now, expires: 60 * 5 })
    createdAt!: Date;
}

export const TokenModel = getModelForClass(Token);
