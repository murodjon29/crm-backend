import { BaseEntity } from "src/common/database/BaseEntity";
import { Column, Entity, JoinColumn, OneToOne } from "typeorm";
import { Student } from "./student.entity";

@Entity('student_avatars')
export class StudentAvatar extends BaseEntity {
    @Column()
    image_url: string

    @OneToOne(() => Student, (student) => student.avatar, { onDelete: 'CASCADE', onUpdate: 'CASCADE' })
    @JoinColumn({ name: 'student_id' , referencedColumnName: 'id' })
    student: Student;
}