import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';
import { LoggerFactory } from './common/logger/logger.factory';
import { appCreate } from './app.create';
import { ConfigService } from '@nestjs/config';


async function bootstrap() {
  // 🚀 Creating the app
  const app = await NestFactory.create(AppModule, { logger: LoggerFactory(bootstrap.name) });

  // 🛞 Getting ConfigService
  const configService = app.get<ConfigService>(ConfigService);

  // 🖬 App PORT from configService env
  const PORT = configService.get<number>('app.port') ?? 3000;

  // 🖬 App Name from configService env
  const appName = configService.get<string>('app.name') ?? 'appName';

  // 🚀 Using Custom Logger
  app.useLogger(LoggerFactory(appName));

  // 🖬 Logger for this file.
  const logger = new Logger(appName);

  // 🖬 middlewares for create the app.
  appCreate(app, configService);

  // 🚀 Running the app
  await app.listen(PORT, () => logger.log(` |  Running on Port: ${PORT}`));
  logger.log(` |  Swagger Docs at: http://localhost:${PORT}/swagger`);
}
bootstrap();