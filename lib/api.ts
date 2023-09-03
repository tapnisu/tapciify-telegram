export interface AsciiArt {
  asciiArt: string;
  width: number;
  heigth: number;
}

export interface ConvertResult {
  data: AsciiArt[];
}

export interface AsciiCharacter {
  character: string;
  r: number;
  g: number;
  b: number;
  a: number;
}

export interface RawAsciiArt {
  characters: AsciiCharacter[];
  width: number;
  heigth: number;
}

export interface RawConvertResult {
  data: RawAsciiArt[];
}

export class TapciifyApi {
  baseUrl: string;

  constructor(baseUrl = "https://tapciify-api.shuttleapp.rs/api/v1") {
    this.baseUrl = baseUrl;
  }

  async convert(
    file: Blob,
    width = 0,
    height = 0,
    asciiString = " .,:;+*?%S#@",
    fontRatio = 0.36
  ): Promise<ConvertResult> {
    const formData = new FormData();
    formData.append("blob", file, "img");

    const req = await fetch(
      `${
        this.baseUrl
      }/convert?width=${width}&height=${height}&fontRatio=${fontRatio}&asciiString=${encodeURIComponent(
        asciiString
      )}`,
      {
        method: "POST",
        body: formData,
      }
    );

    return await req.json();
  }

  async convertRaw(
    file: Blob,
    width = 0,
    height = 0,
    asciiString = " .,:;+*?%S#@",
    fontRatio = 0.36
  ): Promise<RawConvertResult> {
    const formData = new FormData();
    formData.append("blob", file, "img");

    const req = await fetch(
      `${
        this.baseUrl
      }/convert/raw?width=${width}&height=${height}&fontRatio=${fontRatio}&asciiString=${encodeURIComponent(
        asciiString
      )}`,
      {
        method: "POST",
        body: formData,
      }
    );

    return await req.json();
  }
}
