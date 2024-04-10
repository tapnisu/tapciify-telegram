pub trait EscapeMarkdownV2 {
    /// Escapes Telegrams Markdown V2 characters
    ///
    /// ```
    /// use tapciify_telegram::escape_markdown::EscapeMarkdownV2;
    ///
    /// let result = "*Hello world!*".to_owned().escape_markdown_v2();
    ///
    /// assert_eq!(result, "\\*Hello world\\!\\*".to_owned());
    /// ```
    fn escape_markdown_v2(&self) -> String;
}

impl EscapeMarkdownV2 for String {
    fn escape_markdown_v2(&self) -> String {
        self.chars()
            .map(|x| match x {
                '_' | '*' | '[' | ']' | '(' | ')' | '~' | '`' | '>' | '#' | '+' | '-' | '='
                | '|' | '{' | '}' | '.' | '!' => format!("\\{x}"),
                _ => x.to_owned().to_string(),
            })
            .collect()
    }
}
