import { HttpStatus, Injectable, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import * as cookieParser from 'cookie-parser';
import * as express from 'express';
import { join } from 'path';

import { AppModule } from './app.module';
import { AllExceptionsFilter } from 'src/infrastructure/lib/exception/all.exception.filter';
import { config } from 'src/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

@Injectable()
export class AppService {
  public static async main(): Promise<void> {
    const app = await NestFactory.create(AppModule);

    app.useGlobalFilters(new AllExceptionsFilter());
    app.use(cookieParser());
    app.enableCors({ origin: '*' });

    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
        transform: true,
      }),
    );

    app.use('/uploads', express.static(join(process.cwd(), 'uploads')));

    // Swagger sozlamasi
    const configSwagger = new DocumentBuilder()
      .setTitle('Technoshop API')
      .setDescription('Technoshop API hujjatlari')
      .setVersion('1.0')
      .addBearerAuth()
      .build();

    const document = SwaggerModule.createDocument(app, configSwagger);
    SwaggerModule.setup('api/v1', app, document, {
      swaggerOptions: { persistAuthorization: true },
    });

    await app.listen(config.API_PORT, () => {
      console.log('✅ Server running on port ' + config.API_PORT);
      console.log(`✅ Swagger: http://localhost:${config.API_PORT}/api/v1`);
    });

  }
}
