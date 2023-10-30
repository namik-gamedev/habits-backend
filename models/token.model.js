import { ObjectId } from 'mongodb';
import { Schema, model } from 'mongoose';

const TokenSchema = new Schema({
   userId: {
      type: ObjectId,
      ref: 'User',
   },
   refreshToken: {
      type: String,
      required: true,
   },
});

const Token = model('Token', TokenSchema);
export default Token;
