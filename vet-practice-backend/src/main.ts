import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Enable validation
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true, // Strip properties that don't have decorators
    transform: true, // Transform payloads to DTO instances
    forbidNonWhitelisted: true, // Throw errors if non-whitelisted values are provided
    transformOptions: {
      enableImplicitConversion: true, // Enable implicit type conversion
    },
  }));

  // Enable CORS
  app.enableCors();

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
