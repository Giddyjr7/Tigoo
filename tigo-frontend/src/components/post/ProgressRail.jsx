import { useEffect, useState } from 'react';

export default function ProgressRail() {
    const [headings, setHeadings] = useState([]);
    const [activeId, setActiveId] = useState('');

    useEffect(() => {
        // Small delay to ensure the dangerouslySetInnerHTML has painted
        const timer = setTimeout(() => {
            const elements = Array.from(document.querySelectorAll('.prose h2, .prose h3'));
            
            // Add IDs to headings if they don't have them
            elements.forEach((el, index) => {
                if (!el.id) {
                    el.id = `section-${index}`;
                }
            });

            const headingData = elements.map(el => ({
                id: el.id,
                text: el.innerText
            }));
            
            setHeadings(headingData);

            const handleScroll = () => {
                const scrollY = window.scrollY;
                const threshold = scrollY + 150; 
                
                let current = '';
                for (let i = 0; i < elements.length; i++) {
                    const el = elements[i];
                    const top = el.getBoundingClientRect().top + window.scrollY;
                    if (threshold >= top) {
                        current = el.id;
                    }
                }
                setActiveId(current);
            };

            window.addEventListener('scroll', handleScroll);
            handleScroll();

            return () => window.removeEventListener('scroll', handleScroll);
        }, 100);

        return () => clearTimeout(timer);
    }, []);

    const scrollTo = (id) => {
        const el = document.getElementById(id);
        if (el) {
            window.scrollTo({
                top: el.getBoundingClientRect().top + window.scrollY - 100,
                behavior: 'smooth'
            });
        }
    };

    if (headings.length === 0) return null;

    return (
        <div className="fixed right-4 2xl:right-12 top-1/2 -translate-y-1/2 z-40 hidden xl:block group">
            <div className="flex flex-col gap-1 items-end">
                {headings.map((h) => {
                    const isActive = activeId === h.id;
                    return (
                        <div 
                            key={h.id} 
                            onClick={() => scrollTo(h.id)}
                            className="flex items-center gap-4 cursor-pointer justify-end h-8 group/item"
                        >
                            <span className={`text-sm whitespace-nowrap transition-all duration-300 overflow-hidden text-right
                                ${isActive ? 'text-text-h font-medium' : 'text-text hover:text-text-h'}
                                max-w-0 opacity-0 group-hover:max-w-[250px] group-hover:opacity-100 pr-2`}
                            >
                                {h.text}
                            </span>
                            <div 
                                className={`w-1 rounded-full transition-all duration-300 
                                    ${isActive ? 'h-6 bg-text-h' : 'h-3 bg-border group-hover/item:bg-text'}`}
                            />
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
