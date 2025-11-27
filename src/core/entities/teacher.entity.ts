import { BaseEntity } from "src/common/database/BaseEntity";
import { Column, Entity, OneToMany, OneToOne, JoinColumn } from "typeorm";
import { User } from "./user.entity";
import { Group } from "./group.entity";

@Entity('teachers')
export class Teacher extends BaseEntity {
    @OneToOne(() => User, (user) => user.teacher, { onDelete: 'CASCADE', onUpdate: 'CASCADE' })
    @JoinColumn({ name: 'user_id' })
    user: User;

    @Column()
    sv: string;

    @OneToMany(() => Group, (group) => group.teacher)
    groups: Group[];
}
