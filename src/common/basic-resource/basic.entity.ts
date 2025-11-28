import {
  AfterLoad,
  CreateDateColumn,
  DeleteDateColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

export abstract class BasicEntity {
  @PrimaryGeneratedColumn('uuid')
  id?: string;

  @CreateDateColumn({
    name: 'created_at',
    select: false,
    type: 'timestamp',
  })
  createdAt: Date;

  @UpdateDateColumn({
    name: 'updated_at',
    select: false,
    type: 'timestamp',
  })
  updatedAt: Date;

  @DeleteDateColumn({
    name: 'deleted_at',
    type: 'timestamp',
  })
  deletedAt?: Date;

  /**
   * Computed value:
   * active is `true` if no deletedAt date is set
   */
  active?: boolean;

  @AfterLoad()
  setActive() {
    this.active = this.deletedAt === null;
    delete this.deletedAt;
  }
}
