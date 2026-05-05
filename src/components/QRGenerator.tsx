import { useState, useRef } from "react";
import { QRCodeCanvas, QRCodeSVG } from "qrcode.react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Download, Copy, Loader2, QrCode, Moon, Sun } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useTheme } from "next-themes";

export const QRGenerator = () => {
  const [inputValue, setInputValue] = useState("");
  const [qrValue, setQrValue] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [customText, setCustomText] = useState("");
  const [logoUrl, setLogoUrl] = useState("");
  const [showLogo, setShowLogo] = useState(false);
  const [resolution, setResolution] = useState([400]);
  const [fgColor, setFgColor] = useState("#000000");
  const [bgColor, setBgColor] = useState("#ffffff");
  const qrRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  const { theme, setTheme } = useTheme();

  const handleGenerate = () => {
    if (!inputValue.trim()) {
      toast({
        title: "Error",
        description: "Please enter text or URL to generate QR code",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);
    setTimeout(() => {
      setQrValue(inputValue);
      setIsGenerating(false);
      toast({
        title: "Success",
        description: "QR code generated successfully!",
      });
    }, 500);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleGenerate();
    }
  };

  const downloadQR = () => {
    if (!qrValue) {
      toast({
        title: "Error",
        description: "Please generate a QR code first",
        variant: "destructive",
      });
      return;
    }

    const canvas = document.createElement("canvas");
    const size = resolution[0];
    canvas.width = size;
    canvas.height = size + (customText ? 60 : 0);
    const ctx = canvas.getContext("2d");

    if (ctx) {
      ctx.fillStyle = bgColor;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const qrCanvas = document.querySelector("#qr-canvas") as HTMLCanvasElement;
      if (qrCanvas) {
        ctx.drawImage(qrCanvas, 0, 0, size, size);

        if (customText) {
          ctx.fillStyle = fgColor;
          ctx.font = `${size / 20}px Arial`;
          ctx.textAlign = "center";
          ctx.fillText(customText, size / 2, size + 40);
        }
      }

      canvas.toBlob((blob) => {
        if (blob) {
          const url = URL.createObjectURL(blob);
          const a = document.createElement("a");
          a.href = url;
          a.download = "snapqr-code.png";
          a.click();
          URL.revokeObjectURL(url);
          toast({
            title: "Success",
            description: "QR code downloaded as PNG!",
          });
        }
      });
    }
  };

  const downloadSVG = () => {
    if (!qrValue) {
      toast({
        title: "Error",
        description: "Please generate a QR code first",
        variant: "destructive",
      });
      return;
    }

    const svgEl = document.querySelector("#qr-svg") as SVGElement;
    if (svgEl) {
      const serializer = new XMLSerializer();
      const svgStr = serializer.serializeToString(svgEl);
      const blob = new Blob([svgStr], { type: "image/svg+xml" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "snapqr-code.svg";
      a.click();
      URL.revokeObjectURL(url);
      toast({
        title: "Success",
        description: "QR code downloaded as SVG!",
      });
    }
  };

  const copyToClipboard = async () => {
    if (!qrValue) {
      toast({
        title: "Error",
        description: "Please generate a QR code first",
        variant: "destructive",
      });
      return;
    }

    const canvas = document.createElement("canvas");
    const size = resolution[0];
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext("2d");

    if (ctx) {
      ctx.fillStyle = bgColor;
      ctx.fillRect(0, 0, size, size);

      const qrCanvas = document.querySelector("#qr-canvas") as HTMLCanvasElement;
      if (qrCanvas) {
        ctx.drawImage(qrCanvas, 0, 0, size, size);
      }

      canvas.toBlob(async (blob) => {
        if (blob) {
          try {
            await navigator.clipboard.write([
              new ClipboardItem({ "image/png": blob }),
            ]);
            toast({
              title: "Success",
              description: "QR code copied to clipboard!",
            });
          } catch {
            toast({
              title: "Error",
              description: "Failed to copy to clipboard",
              variant: "destructive",
            });
          }
        }
      });
    }
  };

  const imageSettings =
    showLogo && logoUrl
      ? { src: logoUrl, height: 40, width: 40, excavate: true }
      : undefined;

  return (
    <Card className="w-full max-w-2xl card-shadow">
      <CardHeader className="gradient-header rounded-t-xl text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <QrCode className="w-8 h-8" />
            <div>
              <CardTitle className="text-3xl font-bold">SnapQR</CardTitle>
              <CardDescription className="text-white/90">
                Generate custom QR codes instantly
              </CardDescription>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="text-white hover:bg-white/20"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            aria-label="Toggle theme"
          >
            {theme === "dark" ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-6 space-y-6">
        <div className="space-y-2">
          <Label htmlFor="input-text">Enter Text or URL</Label>
          <Input
            id="input-text"
            placeholder="https://example.com or any text..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            className="text-base"
          />
        </div>

        <Button
          onClick={handleGenerate}
          disabled={isGenerating}
          className="w-full btn-gradient"
          size="lg"
        >
          {isGenerating ? (
            <>
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              Generating...
            </>
          ) : (
            <>
              <QrCode className="mr-2 h-5 w-5" />
              Generate QR Code
            </>
          )}
        </Button>

        {qrValue && (
          <div className="space-y-4 animate-fade-in">
            <div className="flex justify-center p-6 bg-accent rounded-lg">
              <div ref={qrRef} className="p-4 rounded-lg" style={{ backgroundColor: bgColor }}>
                <QRCodeCanvas
                  id="qr-canvas"
                  value={qrValue}
                  size={200}
                  level="H"
                  fgColor={fgColor}
                  bgColor={bgColor}
                  imageSettings={imageSettings}
                />
                {customText && (
                  <p className="text-center mt-2 text-sm font-medium" style={{ color: fgColor }}>
                    {customText}
                  </p>
                )}
              </div>
            </div>

            <div className="hidden">
              <QRCodeSVG
                id="qr-svg"
                value={qrValue}
                size={resolution[0]}
                level="H"
                fgColor={fgColor}
                bgColor={bgColor}
                imageSettings={imageSettings}
              />
            </div>

            <div className="grid grid-cols-3 gap-2">
              <Button onClick={copyToClipboard} variant="outline" size="lg">
                <Copy className="mr-2 h-4 w-4" />
                Copy
              </Button>
              <Button onClick={downloadQR} variant="outline" size="lg">
                <Download className="mr-2 h-4 w-4" />
                PNG
              </Button>
              <Button onClick={downloadSVG} variant="outline" size="lg">
                <Download className="mr-2 h-4 w-4" />
                SVG
              </Button>
            </div>
          </div>
        )}

        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="advanced">
            <AccordionTrigger className="text-base font-semibold">
              Advanced Options
            </AccordionTrigger>
            <AccordionContent className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label htmlFor="custom-text">Custom Text Below QR Code</Label>
                <Input
                  id="custom-text"
                  placeholder="Enter text to display below QR code"
                  value={customText}
                  onChange={(e) => setCustomText(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="logo-url">Logo URL (Optional)</Label>
                <Input
                  id="logo-url"
                  placeholder="https://example.com/logo.png"
                  value={logoUrl}
                  onChange={(e) => setLogoUrl(e.target.value)}
                />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="show-logo">Show Logo in QR Code</Label>
                <Switch
                  id="show-logo"
                  checked={showLogo}
                  onCheckedChange={setShowLogo}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="fg-color">Foreground Color</Label>
                  <div className="flex items-center gap-2">
                    <input
                      id="fg-color"
                      type="color"
                      value={fgColor}
                      onChange={(e) => setFgColor(e.target.value)}
                      className="w-10 h-10 rounded cursor-pointer border border-input"
                    />
                    <span className="text-sm text-muted-foreground font-mono">{fgColor}</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="bg-color">Background Color</Label>
                  <div className="flex items-center gap-2">
                    <input
                      id="bg-color"
                      type="color"
                      value={bgColor}
                      onChange={(e) => setBgColor(e.target.value)}
                      className="w-10 h-10 rounded cursor-pointer border border-input"
                    />
                    <span className="text-sm text-muted-foreground font-mono">{bgColor}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Export Resolution: {resolution[0]}px</Label>
                <Slider
                  value={resolution}
                  onValueChange={setResolution}
                  min={100}
                  max={1000}
                  step={50}
                  className="w-full"
                />
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </CardContent>
    </Card>
  );
};
