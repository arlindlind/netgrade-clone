import {
  CreateDateColumn,
  UpdateDateColumn,
  Column,
  PrimaryGeneratedColumn,
  BeforeInsert,
  BeforeUpdate,
  VersionColumn,
} from 'typeorm';

import { AppInfoService } from '@/services/AppInfoService';

export abstract class BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  @VersionColumn()
  version!: number;

  @Column({ type: 'varchar', nullable: true })
  appInstanceId!: string;

  @BeforeInsert()
  async setCreationDefaults(): Promise<void> {
    this.appInstanceId = await this.generateAppInstanceId();
  }

  @BeforeUpdate()
  async updateDefaults(): Promise<void> {
    this.appInstanceId = await this.generateAppInstanceId();
  }

  private async generateAppInstanceId(): Promise<string> {
    const service = AppInfoService.getInstance();
    await service.initialize();
    return service.getAppInstanceId();
  }
}
