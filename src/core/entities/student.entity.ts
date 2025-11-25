import { BaseEntity } from "src/common/database/BaseEntity";
import { Column, Entity, OneToOne } from "typeorm";
import { StudentAvatar } from "./student-avatar.entity";

@Entity('students')
export class Student extends BaseEntity {
    @Column()
    fullName: string;

    @Column()
    phone: string;

    @Column()
    pasport: string;

    @Column({ unique: true })
    email: string;

    @Column()
    password: string;

    @Column({ default: false })
    isVerified: boolean;

    @OneToOne(() => StudentAvatar, (avatar) => avatar.student, { onDelete: 'CASCADE' , onUpdate: 'CASCADE' })
    avatar: StudentAvatar;
}
