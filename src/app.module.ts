import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './modules/auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from './modules/users/user.module';
import { CaseModule } from './modules/case/case.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, envFilePath: "./config/.env.dev" }),
    MongooseModule.forRoot(process.env.MONGO_URL!),
    AuthModule,
    UserModule,
    CaseModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
}
