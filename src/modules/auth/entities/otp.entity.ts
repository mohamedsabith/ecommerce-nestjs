import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Otp {
  @PrimaryGeneratedColumn('uuid')
  id: number;

  @Column()
  otpValue: number;

  @Column({ type: 'bigint' })
  phoneNumber: number;

  @Column()
  expiresAt: Date;

  @Column({ default: 0 })
  otpSendCount: number;

  @Column({ default: new Date() })
  lastOtpSendDate: Date;

  @Column({ default: false })
  isBlocked: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
