import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Message } from 'src/message/message.entity';
import { MessageService } from 'src/message/message.service';
import { MessageController } from 'src/message/message.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Message])],
  controllers: [MessageController],
  providers: [MessageService],
})
export class MessageModule {}
