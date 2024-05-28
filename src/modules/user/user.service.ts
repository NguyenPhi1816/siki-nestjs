import { ConflictException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ClientSession, Model } from 'mongoose';
import { CreateUserDto } from 'src/dto/CreateUserDto';
import { User } from 'src/schemas/user.schema';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async create(
    createUserDto: CreateUserDto,
    session: ClientSession,
  ): Promise<User> {
    const existedUser = await this.findByPhoneNumber(createUserDto.phoneNumber);
    if (existedUser) {
      throw new ConflictException('Số điện thoại này đã được sử dụng');
    }
    const createdUser = new this.userModel(createUserDto);
    return createdUser.save({ session });
  }

  async findByPhoneNumber(phoneNumber: string): Promise<User> {
    return this.userModel.findOne({ phoneNumber: phoneNumber }).exec();
  }

  async findAll(): Promise<User[]> {
    return this.userModel.find().exec();
  }
}
