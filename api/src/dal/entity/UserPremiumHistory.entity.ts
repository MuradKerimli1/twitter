import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  BaseEntity,
  UpdateDateColumn,
} from "typeorm";
import { User } from "./user.entity";
import { PremiumPackage } from "./premiumPackage.entity";
import { PaymentStatus } from "../enums/paymentEnum";

@Entity()
export class UserPremiumHistory extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.premiumHistories, {
    onDelete: "CASCADE",
  })
  user: User;

  @ManyToOne(() => PremiumPackage, (pkg) => pkg.userPremiumHistories, {
    eager: true,
    onDelete: "SET NULL",
  })
  package: PremiumPackage;

  @Column({ type: "timestamp" })
  startedAt: Date;

  @Column({ type: "timestamp", nullable: true })
  expiredAt: Date;

  @Column({ type: "enum", enum: PaymentStatus, default: PaymentStatus.PENDING })
  paymentStatus: PaymentStatus;

  @Column({ nullable: true })
  currency: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

// @Column({ nullable: true })
// paymentId: string;

// @Column({ nullable: true })
// transactionId: string;

// @Column({ type: "decimal", precision: 10, scale: 2, nullable: true })
// amountPaid: number;
// @Column({ type: "json", nullable: true })
// paymentDetails: any;
