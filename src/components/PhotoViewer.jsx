import { useState, useEffect, useRef, useCallback } from "react";
import { photos as manualPhotos } from "../data/photos";
import { loadPhotosWithExif } from "../utils/loadPhotos";
import { loadConfig } from "../utils/loadConfig";
import PolaroidCard from "./PolaroidCard";
import NavigationButtons from "./NavigationButtons";

export default function PhotoViewer() {
    const [photos, setPhotos] = useState([]);
    const [index, setIndex] = useState(0);
    const [loading, setLoading] = useState(true);
    const [config, setConfig] = useState({
        galleryTitle: "Memories in Frame",
        author: "",
        source: "auto",
        background: "#f5f5f4",
        bgBlur: "0px",
        bgOverlayOpacity: "0.2",
        textColor: "#292524",
    });

    const touchStartX = useRef(0);
    const touchEndX = useRef(0);

    useEffect(() => {
        async function init() {
            setLoading(true);
            const cfg = await loadConfig();
            setConfig(cfg);

            if (cfg.source === "manual") {
                setPhotos(manualPhotos);
            } else {
                const autoData = await loadPhotosWithExif();
                setPhotos(autoData);
            }
            setLoading(false);
        }
        init();
    }, []);

    const prevPhoto = useCallback(() => {
        if (!photos.length) return;
        setIndex((prev) => (prev === 0 ? photos.length - 1 : prev - 1));
    }, [photos.length]);

    const nextPhoto = useCallback(() => {
        if (!photos.length) return;
        setIndex((prev) => (prev === photos.length - 1 ? 0 : prev + 1));
    }, [photos.length]);

    // Keyboard navigation
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === "ArrowLeft") prevPhoto();
            if (e.key === "ArrowRight") nextPhoto();
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [prevPhoto, nextPhoto]);

    // Mobile swipe gestures
    const handleTouchStart = (e) => {
        touchStartX.current = e.targetTouches[0].clientX;
    };

    const handleTouchMove = (e) => {
        touchEndX.current = e.targetTouches[0].clientX;
    };

    const handleTouchEnd = () => {
        if (!touchStartX.current || !touchEndX.current) return;
        const distance = touchStartX.current - touchEndX.current;
        if (distance > 50) nextPhoto();
        if (distance < -50) prevPhoto();
        touchStartX.current = 0;
        touchEndX.current = 0;
    };

    // Check if string is an image path or URL
    const isImageBackground =
        /\.(webp|jpg|jpeg|png|avif|svg)(\?.*)?$/i.test(config.background?.trim() || "") ||
        config.background?.startsWith("http://") ||
        config.background?.startsWith("https://");

    return (
        <div
            style={{
                // If image: uses stone base underneath; if color: applies user's exact color/hex directly
                backgroundColor: isImageBackground ? "#1c1917" : config.background || "#f5f5f4",
                color: config.textColor || "#292524",
            }}
            className="relative min-h-screen w-full flex flex-col items-center justify-between p-6 select-none overflow-x-clip transition-colors duration-500"
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
        >
            {/* Background Image Layer (only active when an image is specified) */}
            {isImageBackground && (
                <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
                    <div
                        className="w-full h-full bg-cover bg-center scale-105"
                        style={{
                            backgroundImage: `url(${config.background})`,
                            filter: `blur(${config.bgBlur || "0px"})`,
                        }}
                    />
                    <div
                        className="absolute inset-0 bg-black"
                        style={{ opacity: parseFloat(config.bgOverlayOpacity) || 0.2 }}
                    />
                </div>
            )}

            {/* Gallery Header */}
            <header className="relative z-10 pt-4 text-center">
                <h1 className="font-handwriting text-4xl font-bold tracking-tight drop-shadow-xs">
                    {config.galleryTitle}
                </h1>
                {config.author && (
                    <p className="text-[11px] uppercase tracking-widest opacity-80 font-mono mt-1 drop-shadow-xs">
                        Curated by {config.author}
                    </p>
                )}
            </header>

            {/* Card Stack Viewport */}
            <div className="relative z-10 flex items-center justify-center w-full h-[440px]">
                {photos.map((photo, i) => {
                    const isCurrent = i === index;
                    const isPrev = i === (index === 0 ? photos.length - 1 : index - 1);
                    const isNext = i === (index === photos.length - 1 ? 0 : index + 1);

                    return (
                        <PolaroidCard
                            key={photo.id}
                            photo={photo}
                            isCurrent={isCurrent}
                            isPrev={isPrev}
                            isNext={isNext}
                        />
                    );
                })}
            </div>

            {/* Bottom Controls */}
            <footer className="relative z-10 pb-6">
                <NavigationButtons
                    onPrev={prevPhoto}
                    onNext={nextPhoto}
                    current={index}
                    total={photos.length}
                />
            </footer>
        </div>
    );
}