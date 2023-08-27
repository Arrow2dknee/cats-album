import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

import { UserRole } from '../enums/user.role';

@Schema({
  timestamps: true,
  collection: 'users',
})
export class User {
  @Prop({ type: String, required: true })
  fullname: string;

  @Prop({ type: String, required: true })
  email: string;

  @Prop({ type: String, required: true, select: false }) // will be excluded during .find() queries
  password: string;

  @Prop({ type: String, enum: UserRole, default: UserRole.user })
  role: UserRole;
}

export type UserDocument = HydratedDocument<User>;

export const userSchema = SchemaFactory.createForClass(User);
