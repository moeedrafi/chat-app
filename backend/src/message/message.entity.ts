import { User } from 'src/user/user.entity';
import { Conversation } from 'src/conversation/conversation.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Message {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'sender_id' })
  sender: User;

  @ManyToOne(() => Conversation, (conversation) => conversation.messages)
  @JoinColumn({ name: 'conversation_id' })
  conversation: Conversation;

  @Column('text')
  message: string;

  @Column({ type: 'enum', enum: ['sent', 'read'], default: 'sent' })
  status: 'sent' | 'read';

  @Column({ type: 'timestamp', nullable: true })
  seen_at: Date;

  @CreateDateColumn()
  created_at: Date;
}
