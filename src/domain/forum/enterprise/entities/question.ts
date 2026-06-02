import { UniqueEntityID } from "@/core/entities/unique-entity-id"
import { Slug } from "./value-objects/slug"
import dayjs from "dayjs"
import { Optional } from "@/core/types/optional"
import { Entity } from "@/core/entities/entity"

export interface QuestionProps {
    authorId: UniqueEntityID
    bestAnswerId?: UniqueEntityID | undefined
    title: string
    content: string 
    slug: Slug
    createdAt: Date
    updatedAt?: Date
}

export class Question extends Entity<QuestionProps> {
    get content() {
        return this.props.content
    }

    get bestAnswerId() {
        return this.props.bestAnswerId
    }

    get title() {
        return this.props.title
    }

    get slug() {
        return this.props.slug
    }

    get authorId() {
        return this.props.authorId
    }

    get createdAt() {
        return this.props.createdAt
    }

    get updatedAt() {
        return this.props.createdAt
    }

    get isNew(): boolean {
        return dayjs().diff(this.createdAt, "days") <= 3
    }

    get excerpt() {
        return this.props.content.substring(0, 120).trim().concat("...")
    }

    private touch() {
        this.props.updatedAt = new Date()
    }

    set content(content: string) {
        this.props.content = content
        this.touch()
    }

    set title(title: string) {
        this.props.title = title
        this.props.slug = Slug.createFromText(title)
        this.touch()
    }

    set bestAnswerId(bestAnswerId: UniqueEntityID | undefined) {
        this.props.bestAnswerId = bestAnswerId
        this.touch()
    }
    

    static create(props: Optional<QuestionProps, 'createdAt' | 'slug'>, id?: UniqueEntityID) {
        const question = new Question({
            ...props,
            slug: props.slug ?? Slug.createFromText(props.title),
            createdAt: new Date()
        }, id)

        return question
    }
}
