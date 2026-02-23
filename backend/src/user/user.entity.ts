import { UserRole } from 'src/enum';
import {
  Entity,
  Column,
  AfterInsert,
  AfterRemove,
  AfterUpdate,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;

  @Column()
  name: string;

  @Column()
  password: string;

  @Column({ nullable: true, select: true })
  refreshToken?: string;

  @Column({ nullable: true, select: true })
  resetToken?: string;

  @Column({ type: 'timestamp', nullable: true })
  resetTokenExpiry?: Date;

  @Column({ type: 'enum', enum: UserRole, default: UserRole.USER })
  role: UserRole;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @AfterInsert()
  logInsert() {
    console.log('Inserted user with id', this.id);
  }

  @AfterRemove()
  logRemove() {
    console.log('Removed user with id', this.id);
  }

  @AfterUpdate()
  logUpdate() {
    console.log('UPdated user with id', this.id);
  }
}
