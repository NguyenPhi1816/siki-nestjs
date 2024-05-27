import { IsString, IsNotEmpty, Matches, IsEnum } from 'class-validator';
import { UserRole } from 'src/enums/UserRole';

export class CreateAccountDto {
  @IsString()
  @IsNotEmpty()
  @Matches(/^0[0-9]{9}$/, {
    message: 'Phone number must be 10 digits and start with 0',
  })
  phoneNumber: string;

  @IsString()
  @IsNotEmpty()
  password: string;

  @IsEnum(UserRole)
  @IsNotEmpty()
  userRoleId: UserRole;

  @IsString()
  @IsNotEmpty()
  status: string;
}
