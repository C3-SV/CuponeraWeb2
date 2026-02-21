import { useState, useRef, useEffect } from "react";

export const OfferGalery = ({ images = [], title }) => {
    // Normalise: accept both raw URL strings and {url, alt} objects
    const normalised = images.map((img) =>
        typeof img === "string" ? { url: img, alt: "" } : img
    );

    const [selectedIndex, setSelectedIndex] = useState(0);

    // ====== Carousel mobile logic ======
    const mobileCarouselRef = useRef(null);
    const isProgrammaticScroll = useRef(false);

    function scrollContainerToIndex(i) {
        const el = mobileCarouselRef.current;
        if (!el || !el.children[i]) return;
        el.scrollTo({ left: el.children[i].offsetLeft, behavior: "smooth" });
    }

    function scrollToIndex(i) {
        isProgrammaticScroll.current = true;
        setSelectedIndex(i);
        setTimeout(() => {
            isProgrammaticScroll.current = false;
        }, 600);
    }

    function prevImage() {
        const next = (selectedIndex - 1 + normalised.length) % normalised.length;
        scrollToIndex(next);
    }

    function nextImage() {
        const next = (selectedIndex + 1) % normalised.length;
        scrollToIndex(next);
    }

    useEffect(() => {
        scrollContainerToIndex(selectedIndex);
    }, [selectedIndex]);

    function handleMobileScroll(e) {
        if (isProgrammaticScroll.current) return;
        const el = e.currentTarget;
        const center = el.scrollLeft + el.clientWidth / 2;
        let bestIdx = 0,
            bestDist = Infinity;

        Array.from(el.children).forEach((child, idx) => {
            const childCenter = child.offsetLeft + child.clientWidth / 2;
            const dist = Math.abs(childCenter - center);
            if (dist < bestDist) {
                bestDist = dist;
                bestIdx = idx;
            }
        });

        if (bestIdx !== selectedIndex) setSelectedIndex(bestIdx);
    }

    return (
        <div className="flex flex-col-reverse">
            {/* Thumbnails (Desktop) */}
            <div className="mx-auto mt-5 hidden w-full max-w-2xl sm:block lg:max-w-none">
                <div className="grid grid-cols-4 gap-4">
                    {normalised.map((img, i) => (
                        <button
                            key={img.url ?? i}
                            type="button"
                            onClick={() => setSelectedIndex(i)}
                            className={`relative flex h-20 items-center justify-center rounded-md bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-secondary-hover/70 focus:ring-offset-2`}
                        >
                            <span className="absolute inset-0 overflow-hidden rounded-md">
                                <img
                                    src={img.url}
                                    alt={img.alt ?? ""}
                                    className="size-full object-cover"
                                />
                            </span>
                            <span
                                aria-hidden="true"
                                className={`pointer-events-none absolute inset-0 rounded-md ring-2 ring-offset-2 ${
                                    i === selectedIndex
                                        ? "ring-secondary-hover"
                                        : "ring-transparent"
                                }`}
                            />
                        </button>
                    ))}
                </div>
            </div>

            {/* Main Image & Mobile Carousel */}
            <div className="w-full">
                {/* Desktop View */}
                <div className="bg-surface rounded-lg p-4 sm:p-6 hidden sm:block">
                    <img
                        src={normalised[selectedIndex]?.url}
                        alt={normalised[selectedIndex]?.alt || title}
                        className="mx-auto w-full max-w-md aspect-square object-contain"
                    />
                </div>

                {/* Mobile Carousel View */}
                <div className="mt-4 sm:hidden">
                    <div className="relative">
                        {normalised.length > 1 && (
                            <>
                                <button
                                    onClick={prevImage}
                                    className="absolute left-2 top-1/2 -translate-y-1/2 z-10 size-10 rounded-full bg-white/80 backdrop-blur shadow grid place-items-center"
                                >
                                    <svg
                                        viewBox="0 0 24 24"
                                        className="size-5"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                    >
                                        <path
                                            d="M15 18l-6-6 6-6"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        />
                                    </svg>
                                </button>
                                <button
                                    onClick={nextImage}
                                    className="absolute right-2 top-1/2 -translate-y-1/2 z-10 size-10 rounded-full bg-white/80 backdrop-blur shadow grid place-items-center"
                                >
                                    <svg
                                        viewBox="0 0 24 24"
                                        className="size-5"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                    >
                                        <path
                                            d="M9 6l6 6-6 6"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        />
                                    </svg>
                                </button>
                            </>
                        )}
                        <div
                            ref={mobileCarouselRef}
                            onScroll={handleMobileScroll}
                            className="flex gap-3 overflow-x-auto snap-x snap-mandatory scroll-smooth pb-2 px-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
                        >
                            {normalised.map((img, i) => (
                                <div
                                    key={img.url ?? i}
                                    className="snap-center shrink-0 w-full"
                                >
                                    <div className="bg-surface rounded-lg p-4">
                                        <img
                                            src={img.url}
                                            alt={img.alt ?? ""}
                                            className="mx-auto w-full max-w-sm aspect-square object-contain"
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                    {/* Dots */}
                    <div className="mt-3 flex justify-center gap-2">
                        {normalised.map((_, i) => (
                            <button
                                key={i}
                                onClick={() => scrollToIndex(i)}
                                className={`h-2 rounded-full transition-all ${i === selectedIndex ? "w-6 bg-secondary-hover" : "w-2 bg-gray-300"}`}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};
