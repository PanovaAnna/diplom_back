export function toEscapeMSg(str: string): string {
    if (str)
        return str
            .replace(/_/gi, "\\_")
            .replace(/-/gi, "\\-")
            .replace("~", "\\~")
            .replace(/`/gi, "\\`")
            .replace(/\./g, "\\.");
}