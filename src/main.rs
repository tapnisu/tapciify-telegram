use image::imageops::FilterType;
use tapciify::{
    AsciiArtConverter, AsciiArtConverterOptions, CustomRatioResize, DEFAULT_ASCII_STRING,
    DEFAULT_FONT_RATIO,
};
use teloxide::prelude::*;
use teloxide::types::{ParseMode, PhotoSize};

use crate::escape_markdown::EscapeMarkdownV2;

mod escape_markdown;

#[tokio::main]
async fn main() {
    pretty_env_logger::init();
    log::info!("Starting...");

    let bot = Bot::from_env();

    teloxide::repl(bot, |bot: Bot, msg: Message| async move {
        let photo_size = match msg.photo() {
            Some(photo_size) => photo_size[0].to_owned(),
            None => return Ok(()),
        };

        let options = AsciiArtConverterOptions {
            ascii_string: DEFAULT_ASCII_STRING.to_string(),
            colored: false,
        };

        match send_ascii_art(&bot, &msg, &photo_size, &options).await {
            Ok(message) => message,
            Err(err) => bot.send_message(msg.chat.id, err.to_string()).await?,
        };

        Ok(())
    })
    .await;
}

/// Convert photo into ASCII art and send it
async fn send_ascii_art(
    bot: &Bot,
    msg: &Message,
    photo_size: &PhotoSize,
    options: &AsciiArtConverterOptions,
) -> anyhow::Result<Message> {
    let file = bot.get_file(photo_size.file.id.to_owned()).await?;
    let bytes = reqwest::get(format!(
        "https://api.telegram.org/file/bot{}/{}",
        bot.token(),
        file.path
    ))
    .await?
    .bytes()
    .await?;

    let img = image::load_from_memory(&bytes)?.resize_custom_ratio(
        Some(64),
        None,
        DEFAULT_FONT_RATIO,
        FilterType::Triangle,
    );

    let ascii_art = img.ascii_art(options)?;
    let msg_content = format!("```\n{}\n```", ascii_art.to_string().escape_markdown_v2());

    let message = bot
        .send_message(msg.chat.id, msg_content)
        .parse_mode(ParseMode::MarkdownV2)
        .await?;

    Ok(message)
}
