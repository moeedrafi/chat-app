import {
  BeforeInsert,
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';

@Entity()
@Unique(['friendshipKey'])
export class Friend {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  friendshipKey: string;

  @Column()
  userAId: number;

  @Column()
  userBId: number;

  @CreateDateColumn()
  created_at: Date;

  @BeforeInsert()
  generateFriendshipKey() {
    const ids = [this.userAId, this.userBId].sort((a, b) => a - b);
    this.friendshipKey = `${ids[0]}_${ids[1]}`;
  }
}
