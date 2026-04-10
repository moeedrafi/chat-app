import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppService } from 'src/app.service';
import { AppController } from 'src/app.controller';
import { UserModule } from 'src/user/user.module';
import { AuthModule } from 'src/auth/auth.module';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { FriendRequestModule } from './friend-request/friend-request.module';
import { ConversationModule } from './conversation/conversation.module';
import { ConversationParticipantModule } from './conversation-participant/conversation-participant.module';
import { MessageModule } from './message/message.module';
import { MailerModule } from '@nestjs-modules/mailer';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      autoLoadEntities: true,
      synchronize: true,
      url: process.env.DATABASE_URL,
      ssl: { rejectUnauthorized: false },
      extra: { max: 5 },
    }),
    MailerModule.forRoot({
      transport: {
        port: 587,
        secure: false,
        host: process.env.HOST,
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
      },
    }),
    UserModule,
    AuthModule,
    FriendRequestModule,
    ConversationModule,
    ConversationParticipantModule,
    MessageModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
  ],
})
export class AppModule {}
