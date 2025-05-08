import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from '../entities/user.entity';
import { User } from '../utils/types/user';
import { ObjectId } from 'typeorm';
import { UserRoleEnum } from '../utils/enums/roles.enum';
import { UpdateUserDto } from 'src/dto/user/update-user.dto';

describe('UsersController', () => {
  let controller: UsersController;
  let usersService: UsersService;

  // Mock UsersService
  const mockUsersService = {
    getUsers: jest.fn(),
    findOne: jest.fn(),
    createUser: jest.fn(),
    updateUser: jest.fn(),
    deleteUser: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      imports: [
        TypeOrmModule.forRoot({
          type: 'mongodb',
          url: 'mongodb://localhost:27017/test',
          entities: [UserEntity],
          synchronize: true,
        }),
        TypeOrmModule.forFeature([UserEntity]),
      ],
      providers: [
        { provide: UsersService, useValue: mockUsersService }, // Use the mock service here
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
    usersService = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should call getUsers from UsersService', async () => {
    await controller.getUsers();
    expect(mockUsersService.getUsers).toHaveBeenCalled();
  });

  describe('getUsers', () => {
    it('should call usersService.getUsers and return success response', async () => {
      const mockUsers: User[] = [
        {
          id: '766f191e810c19729de860ea1' as unknown as ObjectId,
          username: 'user1',
          email: 'user1@example.com',
          role: UserRoleEnum.CUSTOMER,
        },
        {
          id: '766f191e810c19729de860ea2' as unknown as ObjectId,
          username: 'user2',
          email: 'user2@example.com',
          role: UserRoleEnum.ADMIN,
        },
      ];
      (usersService.getUsers as jest.Mock).mockResolvedValue(mockUsers);

      const result = await controller.getUsers();

      expect(usersService.getUsers).toHaveBeenCalled();
      expect(result.statusCode).toBe(200);
      expect(result.data).toEqual([
        {
          id: '766f191e810c19729de860ea1',
          username: 'user1',
          email: 'user1@example.com',
          role: UserRoleEnum.CUSTOMER,
        },
        {
          id: '766f191e810c19729de860ea2',
          username: 'user2',
          email: 'user2@example.com',
          role: UserRoleEnum.ADMIN,
        },
      ]);
    });
  });

  describe('getUser', () => {
    it('should call usersService.findOne with userId and return success response', async () => {
      const mockUser: User = {
        id: '766f191e810c19729de860ea2' as unknown as ObjectId,
        username: 'user1',
        email: 'user1@example.com',
        role: UserRoleEnum.CUSTOMER,
      };
      (usersService.findOne as jest.Mock).mockResolvedValue(mockUser);

      const result = await controller.getUser('766f191e810c19729de860ea2');

      expect(usersService.findOne).toHaveBeenCalledWith({
        id: '766f191e810c19729de860ea2',
      });
      expect(result.statusCode).toBe(200);
      expect(result.data).toEqual(mockUser);
    });
  });

  describe('updateUser', () => {
    it('should call usersService.updateUser with userId and userDetails', async () => {
      const updateUserDto: UpdateUserDto = {
        username: 'newuser',
        role: UserRoleEnum.CUSTOMER,
      };

      const result = await controller.updateUser(
        '766f191e810c19729de860ea2',
        updateUserDto,
      );

      expect(usersService.updateUser).toHaveBeenCalledWith(
        updateUserDto,
        '766f191e810c19729de860ea2',
      );
      expect(result.statusCode).toBe(200);
      expect(result.message).toBe('User updated successfully');
    });
  });

  describe('deleteUser', () => {
    it('should call usersService.deleteUser with userId', async () => {
      const result = await controller.deleteUser('766f191e810c19729de860ea2');

      expect(usersService.deleteUser).toHaveBeenCalledWith(
        '766f191e810c19729de860ea2',
      );
      expect(result.statusCode).toBe(200);
      expect(result.message).toBe('User deleted successfully');
    });
  });
});
