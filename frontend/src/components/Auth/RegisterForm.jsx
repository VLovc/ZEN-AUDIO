// src/components/Auth/RegisterForm.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const RegisterForm = () => {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        password: '',
        confirmPassword: '',
        terms: false
    });

    const [focusedField, setFocusedField] = useState('');
    const [emailError, setEmailError] = useState(false);
    const [status, setStatus] = useState('idle');
    const [timestamp, setTimestamp] = useState('');

    useEffect(() => {
        const updateClock = () => {
            const now = new Date();
            const year = now.getFullYear();
            const month = String(now.getMonth() + 1).padStart(2, '0');
            const day = String(now.getDate()).padStart(2, '0');
            const hours = String(now.getHours()).padStart(2, '0');
            const minutes = String(now.getMinutes()).padStart(2, '0');
            const seconds = String(now.getSeconds()).padStart(2, '0');
            setTimestamp(`${year}.${month}.${day} // ${hours}:${minutes}:${seconds}`);
        };

        updateClock();
        const interval = setInterval(updateClock, 1000);
        return () => clearInterval(interval);
    }, []);

    const handleChange = (e) => {
        const { id, value, type, checked } = e.target;
        const currentVal = type === 'checkbox' ? checked : value;
        setFormData(prev => ({ ...prev, [id]: currentVal }));

        if (id === 'email') {
            if (currentVal && !currentVal.includes('@')) {
                setEmailError(true);
            } else {
                setEmailError(false);
            }
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (emailError || status !== 'idle') return;

        if (formData.password !== formData.confirmPassword) {
            alert('Mật khẩu xác nhận không trùng khớp!');
            return;
        }

        setStatus('submitting');
        setTimeout(() => {
            setStatus('success');
            setTimeout(() => {
                navigate('/login');
            }, 1500);
        }, 1500);
    };

    return (
        <div className="bg-background font-body-md text-on-background overflow-hidden h-screen w-screen relative flex flex-col">

            <main className="flex w-full h-[calc(100vh-2rem)] overflow-hidden">

                {/* ================= LEFT SIDE: REGISTRATION FORM ================= */}
                <div className="w-full lg:w-1/2 h-full overflow-y-auto flex items-center justify-center p-6 md:p-10 bg-surface border-r border-outline-variant/30 relative z-10">
                    <div className="max-w-md w-full flex flex-col gap-4 my-auto">

                        {/* Back Button & Brand Logo */}
                        <div className="flex justify-between items-center mb-2 select-none">
                            {/* 🛠️ ĐÃ SỬA: Đổi địa chỉ điều hướng từ '/' sang '/login' khi bấm Trở về */}
                            <button
                                type="button"
                                onClick={() => navigate('/login')}
                                className="flex items-center gap-2 text-on-surface-variant hover:text-primary transition-colors group bg-transparent border-none cursor-pointer"
                            >
                                <span className="material-symbols-outlined text-sm">arrow_back</span>
                                <span className="font-label-pixel text-[10px] uppercase tracking-tighter">Trở về</span>
                            </button>

                            <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/')}>
                                <svg className="size-5 text-on-surface" fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M39.5563 34.1455V13.8546C39.5563 15.708 36.8773 17.3437 32.7927 18.3189C30.2914 18.916 27.263 19.2655 24 19.2655C20.737 19.2655 17.7086 18.916 15.2073 18.3189C11.1227 17.3437 8.44365 15.708 8.44365 13.8546V34.1455C8.44365 35.9988 11.1227 37.6346 15.2073 38.6098C17.7086 39.2069 20.737 39.5564 24 39.5564C27.1288 39.5564 30.2914 39.2069 32.7927 38.6098C36.8773 37.6346 39.5563 35.9988 39.5563 34.1455Z" fill="currentColor"></path>
                                    <path clipRule="evenodd" d="M10.4485 13.8519C10.4749 13.9271 10.6203 14.246 11.379 14.7361C12.298 15.3298 13.7492 15.9145 15.6717 16.3735C18.0007 16.9296 20.8712 17.2655 24 17.2655C27.1288 17.2655 29.9993 16.9296 32.3283 16.3735C34.2508 15.9145 35.702 15.3298 36.621 14.7361C37.3796 14.246 37.5251 13.9271 37.5515 13.8519C37.5287 13.7876 37.4333 13.5973 37.0635 13.2931C36.5266 12.8516 35.6288 12.3647 34.343 11.9175C31.79 11.0295 28.1333 10.4437 24 10.4437C19.8667 10.4437 16.2099 11.0295 13.657 11.9175C12.3712 12.3647 11.4734 12.8516 10.9365 13.2931C10.5667 13.5973 10.4713 13.7876 10.4485 13.8519ZM37.5563 18.7877C36.3176 19.3925 34.8502 19.8839 33.2571 20.2642C30.5836 20.9025 27.3973 21.2655 24 21.2655C20.6027 21.2655 17.4164 20.9025 14.7429 20.2642C13.1498 19.8839 11.6824 19.3925 10.4436 18.7877V34.1275C10.4515 34.1545 10.5427 34.4867 11.379 35.027C12.298 35.6207 13.7492 36.2054 15.6717 36.6644C18.0007 37.2205 20.8712 37.5564 24 37.5564C27.1288 37.5564 29.9993 37.2205 32.3283 36.6644C34.2508 36.2054 35.702 35.6207 36.621 35.027C37.4573 34.4867 37.5485 34.1546 37.5563 34.1275V18.7877ZM41.5563 13.8546V34.1455C41.5563 36.1078 40.158 37.5042 38.7915 38.3869C37.3498 39.3182 35.4192 40.0389 33.2571 40.5551C30.5836 41.1934 27.3973 41.5564 24 41.5564C20.6027 41.5564 17.4164 41.1934 14.7429 40.5551C12.5808 40.0389 10.6502 39.3182 9.20848 38.3869C7.84205 37.5042 6.44365 36.1078 6.44365 34.1455L6.44365 13.8546C6.44365 12.2684 7.37223 11.0454 8.39581 10.2036C9.43325 9.3505 10.8137 8.67141 12.343 8.13948C15.4203 7.06909 19.5418 6.44366 24 6.44366C28.4582 6.44366 32.5797 7.06909 35.657 8.13948C37.1863 8.67141 38.5667 9.3505 39.6042 10.2036C40.6278 11.0454 41.5563 12.2684 41.5563 13.8546Z" fill="currentColor"></path>
                                </svg>
                                <h1 className="font-headline text-base uppercase tracking-tight text-on-surface">Audiophile</h1>
                            </div>
                        </div>

                        {/* Title Section */}
                        <div className="flex flex-col gap-0.5 select-none">
                            <h2 className="font-headline text-2xl font-bold text-on-background">Bắt đầu hành trình</h2>
                            <p className="text-on-surface-variant text-sm font-medium">Kiến tạo không gian nhạc số của riêng bạn chỉ trong vài giây.</p>
                        </div>

                        {/* Registration Form */}
                        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
                            {/* Full Name */}
                            <div className="flex flex-col gap-1.5">
                                <label className={`font-label-pixel text-[10px] uppercase tracking-widest transition-colors ${focusedField === 'fullName' ? 'text-primary font-bold' : 'text-outline'}`} htmlFor="fullName">Họ và Tên</label>
                                <input className="w-full h-12 px-4 bg-surface-container border border-outline-variant rounded-lg font-body-md focus:outline-none neon-glow transition-all text-on-surface text-sm" id="fullName" placeholder="Phung Thanh Do" type="text" value={formData.fullName} onChange={handleChange} onFocus={() => setFocusedField('fullName')} onBlur={() => setFocusedField('')} required />
                            </div>

                            {/* Email */}
                            <div className="flex flex-col gap-1.5">
                                <label className={`font-label-pixel text-[10px] uppercase tracking-widest transition-colors ${focusedField === 'email' ? 'text-primary font-bold' : 'text-outline'}`} htmlFor="email">Email Address</label>
                                <input className={`w-full h-12 px-4 bg-surface-container border rounded-lg font-body-md focus:outline-none neon-glow transition-all text-on-surface text-sm ${emailError ? 'border-error' : 'border-outline-variant'}`} id="email" placeholder="dochomixi@audiophile.com" type="email" value={formData.email} onChange={handleChange} onFocus={() => setFocusedField('email')} onBlur={() => setFocusedField('')} required />
                                {emailError && <p className="text-error font-label-pixel text-[10px] mt-0.5">Định dạng email không hợp lệ</p>}
                            </div>

                            {/* Passwords Column Grid */}
                            <div className="grid grid-cols-2 gap-4">
                                <div className="flex flex-col gap-1.5">
                                    <label className={`font-label-pixel text-[10px] uppercase tracking-widest transition-colors ${focusedField === 'password' ? 'text-primary font-bold' : 'text-outline'}`} htmlFor="password">Mật khẩu</label>
                                    <input className="w-full h-12 px-4 bg-surface-container border border-outline-variant rounded-lg font-body-md focus:outline-none neon-glow transition-all text-on-surface text-sm" id="password" placeholder="••••••••" type="password" value={formData.password} onChange={handleChange} onFocus={() => setFocusedField('password')} onBlur={() => setFocusedField('')} required />
                                </div>
                                <div className="flex flex-col gap-1.5">
                                    <label className={`font-label-pixel text-[10px] uppercase tracking-widest transition-colors ${focusedField === 'confirmPassword' ? 'text-primary font-bold' : 'text-outline'}`} htmlFor="confirmPassword">Xác nhận</label>
                                    <input className="w-full h-12 px-4 bg-surface-container border border-outline-variant rounded-lg font-body-md focus:outline-none neon-glow transition-all text-on-surface text-sm" id="confirmPassword" placeholder="••••••••" type="password" value={formData.confirmPassword} onChange={handleChange} onFocus={() => setFocusedField('confirmPassword')} onBlur={() => setFocusedField('')} required />
                                </div>
                            </div>

                            {/* Terms Agreement Checkbox */}
                            <div className="flex items-start gap-3 select-none pt-1">
                                <div className="pt-0.5">
                                    <input className="w-4 h-4 rounded-sm border-outline-variant text-primary focus:ring-primary bg-surface-container cursor-pointer" id="terms" type="checkbox" checked={formData.terms} onChange={handleChange} required />
                                </div>
                                <label className="text-on-surface-variant font-body-md text-xs leading-relaxed cursor-pointer" htmlFor="terms">
                                    Tôi đồng ý với <a className="text-on-surface font-medium underline underline-offset-4 decoration-primary-container/30 hover:decoration-primary-container transition-all" href="#">Điều khoản</a> và <a className="text-on-surface font-medium underline underline-offset-4 decoration-primary-container/30 hover:decoration-primary-container transition-all" href="#">Bảo mật</a>.
                                </label>
                            </div>

                            {/* Submit Button */}
                            <button type="submit" disabled={status !== 'idle'} className="w-full h-12 mt-1 bg-primary-container text-on-primary-fixed font-headline font-bold text-base rounded-lg hover:shadow-[0_0_20px_rgba(204,255,0,0.5)] transition-all flex items-center justify-center gap-3 active:scale-[0.98] cursor-pointer disabled:opacity-70">
                                {status === 'idle' && (
                                    <>
                                        <span>Đăng ký ngay</span>
                                        <span className="material-symbols-outlined text-base">arrow_forward</span>
                                    </>
                                )}
                                {status === 'submitting' && (
                                    <>
                                        <span className="material-symbols-outlined animate-spin text-base">refresh</span>
                                        <span>Đang khởi tạo...</span>
                                    </>
                                )}
                                {status === 'success' && (
                                    <>
                                        <span className="material-symbols-outlined text-green-700 text-base">check_circle</span>
                                        <span>Thành công!</span>
                                    </>
                                )}
                            </button>
                        </form>

                        {/* Divider */}
                        <div className="flex items-center gap-4 select-none my-0.5">
                            <div className="h-[1px] grow bg-outline-variant"></div>
                            <span className="font-label-pixel text-[10px] text-outline-variant uppercase">Hoặc đăng ký bằng</span>
                            <div className="h-[1px] grow bg-outline-variant"></div>
                        </div>

                        {/* Social Logins */}
                        <div className="grid grid-cols-2 gap-4">
                            <button className="h-10 border border-outline-variant rounded-lg flex items-center justify-center gap-2 hover:bg-surface-container-low transition-colors group cursor-pointer text-on-surface text-xs font-semibold">
                                <img alt="Google" className="size-4 grayscale group-hover:grayscale-0 transition-all" src="https://www.google.com/favicon.ico" />
                                <span>Google</span>
                            </button>
                            <button className="h-10 border border-outline-variant rounded-lg flex items-center justify-center gap-2 hover:bg-surface-container-low transition-colors group cursor-pointer text-on-surface text-xs font-semibold">
                                <span className="material-symbols-outlined text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>ios</span>
                                <span>Apple ID</span>
                            </button>
                        </div>

                        {/* Navigation Redirection to Login Page */}
                        <p className="text-center font-body-md text-on-surface-variant text-xs select-none mt-0.5">
                            Đã có tài khoản?{' '}
                            <button onClick={() => navigate('/login')} className="text-primary font-bold hover:underline bg-transparent border-none p-0 cursor-pointer text-xs ml-1">
                                Đăng nhập
                            </button>
                        </p>
                    </div>
                </div>

                {/* ================= RIGHT SIDE: VISUAL POSTER COLLAGE ================= */}
                <aside className="hidden lg:flex lg:w-1/2 h-full relative overflow-hidden bg-black items-center justify-center select-none">
                    <div className="absolute inset-0 pixel-grid pointer-events-none"></div>
                    <div className="gritty-overlay"></div>

                    <div className="relative z-10 h-full max-h-full w-full flex flex-col p-8 justify-between overflow-hidden">

                        {/* Upper Details Grid Header */}
                        <div className="flex justify-between items-start shrink-0 mb-4">
                            <div className="flex flex-col">
                                <h2 className="distressed-text text-3xl leading-[0.8] font-black text-[#e2e2e2] opacity-90">FEEL THE</h2>
                                <h2 className="distressed-text text-5xl leading-[0.8] font-black text-[#e2e2e2] opacity-90">SOUND!</h2>
                            </div>
                            <div className="flex flex-col items-end gap-0.5 font-label-pixel text-[8px]">
                                <span className="text-[#ccff00] tracking-widest">SIGNAL STRENGTH: 98%</span>
                                <span className="text-[#ccff00]/60 tracking-widest">LATENCY: 1.2MS</span>
                                <div className="h-[1px] w-24 bg-[#ccff00]/30 mt-1"></div>
                            </div>
                        </div>

                        {/* Industrial Layout Collage Frame Area */}
                        <div className="flex-1 min-h-0 grid grid-cols-12 grid-rows-[repeat(12,minmax(0,1fr))] gap-3 relative my-2">
                            {/* Frame 1: Audio Interface Monitor */}
                            <div className="col-span-8 row-span-7 frame-border collage-frame bg-[#101010] glow-blue">
                                <img alt="Audio Interface" className="w-full h-full object-cover opacity-100 mix-blend-screen" src="https://i.pinimg.com/736x/bf/c8/50/bfc850ce2fcef2c642242e205d6ee8b6.jpg" />
                                <div className="absolute top-2 left-2 font-label-pixel text-[10px] text-[#5f8f00]">DECODING LOSSLESS...</div>
                                <svg className="absolute bottom-0 left-0 w-full h-1/2 opacity-30" preserveAspectRatio="none" viewBox="0 0 200 60">
                                    <path d="M0 30 Q 10 10, 20 30 T 40 30 T 60 30 T 80 30 T 100 30 T 120 30 T 140 30 T 160 30 T 180 30 T 200 30" fill="none" stroke="#ccff00" strokeWidth="0.5"></path>
                                </svg>
                            </div>

                            {/* Frame 2: Core Heartbeat Pulse */}
                            <div className="col-span-4 row-span-3 col-start-9 frame-border bg-black/40 backdrop-blur-md flex flex-col items-center justify-center p-2 overflow-hidden">
                                <div className="w-8 h-8 rounded-full border border-[#ccff00]/30 flex items-center justify-center">
                                    <span className="material-symbols-outlined text-[#68ff4a] text-lg animate-pulse" style={{ fontVariationSettings: "'FILL' 1" }}>favorite</span>
                                </div>
                                <span className="font-label-pixel text-[6px] mt-1.5 text-[#ccff00] tracking-widest uppercase text-center">CORE_HEARTBEAT</span>
                            </div>

                            {/* Frame 3: Technical Blueprint Matrix */}
                            <div className="col-span-4 row-span-5 col-start-9 row-start-4 frame-border overflow-hidden bg-black">
                                <img alt="Blueprint" className="w-full h-full object-cover opacity-30" src="https://i.pinimg.com/736x/97/55/9f/97559fee843e96e5110506a4c09acce2.jpg" />
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <span className="font-label-pixel text-[7px] text-[#ccff00] rotate-0 tracking-[0.5em]">BUFFERING...</span>
                                </div>
                            </div>

                            {/* 🛠️ SỬA ĐỔI CHÍNH: Thêm 'group' vào Frame 4 và đổi các class của ảnh để hover khôi phục màu */}
                            <div className="col-span-7 row-span-5 row-start-8 frame-border collage-frame bg-[#050505] group">
                                <img
                                    alt="Detail"
                                    className="w-full h-full object-cover opacity-40 mix-blend-luminosity transition-all duration-500 group-hover:mix-blend-normal group-hover:opacity-100"
                                    src="https://i.pinimg.com/1200x/fb/9c/47/fb9c4735125bb4d96a1761869123e4e2.jpg"
                                />
                                <div className="absolute bottom-2 right-2 font-label-pixel text-[7px] text-[#ccff00]">DITHERING ON</div>
                            </div>

                            {/* 🛠️ SỬA ĐỔI CHÍNH: Thêm 'group' vào Frame 5, đồng bộ cấu trúc 'absolute inset-0' và 'group-hover' tương tự Frame 4 */}
                            <div className="col-span-5 row-span-4 col-start-8 row-start-9 frame-border collage-frame bg-[#111] flex flex-col justify-end p-2 overflow-hidden group">
                                <img
                                    alt="Detail"
                                    className="w-full h-full object-cover opacity-40 mix-blend-luminosity absolute inset-0 pointer-events-none transition-all duration-500 group-hover:mix-blend-normal group-hover:opacity-100"
                                    src="https://i.pinimg.com/736x/12/20/df/1220dfee622d5348546fae2b4c893b27.jpg"
                                />
                                <div className="relative z-10 pointer-events-none">
                                    <div className="font-label-pixel text-[5px] text-white/30 mb-0.5 uppercase">Output_Stage_V3</div>
                                    <div className="h-1 bg-white/10 w-full mb-0.5">
                                        <div className="h-full bg-[#ccff00] w-2/3"></div>
                                    </div>
                                    <div className="font-label-pixel text-[7px] text-[#ccff00]">PEAK: -0.2dB</div>
                                </div>
                            </div>
                        </div>

                        {/* Lower Typography Deck Assembly */}
                        <div className="mt-4 flex justify-between items-end shrink-0">
                            <div className="font-label-pixel text-[7px] text-[#ccff00]/40 flex flex-col">
                                <span>ID: AUDIO_PHILE_X_99</span>
                                <span>REF: 0x82A1C9</span>
                            </div>
                            <div className="flex flex-col items-end">
                                <h2 className="distressed-text text-xl leading-[0.9] font-black text-[#ccff00] opacity-80">ANALOG</h2>
                                <h2 className="distressed-text text-4xl leading-[0.8] font-black text-[#e2e2e2] opacity-90 -mr-2">SOUL!</h2>
                            </div>
                        </div>

                        {/* Lateral Rotated Technical Labels */}
                        <div className="absolute top-1/2 left-4 -translate-y-1/2 flex flex-col gap-6 opacity-10">
                            <div className="font-label-pixel text-[6px] text-[#ccff00] -rotate-90 origin-left">SPECTRUM_ANALYSIS_ACTIVE</div>
                            <div className="font-label-pixel text-[6px] text-[#ccff00] -rotate-90 origin-left">GATE_OPEN_0.1MS</div>
                        </div>
                    </div>
                </aside>
            </main>

            {/* ================= RETRO BOTTOM ENCRYPTED STATUS BAR ================= */}
            <div className="h-8 bg-on-surface flex items-center px-4 justify-between font-label-pixel text-[9px] text-outline uppercase tracking-[0.2em] border-t border-outline/20 z-50 select-none">
                <div className="flex gap-4">
                    <span className="text-primary font-bold">Live: Server_HCMC_01</span>
                    <span id="timestamp" className="text-zinc-500">{timestamp}</span>
                </div>
                <div className="flex gap-4 items-center">
                    <div className="flex gap-1">
                        <div className="w-1 h-3 bg-primary/20"></div>
                        <div className="w-1 h-3 bg-primary/40"></div>
                        <div className="w-1 h-3 bg-primary"></div>
                    </div>
                    <span>Encrypted Audio Stream</span>
                </div>
            </div>
        </div>
    );
};

export default RegisterForm;