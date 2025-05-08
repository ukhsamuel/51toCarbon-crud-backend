import {
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { SignupDto } from '../dto/auth/signup.dto';
import { UserEntity } from '../entities/user.entity';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from 'src/dto/auth/login.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly usersService: UsersService,
  ) {}

  async signUp(userDetails: SignupDto): Promise<UserEntity> {
    try {
      const saltRounds: number = 10;
      const hashedPassword = await bcrypt.hash(
        userDetails.password,
        saltRounds,
      );

      const user = await this.usersService.createUser({
        ...userDetails,
        password: hashedPassword,
      });

      return user;
    } catch (error) {
      console.error('Error signing up user:', error);
      throw new InternalServerErrorException('Failed to register user');
    }
  }

  async signIn(loginDetails: LoginDto) {
    const { email, password } = loginDetails;

    try {
      const user = await this.usersService.findOne({ email });

      if (!user || !(await bcrypt.compare(password, user.password))) {
        throw new UnauthorizedException('Invalid credentials');
      }

      const payload = { sub: user.id, email: user.email };

      return {
        accessToken: await this.jwtService.signAsync(payload),
      };
    } catch (error) {
      console.error('Error signing in user:', error);

      if (error instanceof UnauthorizedException) {
        throw error;
      }

      throw new InternalServerErrorException('Failed to sign in');
    }
  }
}
