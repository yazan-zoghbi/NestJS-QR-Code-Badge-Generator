import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    ConfigModule,
    MongooseModule.forRootAsync({
      useFactory: async (configService: ConfigService) => {
        const dbHost = configService.get<string>('database.host');
        const dbPort = configService.get<number>('database.port');
        const dbName = configService.get<string>('database.name');
        
        return {
          uri: `mongodb://${dbHost}:${dbPort}/${dbName}`,
        };
      },
      inject: [ConfigService],
    }),
  ],
})
export class DatabaseModule {}
