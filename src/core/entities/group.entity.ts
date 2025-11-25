import { BaseEntity } from 'src/common/database/BaseEntity';
import { Column, Entity, ManyToOne, JoinColumn } from 'typeorm';
import { Room } from './room.entity';

@Entity('groups')
export class Group extends BaseEntity {
  @Column()
  name: string;

  @Column({ type: 'timestamp' })
  start_time: Date;

  @Column({ type: 'timestamp' })
  end_time: Date;

  @Column({ type: 'date' })
  start_date: Date;

  @Column({ type: 'date' })
  end_date: Date;

  @ManyToOne(() => Room, (room) => room.groups)
  @JoinColumn({ name: 'room_id' })  
  room: Room;
}
