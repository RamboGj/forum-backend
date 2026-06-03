export class NotAllowedToDeleteOtherAuthorEntity extends Error {
    constructor() {
        super("Not allowed to delete other author entity")
    }
}