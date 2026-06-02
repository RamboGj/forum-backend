import { Entity } from "../../core/entities/entity"

interface StudentProps {
    name: string
}
export class Student extends Entity<StudentProps> {
    constructor(props: StudentProps, id?: string) {
        super(props, id)
    }
}