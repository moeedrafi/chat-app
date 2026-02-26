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
export class ConversationParticipant {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Conversation, (conversation) => conversation.participants)
  @JoinColumn({ name: 'conversation_id' })
  conversation: Conversation;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ type: 'boolean', default: true })
  active: boolean;

  @CreateDateColumn()
  joined_at: Date;
}
