import { useState, useCallback, useEffect } from "react";
import UploadExcel from "./components/UploadExcel";
import GeneratePDF from "./components/GeneratePDF";
import RefreshBtn from "./components/RefreshBtn";
import ErrorBoundary from "./components/ErrorBoundary";
import headerImg from "./assets/eureka-heade-logo.svg";

export default function App() {
  const [coupons, setCoupons] = useState([]);

  useEffect(() => {
    if (!window.electronAPI) return;

    window.electronAPI.onDownloadStarted((file) => {
      console.log("Download started:", file);
      alert(`Downloading ${file}...`);
    });

    window.electronAPI.onDownloadComplete((file) => {
      console.log("Download completed:", file);
      alert(`${file} downloaded successfully!`);
    });

    window.electronAPI.onDownloadFailed((file) => {
      console.log("Download failed:", file);
      alert(`${file} failed to download`);
    });
  }, []);

  // Memoized handler to clear coupons
  const handleRefresh = useCallback(() => {
    setCoupons([]);
  }, []);

  const hasCoupons = coupons.length > 0;

  return (
    <div className="min-h-screen flex flex-col">
      <header className="w-full h-15 bg-denim-700 flex items-center justify-center text-2xl text-white font-semibold sticky top-0 z-10">
        <img src={headerImg} alt="Chronos Logo" className="h-8 mr-2 absolute left-4" />
        <span>Coupons Generator</span>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center p-4">
        <UploadExcel setCoupons={setCoupons} />

        {hasCoupons && (
          <div className="w-full max-w-4xl mx-auto mt-6 space-y-4">
            <h1 className="text-xl font-semibold text-denim-950 text-center">
              {coupons.length} Coupon{coupons.length !== 1 ? "s" : ""}
            </h1>

            <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
              <ErrorBoundary>
                <GeneratePDF coupons={coupons} />
              </ErrorBoundary>
              <RefreshBtn handleRefresh={handleRefresh} />
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
