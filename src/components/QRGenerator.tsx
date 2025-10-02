import { useState, useRef } from "react";
import { QRCodeCanvas } from "qrcode.react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Download, Copy, Loader2, QrCode } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export const QRGenerator = () => {
  const [inputValue, setInputValue] = useState("");
  const [qrValue, setQrValue] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [customText, setCustomText] = useState("");
  const [logoUrl, setLogoUrl] = useState("");
  const [showLogo, setShowLogo] = useState(false);
  const [resolution, setResolution] = useState([400]);
  const qrRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

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
      ctx.fillStyle = "white";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const qrCanvas = document.querySelector("#qr-canvas") as HTMLCanvasElement;
      if (qrCanvas) {
        ctx.drawImage(qrCanvas, 0, 0, size, size);

        if (customText) {
          ctx.fillStyle = "black";
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
            description: "QR code downloaded successfully!",
          });
        }
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
      ctx.fillStyle = "white";
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
          } catch (err) {
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

  return (
    <Card className="w-full max-w-2xl card-shadow">
      <CardHeader className="gradient-header rounded-t-xl text-white">
        <div className="flex items-center gap-3">
          <QrCode className="w-8 h-8" />
          <div>
            <CardTitle className="text-3xl font-bold">SnapQR</CardTitle>
            <CardDescription className="text-white/90">
              Generate custom QR codes instantly
            </CardDescription>
          </div>
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
              <div ref={qrRef} className="bg-white p-4 rounded-lg">
                <QRCodeCanvas
                  id="qr-canvas"
                  value={qrValue}
                  size={200}
                  level="H"
                  imageSettings={
                    showLogo && logoUrl
                      ? {
                          src: logoUrl,
                          height: 40,
                          width: 40,
                          excavate: true,
                        }
                      : undefined
                  }
                />
                {customText && (
                  <p className="text-center mt-2 text-sm font-medium text-foreground">
                    {customText}
                  </p>
                )}
              </div>
            </div>

            <div className="flex gap-2">
              <Button
                onClick={copyToClipboard}
                variant="outline"
                className="flex-1"
                size="lg"
              >
                <Copy className="mr-2 h-4 w-4" />
                Copy
              </Button>
              <Button
                onClick={downloadQR}
                variant="outline"
                className="flex-1"
                size="lg"
              >
                <Download className="mr-2 h-4 w-4" />
                Download
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

              <div className="space-y-2">
                <Label>
                  Export Resolution: {resolution[0]}px
                </Label>
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
