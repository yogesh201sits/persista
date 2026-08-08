export class TextCleaner {
  clean(text: string): string {
    return text
      .trim()
      .replace(/\r\n/g, "\n")
      .replace(/[ \t]+/g, " ")
      .replace(/\n{2,}/g, "\n");
  }
}
