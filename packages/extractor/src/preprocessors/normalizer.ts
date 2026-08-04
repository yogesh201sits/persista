export class TextNormalizer {
  normalize(text: string): string {
    return text
      .normalize("NFKC")
      .replace(/\u200B/g, "")
      .replace(/[“”]/g, '"')
      .replace(/[‘’]/g, "'");
  }
}