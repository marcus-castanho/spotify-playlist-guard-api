import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule, { cors: true });
  const config = new DocumentBuilder()
    .addServer(process.env.API_URL)
    .addBearerAuth({
      type: 'http',
      name: 'Authorization',
      description: 'Token for authentication of users and admin users',
    })
    .addApiKey({
      type: 'apiKey',
      name: 'Authorization',
      description: 'API Key for external app requests',
      in: 'header',
    })
    .setTitle('Spotify Playlist Guard API')
    .setDescription(
      'An API for interacting with the Spotify Playlist Guard application.',
    )
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );

  await app.listen(process.env.PORT);

  console.log({ port: process.env.PORT });
}
bootstrap();
