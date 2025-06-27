import path from "path";
import fs from "fs/promises";
import sharp from "sharp";
import { PdfConverter } from "pdf-poppler";

type File = {
  id: string;
  name: string;
  type: string;
  filePath?: string;
};

export async function getThumbnailPreview(
  file: File
): Promise<string | undefined> {
  const filePath = file.filePath;
  if (!filePath || !(file.name && file.type)) return;

  const ext = path.extname(file.name).toLowerCase();
  const fileHash = `${file.id}`;
  const thumbDir = path.join(process.cwd(), "public", "thumbnails");
  const thumbPath = path.join(thumbDir, `${fileHash}.webp`);

  try {
    await fs.access(thumbPath);
    return `/thumbnails/${fileHash}.webp`;
  } catch {
    // continue to generate
  }

  try {
    await fs.mkdir(thumbDir, { recursive: true });

    if ([".jpg", ".jpeg", ".png", ".webp"].includes(ext)) {
      await sharp(filePath).resize(120, 120).toFormat("webp").toFile(thumbPath);
    } else if (ext === ".pdf") {
      const converter = new PdfConverter(filePath);
      const outputFiles = await converter.convert({
        format: "jpeg",
        out_dir: thumbDir,
        out_prefix: fileHash,
        page: 1,
        resolution: 100,
      });

      if (outputFiles.length > 0) {
        await sharp(outputFiles[0])
          .resize(120, 120)
          .toFormat("webp")
          .toFile(thumbPath);
        await fs.unlink(outputFiles[0]); // optional: clean up intermediate image
      }
    } else {
      return undefined;
    }

    return `/thumbnails/${fileHash}.webp`;
  } catch (error) {
    console.error("Thumbnail generation error:", error);
    return undefined;
  }
}
