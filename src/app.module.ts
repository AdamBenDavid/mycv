import { MiddlewareConsumer, Module, ValidationPipe } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { ReportsModule } from './reports/reports.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './users/user.entity';
import { Reports } from './reports/reports.entity';
import { APP_PIPE } from '@nestjs/core';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmConfigService } from './config/typeorm.config';

const cookieSession = require('cookie-session');
const dbConfig = require('../ormconfig.js');

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `.env.${process.env.NODE_ENV}`,
    }),

    TypeOrmModule.forRootAsync({
      useClass: TypeOrmConfigService,
    }),
    UsersModule,
    ReportsModule,

    // TypeOrmModule.forRootAsync({
    //   inject: [ConfigService], //what tells dependency Injection system fin config info from chosen file, and access config service
    //   useFactory: (config: ConfigService) => {
    //     //dependency injection part

    //     return {
    //       //return the same object
    //       type: 'sqlite',
    //       database: config.get<string>('DB_NAME'),
    //       synchronize: true, //synchronize between entity and db (removes and adds -> mobifiys the db to suit the entitiy)->during development its nice but after deployment you must turn it to false because you can loose data
    //       entities: [User, Reports],
    //     };
    //   },
    // }),

    // TypeOrmModule.forRoot({
    //   type: 'sqlite',
    //   database: 'db.sqlite',
    //   // database: process.env.NODE_ENV === 'test' ? 'test.sqlite' : 'db.sqlite', //choosing between test db and dev db (for testing)
    //   entities: [User, Reports],
    //   synchronize: true,
    // }),

    UsersModule,
    ReportsModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_PIPE,
      useValue: new ValidationPipe({ whitelist: true }),
    }, //global pipe
  ],
})
//global middleware
export class AppModule {
  constructor(private configService: ConfigService) {}
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(
        cookieSession({
          keys: [this.configService.get('COOKIE_KEY')],
        }), //middleWare
      )
      .forRoutes('*'); //everySingle route in the application will get it.
  }
}
