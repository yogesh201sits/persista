export class SentenceSplitter {
  split(text: string): string[] {
    return text
      .split(/[.!?\n]+/)
      .map((sentence) => sentence.trim())
      .filter(Boolean);
  }
}
