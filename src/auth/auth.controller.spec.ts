import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
// import { SignupDto } from '../dto/auth/signup.dto';
// import { successResponse } from '../utils/types/responses/success-response';
import { UsersService } from '../users/users.service';
// import { UserRoleEnum } from '../utils/enums/roles.enum';
import { LoginDto } from '../dto/auth/login.dto';
import { UsersController } from '../users/users.controller';
import { SignupDto } from '../dto/auth/signup.dto';
import { UserRoleEnum } from '../utils/enums/roles.enum';
import { successResponse } from '../utils/types/responses/success-response';

fdescribe('AuthController', () => {
  let controller: AuthController;
  let authService: AuthService;

  const mockUserService = {
    createUser: jest.fn().mockResolvedValue({ email: 'test@example.com' }),
    findUserByEmail: jest.fn().mockResolvedValue({ email: 'test@example.com' }),
  };

  const mockAuthService = {
    signUp: jest.fn().mockResolvedValue(undefined),
    signIn: jest.fn().mockResolvedValue('accessToken'),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController, UsersController],
      providers: [
        { provide: AuthService, useValue: mockAuthService },
        { provide: UsersService, useValue: mockUserService },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
  });

  it('should call authService.signUp and return success message', async () => {
    const dto: SignupDto = {
      email: 'test@example.com',
      password: 'securePassword123',
      confirmPassword: 'securePassword123',
      username: 'testuser',
      role: UserRoleEnum.CUSTOMER,
    };

    const result = await controller.createAccount(dto);

    expect(authService.signUp).toHaveBeenCalledWith(dto);
    expect(result).toEqual(
      successResponse(
        'Account Created. Please check your email and to verify your account',
        201,
      ),
    );
  });

  it('should call authService.signIn and return access token', async () => {
    const loginDetails: LoginDto = {
      email: '',
      password: '',
    };
    const result = await controller.loginUser(loginDetails);
    expect(result.data).toBe('accessToken');
  });
});
