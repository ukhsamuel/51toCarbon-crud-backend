import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { UserEntity } from '../entities/user.entity';
import { MongoRepository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { SignupDto } from '../dto/auth/signup.dto';
import { User } from '../utils/types/user';
import { ObjectId } from 'mongodb';
import { UpdateUserDto } from '../dto/user/update-user.dto';
import logger from '../utils/logger';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: MongoRepository<UserEntity>,
  ) {}

  async createUser(createUserDto: SignupDto): Promise<UserEntity> {
    try {
      return await this.userRepository.save({
        ...createUserDto,
        createdAt: new Date(),
      });
    } catch (error) {
      console.error('Error creating user:', error);
      logger.error(`An error occurred while creating user: ${error}`);
      throw new InternalServerErrorException('Failed to create user');
    }
  }

  async findOne(details): Promise<UserEntity> {
    try {
      //if details is an object and contains an id, we will use it to find the user
      if (details.id) {
        if (!ObjectId.isValid(details.id)) {
          throw new BadRequestException('Invalid user ID format');
        }
        // Convert the id to an ObjectId for MongoDB query
        details._id = new ObjectId(details.id);
        // Remove the original id property to avoid conflicts
        delete details.id;
      }

      return await this.userRepository.findOne({
        where: {
          ...details,
        },
      });
    } catch (error) {
      console.error('Error finding user:', error);
      logger.error(`An error occurred while finding user: ${error}`);
      throw new BadRequestException('Failed to retrieve user');
    }
  }

  async getUsers(): Promise<User[]> {
    try {
      const usersResponse = await this.userRepository.find();

      const users: User[] = usersResponse.map((user) => ({
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
      }));

      return users;
    } catch (error) {
      console.error('Error fetching users:', error);
      logger.error(`An error occurred while getting all users: ${error}`);
      throw new BadRequestException('Failed to fetch users');
    }
  }

  async updateUser(userDetails: UpdateUserDto, requestedUserId: string) {
    try {
      if (!ObjectId.isValid(requestedUserId)) {
        throw new BadRequestException('Invalid user ID');
      }

      const user: UserEntity = await this.findOne({ id: requestedUserId });

      if (!user) {
        throw new NotFoundException('User does not exist');
      }

      const newUserDetails = {
        username: userDetails.username,
        role: userDetails.role,
        updatedAt: new Date(),
      };

      await this.userRepository.update(
        { id: new ObjectId(requestedUserId) },
        newUserDetails,
      );
    } catch (error) {
      console.error('Error updating user:', error);
      logger.error(`An error occurred while updating user: ${error}`);
      throw new BadRequestException('Failed to update user');
    }
  }

  async deleteUser(userId: string) {
    try {
      if (!ObjectId.isValid(userId)) {
        throw new BadRequestException('Invalid user ID');
      }

      const user = await this.findOne({ id: userId });

      if (!user) {
        throw new NotFoundException('User does not exist');
      }

      await this.userRepository.delete({ id: new ObjectId(userId) });
    } catch (error) {
      console.error('Error deleting user:', error);
      logger.error(`An error occurred while deleting user: ${error}`);
      throw new BadRequestException('Failed to delete user');
    }
  }
}
