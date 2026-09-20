import { IsEmail, IsString, MinLength, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty({ example: 'owner@dar-demo.ma' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'owner1234' })
  @IsString()
  @MinLength(4)
  password: string;
}

export class LoginPinDto {
  @ApiProperty({ example: 'dar-demo' })
  @IsString()
  tenantSlug: string;

  @ApiProperty({ example: 'uuid-of-user' })
  @IsUUID()
  userId: string;

  @ApiProperty({ example: '1111' })
  @IsString()
  @MinLength(4)
  pin: string;
}
