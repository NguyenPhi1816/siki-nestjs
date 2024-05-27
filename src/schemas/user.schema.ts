import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class User extends Document {
  @Prop()
  firstName: string;

  @Prop()
  lastName: string;

  @Prop()
  address: string;

  @Prop({ required: true })
  phoneNumber: string;

  @Prop()
  gender: string;

  @Prop()
  dateOfBirth: Date;

  @Prop()
  avatar: string;

  @Prop()
  email: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
