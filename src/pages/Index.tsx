import { Moon, QrCode, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { QRGenerator } from "@/components/QRGenerator";
import { TrustPromise } from "@/components/TrustPromise";

const Index = () => {
  const { resolvedTheme, setTheme } = useTheme();

  return (
    <div className="min-h-screen">
      <header className="hero-sky">
        <div className="mx-auto max-w-6xl px-4 pb-14 pt-6 sm:px-6 sm:pb-20">
          <nav className="flex items-center justify-between">
            <div className="flex items-center gap-2.5 text-ink">
              <QrCode className="h-7 w-7" aria-hidden />
              <span className="text-xl font-semibold tracking-tight">SnapQR</span>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full text-ink hover:bg-paper/60"
              onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
              aria-label="Toggle theme"
            >
              {resolvedTheme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </Button>
          </nav>
          <div className="mt-12 max-w-3xl space-y-5 sm:mt-16">
            <h1 className="text-4xl font-semibold leading-[1.05] text-ink sm:text-6xl">
              Beautiful QR codes for your church, nonprofit, or event.
            </h1>
            <p className="max-w-xl text-lg text-body-gray sm:text-xl">
              Make it, style it, and save it to your phone in under a minute.
            </p>
            <TrustPromise className="pt-1 text-ink" />
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-14">
        <QRGenerator />
      </main>

      <footer className="mx-auto max-w-6xl space-y-2 px-4 pb-14 text-body-gray sm:px-6">
        <TrustPromise className="[&>li]:bg-cloud" />
        <p>Everything runs in your browser. Your content and logo never leave your device.</p>
      </footer>
    </div>
  );
};

export default Index;
