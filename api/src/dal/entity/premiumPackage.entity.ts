import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";

enum PremiumPackageType {
  BASIC = "basic",
  PREMIUM = "premium",
}

enum DurationUnit {
  DAY = "day",
  MONTH = "month",
  YEAR = "year",
}

@Entity()
export class PremiumPackage {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  price: number;

  @Column("simple-array")
  features: string[];

  @Column({ type: "enum", enum: PremiumPackageType })
  type: PremiumPackageType;

  @Column({ type: "int" })
  duration: number;

  @Column({ type: "enum", enum: DurationUnit, default: DurationUnit.MONTH })
  durationUnit: DurationUnit;

  @Column({ default: true })
  isActive: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
