import { BaseEntity } from "src/common/database/BaseEntity";
import { Column, Entity, JoinColumn, OneToOne } from "typeorm";
import { User } from "./user.entity";

@Entity('bugaltery')
export class Bugaltery extends BaseEntity {
    @OneToOne(() => User, (user) => user.bugaltery, { onDelete: 'CASCADE', onUpdate: 'CASCADE' })
    @JoinColumn({ name: 'user_id', referencedColumnName: 'id' })
    user: User;

    @Column()
    money: number;

    @Column({ type: 'date' , default: () => 'CURRENT_DATE' })
    date: Date;
}
