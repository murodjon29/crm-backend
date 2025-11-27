import { BaseEntity } from "src/common/database/BaseEntity";
import { Column, Entity, OneToMany } from "typeorm";
import { Group } from "./group.entity";

@Entity('courses')
export class Courses extends BaseEntity {
    @Column()
    name: string;

    @Column()
    date: Date;

    @Column()
    price: number;


    @OneToMany(() => Group, (group) => group.course, { onDelete: 'CASCADE', onUpdate: 'CASCADE' })
    groups: Group[];

    
}
