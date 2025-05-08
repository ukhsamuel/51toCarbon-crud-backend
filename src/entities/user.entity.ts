import { UserRoleEnum } from '../utils/enums/roles.enum';
import { Column, Entity, ObjectId, ObjectIdColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';

@Entity()
export class UserEntity {
  @ApiProperty({ type: String })
  @ObjectIdColumn()
  id?: ObjectId;
  @Column()
  username: string;
  @Column()
  email: string;
  @Exclude()
  @Column()
  password: string;
  @Column()
  role: UserRoleEnum;
  @Column()
  createdAt?: Date;
  @Column()
  updatedAt?: Date;
}
