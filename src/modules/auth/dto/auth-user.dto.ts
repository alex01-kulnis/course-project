import { MaxLength, MinLength } from 'class-validator';

export class AuthUserDto {
  @MinLength(4, { message: 'Логин должен быть минимум 4 символа' })
  @MaxLength(16, { message: 'Логин не может превышать 16 символов' })
  login: string;

  @MinLength(4, { message: 'Пароль должен быть минимум 4 символа' })
  @MaxLength(16, { message: 'Пароль не может превышать 16 символов' })
  password: string;
}
