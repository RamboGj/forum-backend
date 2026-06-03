import { UniqueEntityID } from "@/core/entities/unique-entity-id"
import { Optional } from "@/core/types/optional"
import { Comment, CommentProps } from "./comment"

export interface QuestionCommentProps extends CommentProps {
    answerId: UniqueEntityID
}

export class QuestionComment extends Comment<QuestionCommentProps> {
    get answerId() {
        return this.props.answerId
    }

    static create(props: Optional<QuestionCommentProps, 'createdAt'>, id?: UniqueEntityID) {
        const questionComment = new QuestionComment({
            ...props,
            createdAt: props.createdAt ?? new Date()
        }, id)
    
        return questionComment
    }
}