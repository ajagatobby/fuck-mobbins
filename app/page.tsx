"use client";
import Image from "next/image";
import { useState } from "react";
import { Spinner } from "./components/loading";
import JSZip from "jszip";
import { motion } from "framer-motion";

interface Screen {
  id: string;
  screenUrl: string;
  screenNumber: number;
}

interface DownloadProgress {
  downloaded: number;
  total: number;
  currentFile: string;
}

const App = () => {
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [progress, setProgress] = useState<DownloadProgress | null>(null);
  const [abortController, setAbortController] =
    useState<AbortController | null>(null);

  const getFileExtension = (url: string): string => {
    try {
      const pathname = new URL(url).pathname;
      const extension = pathname.split(".").pop()?.toLowerCase();
      return extension &&
        ["jpg", "jpeg", "png", "webp", "gif"].includes(extension)
        ? extension
        : "jpg";
    } catch {
      return "jpg";
    }
  };

  const downloadBlob = (blob: Blob, filename: string): void => {
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    link.style.display = "none";

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    // Clean up object URL
    URL.revokeObjectURL(url);
  };

  const downloadScreensAsZip = async (
    screens: Screen[],
    appSlug: string,
    signal: AbortSignal
  ) => {
    const zip = new JSZip();
    const appName = appSlug.split("-")[0] || "app";

    const sortedScreens = [...screens].sort(
      (a, b) => a.screenNumber - b.screenNumber
    );

    let downloaded = 0;
    const total = sortedScreens.length;
    const downloadedFiles = new Map<
      number,
      { blob: Blob; extension: string }
    >();

    setProgress({
      downloaded: 0,
      total,
      currentFile: "Starting download...",
    });

    const downloadPromises = sortedScreens.map(async (screen) => {
      if (signal.aborted) throw new DOMException("Aborted", "AbortError");

      try {
        setProgress((prev) =>
          prev
            ? {
                ...prev,
                currentFile: `Downloading screen ${screen.screenNumber}`,
              }
            : null
        );

        const response = await fetch(screen.screenUrl, { signal });

        if (!response.ok) {
          throw new Error(`Failed to download screen ${screen.screenNumber}`);
        }

        const imageBlob = await response.blob();
        const extension = getFileExtension(screen.screenUrl);

        // Store the downloaded file in the map
        downloadedFiles.set(screen.screenNumber, {
          blob: imageBlob,
          extension,
        });

        downloaded++;
        setProgress((prev) =>
          prev
            ? {
                ...prev,
                downloaded,
                currentFile: `Downloaded screen ${screen.screenNumber}`,
              }
            : null
        );
      } catch (error) {
        if (error instanceof DOMException && error.name === "AbortError") {
          throw error;
        }
        console.error(
          `Failed to download screen ${screen.screenNumber}:`,
          error
        );
      }
    });

    // Wait for all downloads to complete
    await Promise.allSettled(downloadPromises);

    if (signal.aborted) throw new DOMException("Aborted", "AbortError");

    setProgress((prev) =>
      prev
        ? {
            ...prev,
            currentFile: "Creating zip file...",
          }
        : null
    );

    // Add files to zip in sorted order
    for (const screen of sortedScreens.reverse()) {
      const file = downloadedFiles.get(screen.screenNumber);
      if (file) {
        zip.file(`${screen.screenNumber}.${file.extension}`, file.blob);
      }
    }

    const zipBlob = await zip.generateAsync({
      type: "blob",
      compression: "DEFLATE",
      compressionOptions: { level: 6 },
    });

    downloadBlob(zipBlob, `${appName}.zip`);
  };

  const handleSearch = async () => {
    if (!search.trim()) return;

    const controller = new AbortController();
    setAbortController(controller);
    setLoading(true);
    setProgress(null);

    try {
      const url = new URL(search);
      const pathParts = url.pathname.split("/");
      const appSlug = pathParts[2];
      const appVersionId = pathParts[3];

      if (!appSlug || !appVersionId) {
        throw new Error(
          "Invalid URL format. Please enter a valid Mobbin app URL."
        );
      }

      console.log("Fetching screens for:", appSlug, appVersionId);

      // Fetch screens data
      const response = await fetch(
        `/api/screens?appSlug=${appSlug}&appVersionId=${appVersionId}`,
        { signal: controller.signal }
      );

      if (!response.ok) {
        throw new Error(`Failed to fetch screens: ${response.statusText}`);
      }

      const data = await response.json();

      if (!data.success || !data.screens || data.screens.length === 0) {
        throw new Error("No screens found for this app.");
      }

      console.log(`Found ${data.screens.length} screens`);

      await downloadScreensAsZip(data.screens, appSlug, controller.signal);

      console.log("Download completed successfully!");
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") {
        console.log("Download cancelled by user");
      } else {
        console.error("Error:", error);
        alert(
          error instanceof Error
            ? error.message
            : "An error occurred during download"
        );
      }
    } finally {
      setLoading(false);
      setProgress(null);
      setAbortController(null);
    }
  };

  const handleCancel = () => {
    if (abortController) {
      abortController.abort();
    }
  };

  const isValidUrl = (url: string): boolean => {
    try {
      const parsedUrl = new URL(url);
      return (
        parsedUrl.hostname.includes("mobbin") &&
        parsedUrl.pathname.split("/").length >= 4
      );
    } catch {
      return false;
    }
  };

  const containerVariants = {
    hidden: {
      opacity: 0,
      filter: "blur(10px)",
      y: 30,
    },
    visible: {
      opacity: 1,
      filter: "blur(0px)",
      y: 0,
      transition: {
        duration: 0.8,
        ease: [0.25, 0.46, 0.45, 0.94],
        staggerChildren: 0.15,
      },
    },
  };

  const itemVariants = {
    hidden: {
      opacity: 0,
      y: 30,
      scale: 0.95,
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.6,
        ease: [0.25, 0.46, 0.45, 0.94],
      },
    },
  };

  const progressVariants = {
    hidden: {
      opacity: 0,
      height: 0,
      y: -20,
    },
    visible: {
      opacity: 1,
      height: "auto",
      y: 0,
      transition: {
        duration: 0.4,
        ease: "easeOut",
      },
    },
    exit: {
      opacity: 0,
      height: 0,
      y: -20,
      transition: {
        duration: 0.3,
        ease: "easeIn",
      },
    },
  };

  return (
    <motion.div
      className="w-full h-screen bg-white flex items-center justify-center p-4"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="bg-white w-full max-w-screen-lg mx-auto flex flex-col gap-4 sm:gap-6 md:gap-8 items-center justify-center">
        <motion.div variants={itemVariants}>
          <Image
            src="/logo.png"
            alt="logo"
            width={200}
            height={200}
            className="w-32 h-32 sm:w-40 sm:h-40 md:w-48 md:h-48 lg:w-56 lg:h-56"
          />
        </motion.div>

        <motion.div
          className="flex flex-col gap-1 sm:gap-2 items-center justify-center text-center"
          variants={itemVariants}
        >
          <motion.h1
            className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-[-0.3rem]"
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          >
            F*ck <span className="text-blue-500">Mobbins</span>
          </motion.h1>
          <motion.p
            className="text-base sm:text-lg md:text-xl tracking-[-0.03rem] text-stone-500 max-w-[90%] sm:max-w-[80%] md:max-w-[100%]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.6 }}
          >
            Download unlimited app screens from{" "}
            <motion.a
              href="https://mobbin.com"
              className="text-gray-500 underline hover:text-gray-600 transition-colors"
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              mobbin.com
            </motion.a>
          </motion.p>
        </motion.div>

        <motion.div
          className="flex flex-col gap-2 items-center justify-center w-full max-w-[90%] sm:max-w-[80%] md:max-w-[50%]"
          variants={itemVariants}
        >
          <div className="relative w-full flex flex-col sm:flex-row gap-2">
            <motion.input
              type="text"
              placeholder="https://mobbin.com/apps/grok-ios-a986af54-0747-4589-9332-1f6ed64332c6/297de34b-a5ea-4251-a7d6-378f272a50fc/screens"
              className="w-full p-2 rounded-4xl border-gray-300 border-0 bg-stone-100 h-12 sm:h-14 px-4 focus:outline-none text-sm sm:text-base"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyPress={(e) =>
                e.key === "Enter" && !loading && handleSearch()
              }
              transition={{ duration: 0.2 }}
            />
            <motion.button
              className={`w-full sm:w-auto sm:absolute sm:right-2 sm:top-1/2 sm:-translate-y-1/2 px-4 py-2 rounded-3xl h-10 text-sm sm:text-base transition-all duration-200 ${
                loading
                  ? "bg-stone-500 hover:bg-stone-600 text-white"
                  : "bg-gradient-to-tr from-stone-700 to-black text-white hover:opacity-90"
              } ${
                !search.trim() || (!loading && !isValidUrl(search))
                  ? "opacity-95 cursor-not-allowed"
                  : ""
              }`}
              onClick={loading ? handleCancel : handleSearch}
              disabled={!search.trim() || (!loading && !isValidUrl(search))}
              whileHover={
                search.trim() && (loading || isValidUrl(search))
                  ? { scale: 1.05, y: -2 }
                  : {}
              }
              whileTap={
                search.trim() && (loading || isValidUrl(search))
                  ? { scale: 0.95 }
                  : {}
              }
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            >
              {loading ? (
                <motion.div
                  className="flex items-center justify-center gap-2"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <Spinner className="w-4 h-4 animate-spin" />
                  <span>Cancel</span>
                </motion.div>
              ) : (
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  Download
                </motion.span>
              )}
            </motion.button>
          </div>

          {/* Progress Bar */}
          {progress && (
            <motion.div
              className="w-full space-y-2 mt-4"
              variants={progressVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              <div className="flex justify-between text-sm text-gray-600">
                <span className="truncate" key={progress.currentFile}>
                  {progress.currentFile}
                </span>
                <span className="flex-shrink-0 ml-2">
                  {progress.downloaded}/{progress.total}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                <motion.div
                  className="bg-blue-500 h-2 rounded-full"
                  initial={{ width: "0%" }}
                  animate={{
                    width: `${(progress.downloaded / progress.total) * 100}%`,
                  }}
                  transition={{
                    duration: 0.5,
                    ease: "easeOut",
                    type: "spring",
                    stiffness: 100,
                  }}
                />
              </div>
              <div className="text-xs text-gray-500 text-center">
                {Math.round((progress.downloaded / progress.total) * 100)}%
                complete
              </div>
            </motion.div>
          )}

          {search && !isValidUrl(search) && (
            <motion.div
              className="text-xs text-red-500 text-center mt-1"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
            >
              Please enter a valid Mobbin app URL (e.g.,
              https://mobbin.com/apps/app-name/version-id)
            </motion.div>
          )}
        </motion.div>
      </div>
    </motion.div>
  );
};

export default App;
