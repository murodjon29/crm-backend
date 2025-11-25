import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { ServeStaticModule } from '@nestjs/serve-static';
import { resolve } from 'path';
import { CacheModule } from '@nestjs/cache-manager';
import { StudentsModule } from './students/students.module';
import { TeachersModule } from './teachers/teachers.module';
import { GroupsModule } from './groups/groups.module';
import { RoomModule } from './room/room.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),

    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        url: config.get<string>('DEV_DB_URL'),
        autoLoadEntities: true,
        synchronize: true,
      }),
    }),

    ServeStaticModule.forRoot({
      rootPath: resolve(__dirname, '..', '..', 'uploads'),
      serveRoot: '/uploads',
    }),

    CacheModule.register({ isGlobal: true, ttl: 300 }),

    JwtModule.registerAsync({
      global: true,
      useFactory: () => ({
        secret: 'secret-key',
        signOptions: { expiresIn: '7d' },
      }),
    }),

    StudentsModule,

    TeachersModule,

    GroupsModule,

    RoomModule,
  ],
})
export class AppModule {}
