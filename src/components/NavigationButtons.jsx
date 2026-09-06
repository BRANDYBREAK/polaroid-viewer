import { ChevronLeft, ChevronRight } from "lucide-react";

export default function NavigationButtons({ onPrev, onNext, current, total }) {
    return (
        <div className="flex items-center gap-4 mt-6 z-30">
            <button
                onClick={onPrev}
                aria-label="Previous photo"
                className="w-12 h-12 flex items-center justify-center bg-white active:bg-neutral-100 text-neutral-800 rounded-full shadow-md active:scale-90 transition-transform touch-manipulation"
            >
                <ChevronLeft size={22} />
            </button>

            <span className="text-xs font-mono font-medium tracking-widest text-neutral-500 bg-white/80 backdrop-blur-xs px-3.5 py-1.5 rounded-full border border-neutral-200/60 shadow-xs">
                {current + 1} <span className="text-neutral-300">/</span> {total}
            </span>

            <button
                onClick={onNext}
                aria-label="Next photo"
                className="w-12 h-12 flex items-center justify-center bg-white active:bg-neutral-100 text-neutral-800 rounded-full shadow-md active:scale-90 transition-transform touch-manipulation"
            >
                <ChevronRight size={22} />
            </button>
        </div>
    );
}