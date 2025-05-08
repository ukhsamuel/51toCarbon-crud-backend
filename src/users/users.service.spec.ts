import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { UserEntity } from '../entities/user.entity';
import { ObjectId, Repository } from 'typeorm';
import { UserRoleEnum } from '../utils/enums/roles.enum';
import { User } from 'src/utils/types/user';
import { BadRequestException } from '@nestjs/common';

describe('UsersService', () => {
  let usersService: UsersService;
  let userRepository: MockType<Repository<UserEntity>>;

  type MockType<T> = {
    [P in keyof T]?: T[P] extends (...args: infer A) => infer R
      ? jest.Mock<R, A>
      : T[P];
  };
  const mockRepository = (): MockType<Repository<UserEntity>> => ({
    findOne: jest.fn(),
    find: jest.fn(),
    save: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  });
  const mockUserEntity = () => ({
    id: '766f191e810c19729de860ea' as unknown as ObjectId,
    username: 'testuser',
    email: 'test@example.com',
    password: 'password',
    role: UserRoleEnum.CUSTOMER,
    createdAt: new Date(),
  });
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(UserEntity),
          useFactory: mockRepository,
        },
      ],
    }).compile();

    usersService = module.get<UsersService>(UsersService);
    userRepository = module.get(getRepositoryToken(UserEntity));
  });

  it('should be defined', () => {
    expect(usersService).toBeDefined();
  });

  describe('getUsers', () => {
    it('should retrieve all users', async () => {
      const mockUsers: UserEntity[] = [
        mockUserEntity(),
        {
          id: '507f191e810c19729de86033' as unknown as ObjectId,
          username: 'user2',
          email: 'user2@example.com',
          password: 'password',
          role: UserRoleEnum.ADMIN,
          createdAt: new Date(),
        },
      ];
      const expectedUsers: User[] = [
        {
          id: '766f191e810c19729de860ea' as unknown as ObjectId,
          username: 'testuser',
          email: 'test@example.com',
          role: UserRoleEnum.CUSTOMER,
        },
        {
          id: '507f191e810c19729de86033' as unknown as ObjectId,
          username: 'user2',
          email: 'user2@example.com',
          role: UserRoleEnum.ADMIN,
        },
      ];

      (userRepository.find as jest.Mock).mockResolvedValue(mockUsers);

      const result = await usersService.getUsers();
      expect(userRepository.find).toHaveBeenCalled();
      expect(result).toEqual(expectedUsers);
    });

    it('should throw BadRequestException on error', async () => {
      (userRepository.find as jest.Mock).mockRejectedValue(
        new Error('Failed to fetch'),
      );

      await expect(usersService.getUsers()).rejects.toThrowError(
        BadRequestException,
      );
    });
  });

  describe('findOne', () => {
    it('should find a user by ID', async () => {
      const userId = '766f191e810c19729de860ea';
      const foundUser: UserEntity = mockUserEntity();

      (userRepository.findOne as jest.Mock).mockResolvedValue(foundUser);

      const result = await usersService.findOne({ id: userId });
      expect(result).toEqual(foundUser);
    });

    it('should find a user by other criteria', async () => {
      const email = 'test@example.com';
      const foundUser: UserEntity = mockUserEntity();

      (userRepository.findOne as jest.Mock).mockResolvedValue(foundUser);

      const result = await usersService.findOne({ email });
      expect(userRepository.findOne).toHaveBeenCalledWith({ where: { email } });
      expect(result).toEqual(foundUser);
    });

    it('should throw BadRequestException for invalid ID format', async () => {
      const invalidId = 'invalid-id-format';

      await expect(
        usersService.findOne({ id: invalidId }),
      ).rejects.toThrowError(BadRequestException);
      expect(userRepository.findOne).not.toHaveBeenCalled();
    });

    it('should throw InternalServerErrorException on error', async () => {
      (userRepository.findOne as jest.Mock).mockRejectedValue(
        new Error('Failed to find'),
      );

      await expect(
        usersService.findOne({ email: 'test@example.com' }),
      ).rejects.toThrowError(BadRequestException);
    });
  });
});
