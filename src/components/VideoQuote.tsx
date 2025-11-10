import { useState, useEffect, useRef } from "react";
import logo from "@/assets/logo.jpeg";

const videos = [
  "/videos/lake-dawn.mp4",
  "/videos/beach.mp4",
  "/videos/forest.mp4",
  "/videos/coffee.mp4",
  "/videos/interior.mp4",
];

export const VideoQuote = () => {
  const [, setQuotes] = useState<string[]>([]);
  const [currentQuote, setCurrentQuote] = useState("");
  const [currentVideoIndex, setCurrentVideoIndex] = useState(() => Math.floor(Math.random() * videos.length));
  const [showQuote, setShowQuote] = useState(false);
  const [activeVideo, setActiveVideo] = useState<1 | 2>(1);
  const videoRef1 = useRef<HTMLVideoElement>(null);
  const videoRef2 = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const quoteIntervalRef = useRef<number | null>(null);

  // Parse CSV and extract quotes
  useEffect(() => {
    const loadQuotes = async () => {
      try {
        const response = await fetch("/src/assets/dog-quotes.csv");
        const text = await response.text();
        const lines = text.split("\n");
        // Skip header (line 0) and get quotes from lines 1-50 (A2:A51)
        const parsedQuotes = lines
          .slice(1, 51)
          .map(line => line.trim())
          .filter(line => line.length > 0)
          .map(line => {
            // Remove surrounding quotes if present
            if (line.startsWith('"') && line.endsWith('"')) {
              return line.slice(1, -1).replace(/""/g, '"');
            }
            return line;
          });

        setQuotes(parsedQuotes);

        // Start video and quote cycling immediately
        if (parsedQuotes.length > 0) {
          // Start first video
          setTimeout(() => {
            const video1 = videoRef1.current;
            if (video1) {
              video1.play().catch(err => console.log("Play error:", err));
            }
          }, 100);

          // Start continuous quote cycling
          startQuoteCycling(parsedQuotes);
        }
      } catch (error) {
        console.error("Error loading quotes:", error);
      }
    };

    loadQuotes();
  }, []);

  // Continuous quote and video cycling together
  const startQuoteCycling = (quoteList: string[]) => {
    if (quoteList.length === 0) return;

    // Clear any existing interval
    if (quoteIntervalRef.current) {
      clearInterval(quoteIntervalRef.current);
    }

    // Show new quote and transition video
    const showNewQuoteAndVideo = () => {
      const randomQuote = quoteList[Math.floor(Math.random() * quoteList.length)];
      const randomVideoIndex = Math.floor(Math.random() * videos.length);

      // Fade out current quote
      setShowQuote(false);

      // Transition to new video
      const nextVideo = activeVideo === 1 ? videoRef2.current : videoRef1.current;
      if (nextVideo) {
        nextVideo.src = videos[randomVideoIndex];
        nextVideo.currentTime = 0;
        nextVideo.load();

        nextVideo.onloadeddata = () => {
          nextVideo.play().catch(err => console.log("Play error:", err));

          // Crossfade videos immediately
          setTimeout(() => {
            setActiveVideo(activeVideo === 1 ? 2 : 1);
            setCurrentVideoIndex(randomVideoIndex);

            // Show new quote quickly after crossfade starts
            setTimeout(() => {
              setCurrentQuote(randomQuote);
              setShowQuote(true);
            }, 200);
          }, 100);
        };
      }
    };

    // Show first quote after 1 second
    setTimeout(() => {
      const randomQuote = quoteList[Math.floor(Math.random() * quoteList.length)];
      setCurrentQuote(randomQuote);
      setShowQuote(true);
    }, 1000);

    // Then cycle quotes and videos every 13 seconds (1s fade in + 10s visible + 1s fade out + 1s gap)
    quoteIntervalRef.current = window.setInterval(() => {
      showNewQuoteAndVideo();
    }, 13000);
  };

  // Cleanup interval on unmount
  useEffect(() => {
    return () => {
      if (quoteIntervalRef.current) {
        clearInterval(quoteIntervalRef.current);
      }
    };
  }, []);

  // Fullscreen functionality
  const toggleFullscreen = () => {
    if (!containerRef.current) return;

    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().catch(err => {
        console.error("Error attempting to enable fullscreen:", err);
      });
    } else {
      document.exitFullscreen();
    }
  };

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === "f" || e.key === "F") {
        toggleFullscreen();
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative w-full h-screen overflow-hidden bg-black cursor-pointer"
      onDoubleClick={toggleFullscreen}
      title="Press F or double-click for fullscreen"
    >
      {/* Video Background - Dual Video System for Crossfade */}
      <video
        ref={videoRef1}
        src={videos[currentVideoIndex]}
        className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-[800ms] ease-in-out ${
          activeVideo === 1 ? "opacity-100" : "opacity-0"
        }`}
        style={{
          transform: 'scale(1.05) translateY(-4%)',
          margin: 0,
          padding: 0,
        }}
        autoPlay
        playsInline
        muted
        loop={false}
      />
      <video
        ref={videoRef2}
        className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-[800ms] ease-in-out ${
          activeVideo === 2 ? "opacity-100" : "opacity-0"
        }`}
        style={{
          transform: 'scale(1.05) translateY(-4%)',
          margin: 0,
          padding: 0,
        }}
        playsInline
        muted
        loop={false}
      />

      {/* Dark Overlay for better text readability */}
      <div className="absolute inset-0 bg-black/30" />

      {/* Quote Overlay */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 p-5 text-center max-w-[80%] pointer-events-none"
        style={{ zIndex: 100 }}
      >
        <p
          className={`
            text-white text-center
            transition-opacity duration-[600ms] ease-in-out
            ${showQuote ? "opacity-100" : "opacity-0"}
          `}
          style={{
            color: '#ffffff',
            fontSize: '4vw',
            fontFamily: "'Helvetica Neue', Arial, sans-serif",
            fontWeight: 900,
            lineHeight: 1.2,
            textShadow: "0 0 10px rgba(0, 0, 0, 0.9)",
          }}
        >
          {currentQuote}
        </p>
      </div>

      {/* Fullscreen Button */}
      <button
        onClick={toggleFullscreen}
        className="absolute top-6 right-6 z-20 bg-black/50 hover:bg-black/70 text-white p-3 rounded-lg transition-all opacity-60 hover:opacity-100"
        title="Toggle Fullscreen (F key or double-click)"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={2}
          stroke="currentColor"
          className="w-6 h-6"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9M3.75 20.25v-4.5m0 4.5h4.5m-4.5 0L9 15M20.25 3.75h-4.5m4.5 0v4.5m0-4.5L15 9m5.25 11.25h-4.5m4.5 0v-4.5m0 4.5L15 15"
          />
        </svg>
      </button>

      {/* Watermark Logo - Bottom Right Corner */}
      <div className="absolute bottom-6 right-6 z-10 opacity-60 hover:opacity-80 transition-opacity">
        <img
          src={logo}
          alt="Screenhound"
          className="h-12 md:h-16 w-auto object-contain max-w-[180px]"
        />
      </div>
    </div>
  );
};
