import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { ConversationParticipant } from 'src/conversation-participant/conversation-participant.entity';

@Entity()
export class Conversation {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @OneToMany(
    () => ConversationParticipant,
    (participant) => participant.conversation,
    { cascade: true },
  )
  participants: ConversationParticipant[];

  @OneToMany(() => Message, (message) => message.conversation, {
    cascade: true,
  })
  messages: Message[];

  @Column({ type: 'timestamp', nullable: true })
  last_active: Date;
}
