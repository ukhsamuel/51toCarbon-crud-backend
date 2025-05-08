import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from '../entities/user.entity';
import { IsUserEmailAlreadyExistConstraint } from './validations/is-user-email-already-exist.decorator';
import { IsUsernameAlreadyExistConstraint } from './validations/is-username-already-exist.decorator';
import { UsersController } from './users.controller';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity])],
  providers: [
    UsersService,
    IsUserEmailAlreadyExistConstraint,
    IsUsernameAlreadyExistConstraint,
  ],
  exports: [UsersService],
  controllers: [UsersController],
})
export class UsersModule {}
