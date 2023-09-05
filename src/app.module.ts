import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './modules/auth/auth.module';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { CollectionModule } from './modules/collection/collection.module';



@Module({
  imports: [ TypeOrmModule.forRoot({
    type: 'sqlite',
    database: 'database.sqlite', // SQLite database file
    entities: [__dirname + '/**/*.entity{.ts,.js}'],
    synchronize: true,
  }),
  PassportModule.register({ defaultStrategy: 'jwt' }),
  JwtModule.register({
    secret: 'yourSecretKey', // Replace with your own secret key
    signOptions: { expiresIn: '1h' }, // Token expiration time
  }),
  AuthModule,
  CollectionModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
