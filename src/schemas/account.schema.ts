import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { UserRole } from 'src/enums/UserRole';

@Schema()
export class Account extends Document {
  @Prop({ required: true })
  phoneNumber: string;

  @Prop({ required: true })
  password: string;

  @Prop({
    required: true,
  })
  userRole: string;

  @Prop({ required: true })
  status: string;
}

export const AccountSchema = SchemaFactory.createForClass(Account);
