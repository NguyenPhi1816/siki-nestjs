import { IsString, IsNotEmpty, Matches, IsEnum } from 'class-validator';
import { AccountStatus } from 'src/enums/AccountStatus';
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
  userRole: UserRole;

  @IsEnum(AccountStatus)
  @IsNotEmpty()
  status: AccountStatus;
}
