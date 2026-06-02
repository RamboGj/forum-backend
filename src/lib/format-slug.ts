
function formatSlug(title: string) {
    return title.toLowerCase().replace(/\s/g, "-")
}

formatSlug("Titulo da Publica;'ao nao se esqueca")