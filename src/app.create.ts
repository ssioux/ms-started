import { INestApplication, ValidationPipe, VersioningType } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import { GlobalExceptionFilter } from './common/error-handler/global-exception.filter';
import { json, urlencoded } from 'express';
// import { writeFileSync } from 'fs';

export function appCreate(app: INestApplication, configService: ConfigService) {
  const appName: string = configService.get<string>('app.name') ?? 'appName';
  const appDescription: string = configService.get<string>('app.description') ?? 'appDescription';
  const appVersion: string = configService.get<string>('app.version') ?? '1';

  // * Versioning Type
  app.enableVersioning({
    defaultVersion: appVersion,
    type: VersioningType.URI,
  });

  // * Custom Exception Filter
  app.useGlobalFilters(new GlobalExceptionFilter());

  // * DTO validations
  app.useGlobalPipes(
    new ValidationPipe({ disableErrorMessages: false, whitelist: true }),
  );

  // * json legth limit
  app.use(json({ limit: '10mb' }));
  app.use(urlencoded({ limit: '10mb', extended: true }));

  // * Swagger
  const swaggerCfg = new DocumentBuilder()
    .setTitle(appName)
    .setDescription(appDescription)
    .setVersion(appVersion)
    .build();
  const document = SwaggerModule.createDocument(app, swaggerCfg);

  // writeFileSync('./swagger-emcs.json', JSON.stringify(document, null, 2));
  SwaggerModule.setup('swagger', app, document);
}
