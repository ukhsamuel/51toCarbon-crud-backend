import {
  Controller,
  Get,
  Param,
  Patch,
  Body,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { ResponseSchemaHelper } from '../utils/types/output-model';
import { successResponse } from '../utils/types/responses/success-response';
import { successResponseSpec } from '../utils/types/responses/success-response-spec';
import { UsersOutputDto, UsersOutputDtoSchema } from './dto/user-response.dto';
import { UsersService } from './users.service';
import { UpdateUserDto } from '../dto/user/update-user.dto';
import { JwtAuthGuard } from '../utils/jwt-auth.guard';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @ApiOperation({ summary: 'Get all users' })
  @ApiResponse({
    status: 200,
    description: 'Users retrieved successfully',
    schema: ResponseSchemaHelper(UsersOutputDtoSchema, 'array'),
  })
  @Get()
  async getUsers(): Promise<successResponseSpec> {
    const users = await this.usersService.getUsers();

    // Map the users to the output DTO
    const usersOutput = users?.map((user) =>
      UsersOutputDto.FromUserOutput(user),
    );

    return successResponse('Users retrieved successfully', 200, usersOutput);
  }

  @ApiOperation({ summary: 'Get one user' })
  @ApiResponse({
    status: 200,
    description: 'User retrieved successfully',
    schema: ResponseSchemaHelper(UsersOutputDtoSchema),
  })
  @Get(':id')
  async getUser(@Param('id') id: string): Promise<successResponseSpec> {
    const user = await this.usersService.findOne({ id });
    return successResponse('User retrieved successfully', 200, user);
  }

  @ApiOperation({ summary: 'Update user' })
  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiResponse({ status: 200, description: 'User update successful' })
  async updateUser(
    @Param('id') userId: string,
    @Body() userDetails: UpdateUserDto,
  ): Promise<successResponseSpec> {
    await this.usersService.updateUser(userDetails, userId);
    return successResponse('User updated successfully');
  }

  @ApiOperation({ summary: 'Delete a user password' })
  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiResponse({ status: 200, description: 'User deleted successful' })
  async deleteUser(@Param('id') userId: string): Promise<successResponseSpec> {
    await this.usersService.deleteUser(userId);

    return successResponse('User deleted successfully');
  }
}
