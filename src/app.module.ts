import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import * as _ from 'lodash';
import { TypeOrmModule } from '@nestjs/typeorm';
import configuration from 'config/app-configuration';
import { CommonModule } from './common/basic-resource/common.module';

// ⚠️ Current execution Enviroment
export const ENV = process.env.NODE_ENV;
@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
      load: [configuration],
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        return {
          type: 'mysql',
          synchronize: configService.get('database.synchronize'),
          port: configService.get('database.port'),
          username: configService.get('database.user'),
          password: configService.get('database.password'),
          host: configService.get('database.host'),
          database: configService.get('database.name'),
          entities: [],
        };
      },
    }),
    CommonModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule { }
