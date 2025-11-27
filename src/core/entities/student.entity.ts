import { BaseEntity } from "src/common/database/BaseEntity";
import { Column, Entity, OneToOne } from "typeorm";
import { User } from "./user.entity";
import { STUDENT_STATUS } from "src/common/enum";

@Entity('students')
export class Student extends BaseEntity {

    @OneToOne(() => User, (user) => user.student, { onDelete: 'CASCADE', onUpdate: 'CASCADE' })
    user: User;

    @Column()
    startDate: Date;

    @Column()
    endDate: Date;

    @Column({ type: 'enum', enum: STUDENT_STATUS, default: STUDENT_STATUS.ACTIVE })
    status: STUDENT_STATUS;
}
