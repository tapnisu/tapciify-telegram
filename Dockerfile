FROM rust:1.79-alpine3.20 as builder
LABEL authors="tapnisu"

WORKDIR /usr/src/tapciify-telegram

RUN apk update \
    && apk upgrade --available \
    && apk add --no-cache alpine-sdk libressl-dev

COPY . .
RUN cargo build --release

FROM alpine:3.20 as runner

RUN apk update \
    && apk upgrade --available \
    && apk add --no-cache ca-certificates \
    && update-ca-certificates

COPY --from=builder /usr/src/tapciify-telegram/target/release/tapciify-telegram /usr/local/bin/tapciify-telegram

CMD ["tapciify-telegram"]
