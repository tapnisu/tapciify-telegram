FROM rust:1.77 as builder
LABEL authors="tapnisu"

WORKDIR /usr/src/tapciify-telegram
COPY . .
RUN cargo build --release

FROM debian:bookworm-slim

RUN apt-get update && apt-get install -y openssl && rm -rf /var/lib/apt/lists/*
COPY --from=builder /usr/src/tapciify-telegram/target/release/tapciify-telegram /usr/local/bin/tapciify-telegram

CMD ["tapciify-telegram"]
