import { Moon, QrCode, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { QRGenerator } from "@/components/QRGenerator";
import { TrustPromise } from "@/components/TrustPromise";

const Index = () => {
  const { resolvedTheme, setTheme } = useTheme();

  return (
    <div className="min-h-screen">
      <header className="gradient-header text-white">
        <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-6 sm:px-6 sm:py-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <QrCode className="h-8 w-8" aria-hidden />
              <span className="text-2xl font-bold tracking-tight">SnapQR</span>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="text-white hover:bg-white/20 hover:text-white"
              onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
              aria-label="Toggle theme"
            >
              {resolvedTheme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </Button>
          </div>
          <div className="space-y-3">
            <h1 className="max-w-2xl text-3xl font-bold leading-tight sm:text-4xl">
              Beautiful QR codes for your church, nonprofit, or event.
            </h1>
            <TrustPromise className="text-white/90" />
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-6 sm:px-6 sm:py-8">
        <QRGenerator />
      </main>

      <footer className="mx-auto max-w-6xl space-y-2 px-4 pb-10 text-sm text-muted-foreground sm:px-6">
        <TrustPromise />
        <p>Everything runs in your browser. Your content and logo never leave your device.</p>
      </footer>
    </div>
  );
};

export default Index;
