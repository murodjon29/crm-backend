import { BaseEntity } from 'src/common/database/BaseEntity';
import { Room_STATUS } from 'src/common/enum';
import { Column, Entity, OneToMany } from 'typeorm';
import { Group } from './group.entity';

@Entity('rooms')
export class Room extends BaseEntity {
  @Column()
  number: string;

  @Column()
  width: number;

  @Column({ type: 'enum', enum: Room_STATUS, default: Room_STATUS.AVAILABLE })
  status: Room_STATUS;

  @OneToMany(() => Group, (group) => group.room)
  groups: Group[];
}
