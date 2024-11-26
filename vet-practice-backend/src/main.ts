import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe, ClassSerializerInterceptor } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  
  // Enable validation
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true, // Strip properties that don't have decorators
    transform: true, // Transform payloads to DTO instances
    forbidNonWhitelisted: true, // Throw errors if non-whitelisted values are provided
    transformOptions: {
      enableImplicitConversion: true, // Enable implicit type conversion
    },
  }));

  // Enable class-transformer
  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get('Reflector')));

  // Serve static files from uploads directory
  app.useStaticAssets(join(__dirname, '..', 'uploads'), {
    prefix: '/uploads/',
  });

  // Enable CORS
  app.enableCors();

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
