'use client';

import Link from 'next/link';
import { useRef, useState, useEffect, useCallback, useMemo } from 'react';
import { useValues } from '@/context/valuesContext';

export default function ExpertCategories() {
    const scrollRef = useRef(null);
    const trackRef = useRef(null);
    const thumbRef = useRef(null);
    const [isDragging, setIsDragging] = useState(false);
    const thumbWidth = 120; // Reverted to a standard slider thumb width for optimal UX

    const { values } = useValues();
    const categories = useMemo(() => {
        const raw = values?.expertise_categories;
        if (!Array.isArray(raw) || raw.length === 0) return [];
        return [...new Set(raw.filter((s) => typeof s === 'string' && s.trim()))].sort((a, b) =>
            a.localeCompare(b, undefined, { sensitivity: 'base' })
        );
    }, [values?.expertise_categories]);

    /** Enough items for horizontal scroll when the API returns only a few tags */
    const carouselItems = useMemo(() => {
        if (categories.length === 0) return [];
        const minSlots = 10;
        const out = [];
        while (out.length < minSlots) {
            for (const c of categories) {
                out.push(c);
                if (out.length >= minSlots) break;
            }
        }
        return out;
    }, [categories]);

    // Optimized scroll update using refs to bypass React re-renders
    const updateThumbPosition = useCallback(() => {
        if (scrollRef.current && thumbRef.current && trackRef.current) {
            const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
            const totalScroll = scrollWidth - clientWidth;

            if (totalScroll > 0) {
                const progress = scrollLeft / totalScroll;
                const maxTranslate = clientWidth - thumbWidth;
                const translateX = progress * maxTranslate;
                thumbRef.current.style.transform = `translateX(${translateX}px)`;
            }
        }
    }, [thumbWidth]);

    const handleScroll = () => {
        window.requestAnimationFrame(updateThumbPosition);
    };

    useEffect(() => {
        if (scrollRef.current) {
            const resizeObserver = new ResizeObserver(() => {
                updateThumbPosition();
            });
            resizeObserver.observe(scrollRef.current);
            updateThumbPosition();
            return () => resizeObserver.disconnect();
        }
    }, [updateThumbPosition, carouselItems.length]);

    // Dragging Logic
    const handleDrag = useCallback((e) => {
        if (!isDragging && e.type !== 'mousedown' && e.type !== 'touchstart') return;

        const track = trackRef.current;
        const scrollContainer = scrollRef.current;
        if (!track || !scrollContainer) return;

        const rect = track.getBoundingClientRect();
        const clientX = e.clientX || e.touches?.[0]?.clientX;
        const clickX = clientX - rect.left - thumbWidth / 2;
        const maxTrackX = rect.width - thumbWidth;

        const progress = Math.max(0, Math.min(clickX / maxTrackX, 1));
        const scrollAmount = progress * (scrollContainer.scrollWidth - scrollContainer.clientWidth);

        scrollContainer.scrollTo({ left: scrollAmount, behavior: isDragging ? 'auto' : 'smooth' });
    }, [isDragging, thumbWidth]);

    const handleDragStart = (e) => {
        setIsDragging(true);
        handleDrag(e);
    };

    useEffect(() => {
        const onEnd = () => setIsDragging(false);
        const onMove = (e) => isDragging && handleDrag(e);

        if (isDragging) {
            window.addEventListener('mousemove', onMove);
            window.addEventListener('mouseup', onEnd);
            window.addEventListener('touchmove', onMove, { passive: false });
            window.addEventListener('touchend', onEnd);
        }
        return () => {
            window.removeEventListener('mousemove', onMove);
            window.removeEventListener('mouseup', onEnd);
            window.removeEventListener('touchmove', onMove);
            window.removeEventListener('touchend', onEnd);
        };
    }, [isDragging, handleDrag]);

    return (
        <section className="bg-black text-white py-16">
            <div className="max-w-7xl mx-auto px-6">
                <h2 className="text-2xl sm:text-3xl font-bold mb-2">Explore Categories</h2>
                <p className="text-gray-400 mb-8 text-xs sm:text-sm uppercase tracking-widest font-medium">Find the best experts to help you reach your goals</p>

                {carouselItems.length === 0 ? (
                    <p className="text-gray-500 text-sm max-w-xl">
                        Specializations from active expert listings will appear here.{' '}
                        <Link href="/experts" className="text-lime-500 underline-offset-2 hover:underline font-semibold">
                            Browse all experts
                        </Link>
                    </p>
                ) : (
                    <>
                        {/* Horizontal Scroll Container */}
                        <div
                            ref={scrollRef}
                            onScroll={handleScroll}
                            className="flex overflow-x-auto gap-4 pb-4 scrollbar-hide snap-x snap-mandatory select-none scroll-smooth"
                        >
                            {carouselItems.map((cat, index) => (
                                <Link
                                    key={`${cat}-${index}`}
                                    href={`/experts?speciality=${encodeURIComponent(cat)}`}
                                    className="shrink-0 w-56 sm:w-64 bg-gray-900 p-5 rounded-2xl border border-gray-800 hover:border-lime-500 transition-all cursor-pointer group snap-start block"
                                >
                                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gray-800 rounded-xl mb-4 group-hover:bg-lime-500/20 transition-colors" aria-hidden />
                                    <h3 className="font-bold text-gray-200 group-hover:text-lime-500 transition-colors text-sm sm:text-base leading-tight">
                                        {cat}
                                    </h3>
                                </Link>
                            ))}
                        </div>

                        {/* Interactive Slider Track */}
                        <div
                            ref={trackRef}
                            onMouseDown={handleDragStart}
                            onTouchStart={handleDragStart}
                            className="w-full h-1 bg-gray-800 mt-8 rounded-full relative cursor-pointer group/track"
                        >
                            <div
                                ref={thumbRef}
                                className={`h-full bg-lime-500 rounded-full absolute top-0 left-0 will-change-transform ${isDragging ? '' : 'transition-transform duration-150 ease-out'}`}
                                style={{
                                    width: `${thumbWidth}px`,
                                }}
                            />
                        </div>
                    </>
                )}
            </div>
        </section>
    );
}
