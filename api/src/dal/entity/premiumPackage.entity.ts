import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BaseEntity,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";
import { UserPremiumHistory } from "./UserPremiumHistory.entity";
import { Currency } from "../enums/currencyEnum";

@Entity()
export class PremiumPackage extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  name: string;

  @Column({ type: "int" })
  durationInDays: number;

  @Column("simple-array")
  features: string[];

  @Column({ type: "decimal", precision: 10, scale: 2 })
  price: number;

  @Column({ type: "enum", enum: Currency, default: Currency.AZN })
  currency: Currency;

  @Column({ type: "text", nullable: true })
  description: string;

  @OneToMany(() => UserPremiumHistory, (uph) => uph.package)
  userPremiumHistories: UserPremiumHistory[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
