import { useState, useEffect, useRef } from "react";
import logo from "@/assets/logo.jpeg";

const videos = [
  "/videos/lake-dawn.mp4",
  "/videos/beach.mp4",
  "/videos/forest.mp4",
  "/videos/coffee.mp4",
  "/videos/interior.mp4",
];

const VIDEO_DURATION = 25; // seconds

export const VideoQuote = () => {
  const [quotes, setQuotes] = useState<string[]>([]);
  const [currentQuote, setCurrentQuote] = useState("");
  const [currentVideoIndex, setCurrentVideoIndex] = useState(() => Math.floor(Math.random() * videos.length));
  const [showQuote, setShowQuote] = useState(false);
  const [activeVideo, setActiveVideo] = useState<1 | 2>(1);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const videoRef1 = useRef<HTMLVideoElement>(null);
  const videoRef2 = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

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

        // Immediately show random quote and start video
        if (parsedQuotes.length > 0) {
          const randomQuote = parsedQuotes[Math.floor(Math.random() * parsedQuotes.length)];
          setCurrentQuote(randomQuote);

          // Start first video
          setTimeout(() => {
            const video1 = videoRef1.current;
            if (video1) {
              video1.play().catch(err => console.log("Play error:", err));
            }
          }, 100);

          // Fade in quote after 2 seconds
          setTimeout(() => {
            setShowQuote(true);
          }, 2000);
        }
      } catch (error) {
        console.error("Error loading quotes:", error);
      }
    };

    loadQuotes();
  }, []);

  const randomizeCombination = (quoteList: string[] = quotes) => {
    if (quoteList.length === 0) return;

    const randomQuote = quoteList[Math.floor(Math.random() * quoteList.length)];
    const randomVideoIndex = Math.floor(Math.random() * videos.length);

    setShowQuote(false);
    setCurrentQuote(randomQuote);
    setCurrentVideoIndex(randomVideoIndex);
    setActiveVideo(1);

    // Reset and play first video
    const video1 = videoRef1.current;
    if (video1) {
      video1.currentTime = 0;
      video1.play().catch(err => console.log("Play error:", err));
    }

    // Fade in quote after 2 seconds
    setTimeout(() => {
      setShowQuote(true);
    }, 2000);
  };

  const startTransition = () => {
    if (isTransitioning) return;

    setIsTransitioning(true);

    // Prepare next random combination
    const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
    const randomVideoIndex = Math.floor(Math.random() * videos.length);

    // Preload next video in the inactive video element
    const nextVideo = activeVideo === 1 ? videoRef2.current : videoRef1.current;
    if (nextVideo) {
      nextVideo.src = videos[randomVideoIndex];
      nextVideo.currentTime = 0;
      nextVideo.load();

      // Wait for video to be ready, then start crossfade
      nextVideo.onloadeddata = () => {
        nextVideo.play().catch(err => console.log("Play error:", err));

        // Start crossfade after 1 second (at 24s mark)
        setTimeout(() => {
          setActiveVideo(activeVideo === 1 ? 2 : 1);
          setCurrentVideoIndex(randomVideoIndex);

          // Fade in new quote after crossfade completes
          setTimeout(() => {
            setCurrentQuote(randomQuote);
            setShowQuote(true);
            setIsTransitioning(false);
          }, 2000);
        }, 1000);
      };
    }
  };


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

  // Handle video timing and transitions - ensures continuous looping
  useEffect(() => {
    const video1 = videoRef1.current;
    const video2 = videoRef2.current;
    const activeVideoRef = activeVideo === 1 ? video1 : video2;

    if (!activeVideoRef || quotes.length === 0) return;

    const handleTimeUpdate = () => {
      const currentTime = activeVideoRef.currentTime;

      // Fade out quote at 20 seconds (5s before end)
      if (currentTime >= 20 && showQuote && !isTransitioning) {
        setShowQuote(false);
      }

      // Start preloading and transition at 23 seconds for seamless loop
      if (currentTime >= 23 && !isTransitioning) {
        startTransition();
      }

      // Loop back to start at 25 seconds
      if (currentTime >= VIDEO_DURATION) {
        activeVideoRef.currentTime = 0;
      }
    };

    activeVideoRef.addEventListener("timeupdate", handleTimeUpdate);
    return () => activeVideoRef.removeEventListener("timeupdate", handleTimeUpdate);
  }, [activeVideo, showQuote, isTransitioning, quotes]);

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
        className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-[2000ms] ease-in-out ${
          activeVideo === 1 ? "opacity-100" : "opacity-0"
        }`}
        autoPlay
        playsInline
        muted
        loop={false}
      />
      <video
        ref={videoRef2}
        className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-[2000ms] ease-in-out ${
          activeVideo === 2 ? "opacity-100" : "opacity-0"
        }`}
        playsInline
        muted
        loop={false}
      />

      {/* Dark Overlay for better text readability */}
      <div className="absolute inset-0 bg-black/30" />

      {/* Quote Overlay */}
      <div className="absolute inset-0 flex items-center justify-center px-8 md:px-16 lg:px-32">
        <p
          className={`
            text-3xl md:text-4xl lg:text-5xl xl:text-6xl
            text-foreground text-center font-serif leading-relaxed
            transition-opacity duration-[4000ms] ease-in-out
            ${showQuote ? "opacity-100" : "opacity-0"}
          `}
          style={{
            textShadow: "0 4px 12px rgba(0, 0, 0, 0.9), 0 2px 4px rgba(0, 0, 0, 0.8)",
          }}
        >
      {currentQuote}
        </p>
      </div>

      {/* Watermark Logo */}
      <div className="absolute bottom-4 right-4 z-10 opacity-60 hover:opacity-80 transition-opacity">
        <img
          src={logo}
          alt="Screenhound"
          className="h-8 md:h-10 w-auto object-contain max-w-[120px]"
        />
      </div>
    </div>
  );
};
