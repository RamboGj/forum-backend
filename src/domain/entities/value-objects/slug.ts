export class Slug {
    public value: Slug
    
    constructor(value: string) {
        this.value = Slug.createFromText(value)
    }

    /** 
        * Receives a string and normalize it as slug
        *
        * Example: "An example title" => "an-example-title"
        * 
        * @param text {string}
    **/
    static createFromText(text: string) {
        const slug = text
            .normalize("NFKD")
            .toLowerCase()
            .trim()
            .replace(/\s/g, "")
            .replace(/[^\w]/g, "")
            .replace(/_/g, "-")
            .replace(/--/g, "-")
            .replace(/-$/g, "")

        return new Slug(slug)
    }
}