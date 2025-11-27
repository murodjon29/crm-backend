import { BaseEntity } from "src/common/database/BaseEntity";
import { ROLES } from "src/common/enum";
import { Column, Entity, OneToOne } from "typeorm";
import { Student } from "./student.entity";
import { Teacher } from "./teacher.entity";

@Entity('users')
export class User extends BaseEntity {
    @Column()
    FIO: string;

    @Column({ unique: true })
    email: string;

    @Column()
    password: string;

    @Column({ unique: true})
    phone: string;

    @Column({ default: false })
    isAdmin: boolean;

    @Column({ default: true })
    isActive: boolean;

    @Column({ nullable: true })
    avatar: string;

    @Column({ nullable: true })
    passport: string;

    @Column({ default: false })
    isVerified: boolean;

    @Column({ type: 'enum', enum: ROLES, default: ROLES.USER })
    role: ROLES

    @OneToOne(() => Student, (student) => student.user)
    student: Student;

    @OneToOne(() => Teacher, (teacher) => teacher.user)
    teacher: Teacher;

    @OneToOne(() => Teacher, (teacher) => teacher.user)
    bugaltery: Teacher;
}
