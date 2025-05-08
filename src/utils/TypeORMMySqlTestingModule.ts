import { TypeOrmModule } from '@nestjs/typeorm';

export const TypeORMMySqlTestingModule = (entities: any[]) =>
  TypeOrmModule.forRoot({
    type: 'mongodb',
    host: process.env.MYSQL_HOST || 'localhost',
    port: 3306,
    username: process.env.MYSQL_USERNAME || 'nest',
    password: process.env.MYSQL_PASSWORD || 'nest',
    database: process.env.MYSQL_DATABASE || 'test',
    entities: [...entities],
    synchronize: true,
  });
