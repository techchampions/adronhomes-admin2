import QRCode from "qrcode";

export interface VisitorPassDetails {
  code: string;
  name?: string;
  estateName?: string;
}

const YELLOW = "#F6B51A";
const INK = "#161616";

function roundRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  radius: number,
) {
  const r = Math.min(radius, width / 2, height / 2);
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + width, y, x + width, y + height, r);
  ctx.arcTo(x + width, y + height, x, y + height, r);
  ctx.arcTo(x, y + height, x, y, r);
  ctx.arcTo(x, y, x + width, y, r);
  ctx.closePath();
}

function fitText(ctx: CanvasRenderingContext2D, text: string, maxWidth: number) {
  if (ctx.measureText(text).width <= maxWidth) return text;
  let trimmed = text;
  while (trimmed.length > 1 && ctx.measureText(`${trimmed}…`).width > maxWidth) {
    trimmed = trimmed.slice(0, -1);
  }
  return `${trimmed}…`;
}

function drawTracked(
  ctx: CanvasRenderingContext2D,
  text: string,
  centerX: number,
  y: number,
  tracking: number,
) {
  const widths = [...text].map((char) => ctx.measureText(char).width);
  const total =
    widths.reduce((sum, width) => sum + width, 0) + tracking * (text.length - 1);
  let x = centerX - total / 2;
  [...text].forEach((char, index) => {
    ctx.fillText(char, x, y);
    x += widths[index] + tracking;
  });
}

export async function createVisitorPassDataUrl(details: VisitorPassDetails) {
  const width = 420;
  const height = 680;
  const scale = 2;
  const canvas = document.createElement("canvas");
  canvas.width = width * scale;
  canvas.height = height * scale;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Could not draw the visitor pass");
  ctx.scale(scale, scale);

  const headerHeight = 148;
  const footerHeight = 54;
  const radius = 26;

  ctx.save();
  roundRect(ctx, 0, 0, width, height, radius);
  ctx.clip();

  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, width, height);

  ctx.fillStyle = YELLOW;
  ctx.fillRect(0, 0, width, headerHeight);

  ctx.fillStyle = "#fffdf6";
  roundRect(ctx, width / 2 - 28, 18, 56, 16, 8);
  ctx.fill();

  ctx.fillStyle = INK;
  ctx.font = "800 46px Arial, sans-serif";
  ctx.textBaseline = "middle";
  drawTracked(ctx, "VISITOR", width / 2, 92, 3);

  const squares = [
    [26, 176, 12],
    [48, 198, 8],
    [360, 188, 14],
    [382, 214, 8],
    [34, 470, 10],
    [372, 500, 9],
  ];
  ctx.fillStyle = YELLOW;
  squares.forEach(([x, y, size]) => {
    ctx.fillRect(x, y, size, size);
  });

  ctx.strokeStyle = "rgba(246, 181, 26, 0.45)";
  ctx.lineWidth = 1;
  for (let i = 0; i < 6; i += 1) {
    ctx.beginPath();
    ctx.moveTo(300 + i * 14, 250);
    ctx.lineTo(390 + i * 14, 430);
    ctx.stroke();
  }

  ctx.fillStyle = "rgba(246, 181, 26, 0.16)";
  ctx.beginPath();
  ctx.ellipse(210, 330, 130, 110, 0, 0, Math.PI * 2);
  ctx.fill();

  const qrSize = 196;
  const qrX = (width - qrSize) / 2;
  const qrY = 214;
  const qrUrl = await QRCode.toDataURL(details.code || " ", {
    margin: 1,
    width: qrSize * scale,
    errorCorrectionLevel: "M",
    color: { dark: INK, light: "#ffffff" },
  });
  const qrImage = await loadImage(qrUrl);
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(qrX - 8, qrY - 8, qrSize + 16, qrSize + 16);
  ctx.drawImage(qrImage, qrX, qrY, qrSize, qrSize);

  const logoY = 470;
  ctx.fillStyle = INK;
  ctx.fillRect(36, logoY, 42, 42);
  ctx.fillStyle = YELLOW;
  ctx.fillRect(54, logoY + 18, 24, 24);

  ctx.fillStyle = INK;
  ctx.textBaseline = "alphabetic";
  ctx.font = "800 18px Arial, sans-serif";
  ctx.fillText("ADRON HOMES", 92, logoY + 20);
  ctx.font = "600 12px Arial, sans-serif";
  ctx.fillStyle = "#5c5c5c";
  ctx.fillText(
    fitText(ctx, (details.name || "Access pass").toUpperCase(), 250),
    92,
    logoY + 40,
  );

  ctx.fillStyle = YELLOW;
  ctx.fillRect(0, height - footerHeight, width, footerHeight);
  ctx.fillStyle = INK;
  ctx.font = "700 11px Arial, sans-serif";
  ctx.textBaseline = "middle";
  const footerY = height - footerHeight / 2;
  ctx.fillText(
    fitText(ctx, `CODE: ${details.code || "N/A"}`, 190),
    18,
    footerY,
  );
  const estate = `ESTATE: ${details.estateName || "Adron"}`;
  ctx.font = "700 11px Arial, sans-serif";
  const estateText = fitText(ctx, estate, 180);
  ctx.fillText(estateText, width - 18 - ctx.measureText(estateText).width, footerY);

  ctx.restore();
  return canvas.toDataURL("image/png");
}

function loadImage(src: string) {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error("Could not draw the QR code"));
    image.src = src;
  });
}
