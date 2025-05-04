import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  BaseEntity,
} from "typeorm";
import { User } from "./user.entity";
import { PremiumPackage } from "./premiumPackage.entity";

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

  @CreateDateColumn()
  createdAt: Date;
}
