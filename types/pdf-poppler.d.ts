declare module "pdf-poppler" {
  interface ConvertOptions {
    format?: "jpeg" | "png";
    out_dir: string;
    out_prefix?: string;
    page?: number;
    resolution?: number;
  }

  export class PdfConverter {
    constructor(filePath: string);
    convert(options: ConvertOptions): Promise<string[]>;
  }

  const _default: {
    PdfConverter: typeof PdfConverter;
  };

  export default _default;
}
