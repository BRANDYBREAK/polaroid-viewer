import exifr from 'exifr';

// Glob all images from src/assets/photos
const imageModules = import.meta.glob('../assets/photos/*.{jpg,jpeg,webp,png}', {
    eager: true,
    import: 'default',
});

export async function loadPhotosWithExif() {
    const entries = Object.entries(imageModules);

    const parsedPhotos = await Promise.all(
        entries.map(async ([path, resolvedUrl], index) => {
            // Derive a clean fallback title from filename
            // e.g., "../assets/photos/AfterglowWithYou.webp" -> "Afterglow With You"
            const fileName = path.split('/').pop().replace(/\.[^/.]+$/, "");
            const formattedTitle = fileName.replace(/([A-Z])/g, ' $1').trim();

            let exifData = null;
            try {
                exifData = await exifr.parse(resolvedUrl, [
                    'Make',
                    'Model',
                    'DateTimeOriginal',
                    'ExposureTime',
                    'FNumber',
                    'ISO',
                    'FocalLength',
                    'ImageDescription',
                ]);
            } catch (err) {
                // Silently skip files without EXIF headers (e.g. stripped WebP)
            }

            const dateString = exifData?.DateTimeOriginal
                ? new Date(exifData.DateTimeOriginal).toLocaleDateString('en-US', {
                    month: 'long',
                    day: 'numeric',
                    year: 'numeric',
                })
                : 'September 2026';

            const shutterSpeed = exifData?.ExposureTime
                ? exifData.ExposureTime < 1
                    ? `1/${Math.round(1 / exifData.ExposureTime)}s`
                    : `${exifData.ExposureTime}s`
                : null;

            const fStop = exifData?.FNumber ? `f/${exifData.FNumber}` : null;
            const iso = exifData?.ISO ? `ISO ${exifData.ISO}` : null;
            const settings = [shutterSpeed, fStop, iso].filter(Boolean).join(' · ');

            const rotations = ['-rotate-2', '-rotate-1', 'rotate-1', 'rotate-2'];
            const rotation = rotations[index % rotations.length];

            return {
                id: index + 1,
                src: resolvedUrl,
                caption: exifData?.ImageDescription || formattedTitle,
                date: dateString,
                rotation,
                location: 'Archive Shot',
                notes: exifData?.Model ? `Captured with ${exifData.Model}` : 'No notes available.',
                camera: {
                    body: exifData?.Model || 'Film Stock',
                    lens: exifData?.FocalLength ? `${Math.round(exifData.FocalLength)}mm` : 'Prime',
                    settings: settings || '—',
                },
            };
        })
    );

    return parsedPhotos;
}