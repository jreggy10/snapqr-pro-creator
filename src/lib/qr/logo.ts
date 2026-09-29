const MAX_LOGO_PX = 256;

/** Read an uploaded image and downscale it to a small PNG data URL. */
export async function readLogoFile(file: File): Promise<string> {
  if (!file.type.startsWith("image/")) throw new Error("Please choose an image file.");
  const url = URL.createObjectURL(file);
  try {
    const img = new Image();
    img.src = url;
    await img.decode();
    const w = img.naturalWidth || MAX_LOGO_PX;
    const h = img.naturalHeight || MAX_LOGO_PX;
    const scale = Math.min(1, MAX_LOGO_PX / Math.max(w, h));
    const canvas = document.createElement("canvas");
    canvas.width = Math.max(1, Math.round(w * scale));
    canvas.height = Math.max(1, Math.round(h * scale));
    canvas.getContext("2d")!.drawImage(img, 0, 0, canvas.width, canvas.height);
    return canvas.toDataURL("image/png");
  } catch {
    throw new Error("That image couldn't be read. Try a PNG or JPG.");
  } finally {
    URL.revokeObjectURL(url);
  }
}
