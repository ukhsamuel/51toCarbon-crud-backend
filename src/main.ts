import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { useContainer } from 'class-validator';
import { ValidationPipe } from '@nestjs/common';
import {
  DocumentBuilder,
  SwaggerDocumentOptions,
  SwaggerModule,
} from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  app.setGlobalPrefix('api/v1');
  app.useGlobalPipes(new ValidationPipe({ disableErrorMessages: false }));
  useContainer(app.select(AppModule), { fallbackOnErrors: true });

  const options: SwaggerDocumentOptions = {
    operationIdFactory: (methodKey: string) => methodKey,
  };
  const config = new DocumentBuilder()
    .setTitle('User CRUD V1')
    .setDescription('User CRUD V1 API description')
    .setVersion('1.0')
    .addTag('userCrud')
    .addBearerAuth(
      { type: 'http', scheme: 'bearer', bearerFormat: 'JWT', in: 'header' },
      'Authorization',
    )
    .build();
  const document = SwaggerModule.createDocument(app, config, options);
  SwaggerModule.setup('api', app, document);

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
