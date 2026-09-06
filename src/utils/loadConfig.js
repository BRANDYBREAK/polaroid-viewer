export async function loadConfig() {
    const defaults = {
        galleryTitle: "Memories in Frame",
        author: "",
        source: "auto",
        background: "#f5f5f4",
        bgBlur: "0px",
        bgOverlayOpacity: "0.2",
        textColor: "#292524",
    };

    try {
        const res = await fetch("/config.txt?t=" + Date.now());
        if (!res.ok) return defaults;
        const text = await res.text();

        const config = { ...defaults };
        const lines = text.split("\n");

        for (const line of lines) {
            const trimmed = line.trim();
            if (!trimmed || trimmed.startsWith("#")) continue;

            const [key, ...values] = trimmed.split("=");
            if (key && values.length) {
                const cleanKey = key.trim();
                const cleanVal = values.join("=").trim();
                config[cleanKey] = cleanVal;
            }
        }
        return config;
    } catch {
        return defaults;
    }
}