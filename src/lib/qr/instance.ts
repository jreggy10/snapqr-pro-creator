import QRCodeStyling from "qr-code-styling";
import type { QRStyle } from "./types";
import { buildQROptions, effectiveEcc } from "./render";
import { getModuleCount } from "./scannability";

/** A fresh, detached instance for exports and test decodes. */
export function createQR(payload: string, style: QRStyle, size: number, type: "canvas" | "svg" = "canvas") {
  const moduleCount = getModuleCount(payload, effectiveEcc(style)) || 21;
  return new QRCodeStyling(buildQROptions(payload, style, size, type, moduleCount));
}

export async function renderPng(payload: string, style: QRStyle, size: number): Promise<Blob> {
  const blob = await createQR(payload, style, size).getRawData("png");
  if (!(blob instanceof Blob)) throw new Error("Could not render QR code");
  return blob;
}

export async function renderSvgText(payload: string, style: QRStyle, size: number): Promise<string> {
  const blob = await createQR(payload, style, size, "svg").getRawData("svg");
  if (!(blob instanceof Blob)) throw new Error("Could not render QR code");
  return blob.text();
}
