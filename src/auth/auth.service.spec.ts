import { Test, TestingModule } from '@nestjs/testing';
import * as bcrypt from 'bcrypt';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { UserEntity } from '../entities/user.entity';
import { UserRoleEnum } from '../utils/enums/roles.enum';
import { SignupDto } from '../dto/auth/signup.dto';
import { InternalServerErrorException } from '@nestjs/common';
import { LoginDto } from 'src/dto/auth/login.dto';

const mockUser: UserEntity = {
  username: 'testuser',
  email: 'test@example.com',
  password: 'password123',
  role: UserRoleEnum.CUSTOMER,
  createdAt: new Date(),
  updatedAt: new Date(),
};

describe('AuthService', () => {
  let service: AuthService;
  let usersService: jest.Mocked<UsersService>;

  const mockUsersService = {
    findOne: jest.fn(),
    createUser: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        PassportModule,
        JwtModule.register({
          secret: 'test-secret',
          signOptions: { expiresIn: '1h' },
        }),
      ],
      providers: [
        AuthService,
        { provide: UsersService, useValue: mockUsersService },
        {
          provide: JwtService,
          useValue: {
            signAsync: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    usersService = module.get(UsersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return a JWT token on valid sign in', async () => {
    const mockUser: LoginDto = {
      email: 'test@example.com',
      password: 'password123',
    };
    jest.spyOn(bcrypt, 'compare').mockResolvedValue(true);
    mockUsersService.findOne.mockResolvedValue(mockUser);

    const result = await service.signIn(mockUser);
    expect(result).toHaveProperty('accessToken');
  });

  it('should throw Invalid credentials on invalid password', async () => {
    const mockUser: LoginDto = {
      email: 'test@example.com',
      password: 'wrong-pass',
    };
    jest.spyOn(bcrypt, 'compare').mockResolvedValue(false);
    mockUsersService.findOne.mockResolvedValue(mockUser);

    await expect(service.signIn(mockUser)).rejects.toThrow(
      'Invalid credentials',
    );
  });

  describe('signUp', () => {
    it('should create and return a new user', async () => {
      usersService.createUser.mockResolvedValue(mockUser);

      const result = await service.signUp({
        email: mockUser.email,
        password: mockUser.password,
        username: mockUser.username,
      } as SignupDto);
      expect(result).toBe(mockUser);
      expect(usersService.createUser).toHaveBeenCalled();
    });

    it('should throw InternalServerErrorException on error', async () => {
      usersService.createUser.mockRejectedValue(new Error('DB error'));

      await expect(
        service.signUp({
          email: 'fail@example.com',
          password: 'pass',
        } as SignupDto),
      ).rejects.toThrow(InternalServerErrorException);
    });
  });
});
