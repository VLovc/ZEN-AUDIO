import { useState, useEffect } from 'react';
const SearchHeader = () => {
    const [latency, setLatency] = useState('0.1ms');
    useEffect(() => {
        const interval = setInterval(() => {
            const lats = ['0.1ms', '0.08ms', '0.12ms'];
            setLatency(lats[Math.floor(Math.random() * lats.length)]);
        }, 3000);
        return () => clearInterval(interval);
    }, []);
    return (
        <div className="mb-10 flex justify-between items-end select-none">
            <div>
                <p className="font-label-pixel text-primary font-bold mb-2">/EXPLORE/FREQUENCIES</p>
                <h2 className="font-headline text-4xl sm:text-[40px] tracking-tight font-bold text-on-surface">Music Categories</h2>
            </div>
            <div className="text-right flex flex-col gap-0.5">
                <p className="font-label-pixel text-[10px] text-secondary">ACTIVE_SESSIONS: 1,284</p>
                <p className="font-label-pixel text-[10px] text-primary">LATENCY: {latency}</p>
            </div>
        </div>
    );
};
export default SearchHeader;