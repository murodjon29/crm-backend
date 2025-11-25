import { BaseEntity } from "src/common/database/BaseEntity";
import { Column, Entity, JoinColumn, OneToOne } from "typeorm";
import { Teacher } from "./teacher.entity";

@Entity('teacher_avatars')
export class TeacherAvatar extends BaseEntity {
    @Column()
    image_url: string;

    @OneToOne(() => Teacher, (teacher) => teacher.avatar)
    @JoinColumn({ name: 'teacher_id' , referencedColumnName: 'id' })
    teacher: Teacher;
}