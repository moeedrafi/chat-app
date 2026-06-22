import {
  Column,
  Unique,
  Entity,
  BeforeInsert,
  CreateDateColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
@Unique(['requestKey'])
export class FriendRequest {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  requestKey: string;

  @Column()
  senderId: number;

  @Column()
  receiverId: number;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @BeforeInsert()
  generateRequestKey() {
    const ids = [this.senderId, this.receiverId].sort((a, b) => a - b);
    this.requestKey = `${ids[0]}_${ids[1]}`;
  }
}
