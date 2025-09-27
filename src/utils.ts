export class CommonUtils {
  public static escapeMarkdown(input: string): string {
    return input.replaceAll("`", "\\`")
                .replaceAll("-", "\\-")
                .replaceAll("#", "\\#")
                .replaceAll("*", "\\*")
                .replaceAll("\\", "\\\\")
                .replaceAll(">", "\\>")
                .replaceAll("|", "\\|")
                .replaceAll("~", "\\~")
                .replaceAll("_", "\\_");
  }

  public static escapeOnlyBackticks(input: string): string {
    return input.replaceAll("`", "\\`");
  }
}