import React from 'react';
import TechFlickerCard from './TechFlickerCard';
import EqualizerCard from './EqualizerCard';
import PhaseCorrelationCard from './PhaseCorrelationCard';
import BitDepthAnalyticsCard from './BitDepthAnalyticsCard';

const StudioPage = () => {
    return (
        <div className="flex-1 pb-10 dotted-grid bg-[#1b1c1c] text-white">
            {/* Header với Marquee */}
            <header className="sticky top-0 z-40 bg-[#1b1c1c]/90 backdrop-blur-md border-b border-[#2d2e2e]">
                <div className="p-8 pb-4">
                    <div className="flex justify-between items-end mb-6">
                        <div>
                            <h1 className="text-4xl font-bold text-[#c3f400]">Visual Showcase</h1>
                            <p className="text-[10px] text-gray-500 tracking-widest uppercase mt-2">ANALOG-DIGITAL FUSION ENGINE // V.2.0.4</p>
                        </div>
                        <div className="flex items-center gap-2 px-3 py-1 bg-green-900/20 border border-[#c3f400]/20 rounded">
                            <span className="w-2 h-2 bg-[#c3f400] rounded-full animate-pulse"></span>
                            <span className="text-[10px] text-[#c3f400] uppercase font-bold">System Online</span>
                        </div>
                    </div>

                    {/* Marquee */}
                    <div className="overflow-hidden h-8 flex items-center bg-[#151515] border border-[#2d2e2e]">
                        <div className="animate-marquee whitespace-nowrap text-[12px] text-gray-300 uppercase tracking-wider">
                            Synchronicity - The Police (2023 Remastered Audiophile Edition) // Direct Stream Digital 2.8MHz // Reference Class Audio
                        </div>
                    </div>
                </div>
            </header>

            {/* Grid chính: chia tỷ lệ chuẩn */}
            <div className="p-8 grid grid-cols-12 gap-6 max-w-[1600px] mx-auto">
                <div className="col-span-12 lg:col-span-8 h-full"><TechFlickerCard /></div>
                <div className="col-span-12 lg:col-span-4 h-full"><EqualizerCard /></div>
                <div className="col-span-12 lg:col-span-6 h-full"><PhaseCorrelationCard /></div>
                <div className="col-span-12 lg:col-span-6 h-full"><BitDepthAnalyticsCard /></div>
            </div>
        </div>
    );
};

export default StudioPage;