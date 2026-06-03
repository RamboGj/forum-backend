export class NotAllowed extends Error {
    constructor() {
        super("Not allowed to delete other author entity")
    }
}