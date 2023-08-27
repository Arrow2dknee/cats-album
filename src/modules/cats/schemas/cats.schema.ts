import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Schema as MongooseSchema } from 'mongoose';

import { User } from '@modules/users/schemas/users.schema';

@Schema({
  timestamps: true,
  collection: 'cats',
})
export class Cat {
  @Prop({ type: String, required: true })
  fileName: string;

  @Prop({ type: String, required: true })
  mimeType: string;

  @Prop({ type: Buffer, required: true })
  metadata: Buffer;

  @Prop({ type: Number, required: true })
  fileSize: number;

  @Prop({ type: MongooseSchema.Types.ObjectId, default: null, ref: 'User' })
  owner: User;
}

export type CatDocument = HydratedDocument<Cat>;

export const CatSchema = SchemaFactory.createForClass(Cat);
