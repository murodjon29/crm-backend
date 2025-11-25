import { BaseEntity } from "src/common/database/BaseEntity";
import { Column, Entity, OneToOne } from "typeorm";
import { TeacherAvatar } from "./teacher-avatar.entity";
import { ROLES } from "src/common/enum";

@Entity('teachers')
export class Teacher extends BaseEntity {
    @Column()
    fullName: string;

    @Column({ unique: true })
    phone: string;

    @Column()
    pasport: string;

    @Column({ unique: true })
    email: string;

    @Column()
    password: string;

    @Column({ nullable: true })
    bio?: string;

    @Column({ default: false })
    isVerified: boolean;

    @OneToOne(() => TeacherAvatar, (avatar) => avatar.teacher, { onDelete: 'CASCADE' , onUpdate: 'CASCADE' })
    avatar: TeacherAvatar;

    @Column({ enum: ROLES, type: 'enum',  default: ROLES.TEACHER })
    role: ROLES;
}
