import { Controller, Body, Post } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { successResponseSpec } from '../utils/types/responses/success-response-spec';
import { successResponse } from '../utils/types/responses/success-response';
import { SignupDto } from '../dto/auth/signup.dto';
import { LoginOutputDtoSchema } from '../dto/auth/login-output.response.dto';
import { ResponseSchemaHelper } from '../utils/types/output-model';
import { Public } from './public-strategy';
import { LoginDto } from '../dto/auth/login.dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @ApiOperation({ summary: 'Sign up a user' })
  @ApiResponse({
    status: 201,
    description: 'Account created successfully',
  })
  @Post('/signup')
  async createAccount(
    @Body() userDetails: SignupDto,
  ): Promise<successResponseSpec> {
    await this.authService.signUp(userDetails);

    return successResponse(
      'Account Created. Please check your email and to verify your account',
      201,
    );
  }

  @Public()
  @ApiOperation({ summary: 'Log In User' })
  @Post('/signin')
  @ApiResponse({
    status: 200,
    description: 'Login Successful',
    schema: ResponseSchemaHelper(LoginOutputDtoSchema),
  })
  @ApiResponse({ status: 422, description: 'Invalid Credentials' })
  async loginUser(
    @Body() loginDetails: LoginDto,
  ): Promise<successResponseSpec> {
    const accessToken = await this.authService.signIn(loginDetails);

    return successResponse('Login Successful', 200, accessToken);
  }
}
