import { Module } from '@nestjs/common';
import { CollectionController } from './collection.controller';
import { CollectionService } from './collection.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CollectionEntity } from './entity/collection.entity';
import { AuthModule } from '../auth/auth.module';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from '../auth/jwtStrategy';
import { env } from 'process';
require("dotenv").config();
@Module({
  imports:[TypeOrmModule.forFeature([CollectionEntity]), AuthModule,
  PassportModule.register({ defaultStrategy: 'jwt' }),
  JwtModule.register({

    secret:env.JWT_SECRET,
    signOptions: { expiresIn: '1h' },
  }),],
  controllers: [CollectionController],
  providers: [CollectionService]
})
export class CollectionModule {}
