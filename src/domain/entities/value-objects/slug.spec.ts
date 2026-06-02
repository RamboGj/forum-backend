import { describe, expect, it } from "vitest";
import { Slug } from "./slug";

describe("Slug Value-Object", () => {
    it('shoul be able to create a new slug from text', () => {
        const slug = Slug.createFromText('Example question TiTLe')
        expect(slug.value).toEqual("example-question-title")
    })
})