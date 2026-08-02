import { useRef, useState, useEffect } from 'react';
import { ChevronRight, ChevronLeft } from 'lucide-react';

export default function ScrollableRow({ children, className = '' }) {
    const scrollRef = useRef(null);
    const [canScrollRight, setCanScrollRight] = useState(false);
    const [canScrollLeft, setCanScrollLeft] = useState(false);

    const checkScroll = () => {
        if (scrollRef.current) {
            const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
            setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 5);
            setCanScrollLeft(scrollLeft > 5);
        }
    };

    useEffect(() => {
        checkScroll();
        window.addEventListener('resize', checkScroll);
        // Small delay to check after initial render layout
        const timer = setTimeout(checkScroll, 100);
        return () => {
            window.removeEventListener('resize', checkScroll);
            clearTimeout(timer);
        };
    }, [children]);

    const scrollRight = () => {
        if (scrollRef.current) {
            scrollRef.current.scrollBy({ left: 250, behavior: 'smooth' });
        }
    };

    const scrollLeftFn = () => {
        if (scrollRef.current) {
            scrollRef.current.scrollBy({ left: -250, behavior: 'smooth' });
        }
    };

    return (
        <div className="relative w-full">
            {canScrollLeft && (
                <div className="absolute left-0 top-0 bottom-0 w-12 bg-gradient-to-r from-white via-white to-transparent flex items-center justify-start pointer-events-none z-10">
                    <button 
                        onClick={scrollLeftFn}
                        className="w-6 h-6 flex items-center justify-start text-gray-400 hover:text-black pointer-events-auto transition-colors bg-transparent"
                        aria-label="Scroll left"
                    >
                        <ChevronLeft size={20} strokeWidth={1.5} />
                    </button>
                </div>
            )}
            
            <div 
                ref={scrollRef}
                onScroll={checkScroll}
                className={`flex flex-nowrap overflow-x-auto no-scrollbar w-full ${className}`}
            >
                {children}
            </div>

            {canScrollRight && (
                <div className="absolute right-0 top-0 bottom-0 w-12 bg-gradient-to-l from-white via-white to-transparent flex items-center justify-end pointer-events-none z-10">
                    <button 
                        onClick={scrollRight}
                        className="w-6 h-6 flex items-center justify-end text-gray-400 hover:text-black pointer-events-auto transition-colors bg-transparent"
                        aria-label="Scroll right"
                    >
                        <ChevronRight size={20} strokeWidth={1.5} />
                    </button>
                </div>
            )}
        </div>
    );
}
