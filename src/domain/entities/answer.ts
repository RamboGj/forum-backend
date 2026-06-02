import { Entity } from "../../core/entities/entity"

interface AnswerProps {
    content: string
    questionId: string 
    authorId: string
}

export class Answer extends Entity<AnswerProps> {
    get content() {
        return this.props.content
    }

    constructor(props: AnswerProps, id?: string) {
        super(props, id)
    }
}