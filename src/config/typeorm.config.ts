import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';

@Injectable()
export class TypeOrmConfigService implements TypeOrmOptionsFactory {
  constructor(private configService: ConfigService) {}

  createTypeOrmOptions(): TypeOrmModuleOptions | Promise<TypeOrmModuleOptions> {
    return {
      type: 'sqlite',
      synchronize: process.env.NODE_ENV === 'test' ? true : false,
      database: this.configService.get<string>('DB_NAME'),
      autoLoadEntities: true,
      migrationsRun: process.env.NODE_ENV === 'test' ? true : false,
      keepConnectionAlive: process.env.NODE_ENV === 'test' ? true : false,
    };
  }
}
