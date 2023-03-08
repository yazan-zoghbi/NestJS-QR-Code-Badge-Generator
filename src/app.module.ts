import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import databaseConfig from './config/database-config';
import { DatabaseModule } from './shared/database/database.module';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true, load: [databaseConfig] }), DatabaseModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
