export default function PolaroidCard({ photo, isCurrent, isPrev, isNext }) {
    let positionClasses = "opacity-0 pointer-events-none scale-90";

    if (isCurrent) {
        positionClasses = `opacity-100 z-20 scale-100 ${photo.rotation}`;
    } else if (isPrev) {
        positionClasses = "opacity-35 -translate-x-32 md:-translate-x-48 scale-90 z-10 -rotate-6 blur-[0.5px] pointer-events-none";
    } else if (isNext) {
        positionClasses = "opacity-35 translate-x-32 md:translate-x-48 scale-90 z-10 rotate-6 blur-[0.5px] pointer-events-none";
    }

    return (
        <div
            className={`absolute transition-all duration-500 ease-out flex flex-col items-center bg-[#fdfbf7] p-4 pb-8 rounded-sm shadow-2xl border border-neutral-200/80 max-w-[320px] sm:max-w-[360px] w-full ${positionClasses}`}
        >
            <div className="w-full aspect-square bg-neutral-100 overflow-hidden shadow-inner">
                <img
                    src={photo.src}
                    alt={photo.caption}
                    className="w-full h-full object-cover select-none pointer-events-none"
                    loading="eager"
                />
            </div>
            <div className="w-full mt-4 flex flex-col items-center text-center">
                <p className="font-handwriting text-2xl text-neutral-800 leading-tight">
                    {photo.caption}
                </p>
                {photo.date && (
                    <span className="text-[11px] uppercase tracking-wider text-neutral-400 font-sans mt-1">
                        {photo.date}
                    </span>
                )}
            </div>
        </div>
    );
}