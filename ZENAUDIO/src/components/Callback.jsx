import { useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';

export default function Callback() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    useEffect(() => {
        const accessToken = searchParams.get('access_token');
        const refreshToken = searchParams.get('refresh_token');
        const expiresIn = searchParams.get('expires_in');
        const error = searchParams.get('error');

        if (error) {
            console.error("Lỗi ủy quyền Spotify:", error);
            navigate('/login?error=' + error);
            return;
        }

        if (accessToken) {
            localStorage.setItem('spotify_token', accessToken);
            if (refreshToken) {
                localStorage.setItem('refresh_token', refreshToken);
            }
            if (expiresIn) {
                const expiresAt = Date.now() + parseInt(expiresIn) * 1000;
                localStorage.setItem('expires_at', expiresAt);
            }
            navigate('/home');
        } else {
            // Nếu không có token hay error, kiểm tra xem có code không
            const code = searchParams.get('code');
            if (!code) {
                // Không có gì, chuyển hướng về login
                navigate('/login');
            }
        }
    }, [searchParams, navigate]);

    return (
        <div className="bg-black text-white h-screen w-screen flex flex-col justify-center items-center font-body relative overflow-hidden select-none">
            {/* Background pattern */}
            <div
                className="absolute inset-0 opacity-10 pointer-events-none"
                style={{
                    backgroundImage: 'radial-gradient(#ccff00 1px, transparent 1px)',
                    backgroundSize: '24px 24px'
                }}
            ></div>
            
            {/* Glow effects */}
            <div className="absolute w-[400px] h-[400px] bg-[#ccff00]/5 rounded-full blur-[120px] pointer-events-none animate-pulse"></div>

            <div className="relative z-10 flex flex-col items-center gap-6 text-center max-w-sm px-6">
                {/* Vinyl Record Loading Animation */}
                <div className="relative w-24 h-24 rounded-full bg-[#111] border border-primary/20 shadow-[0_0_40px_rgba(204,255,0,0.15)] flex items-center justify-center animate-spin" style={{ animationDuration: '3s' }}>
                    <div className="absolute inset-2 rounded-full border border-white/5"></div>
                    <div className="absolute inset-4 rounded-full border border-white/5"></div>
                    <div className="absolute inset-6 rounded-full border border-white/5"></div>
                    <div className="w-8 h-8 rounded-full bg-[#ccff00] flex items-center justify-center">
                        <div className="w-2.5 h-2.5 rounded-full bg-black"></div>
                    </div>
                </div>

                <div className="flex flex-col gap-1.5 mt-2">
                    <h2 className="font-pixel text-xs tracking-widest uppercase text-primary">Đang kết nối</h2>
                    <p className="text-secondary text-sm font-medium">Đang thiết lập liên kết với tài khoản Spotify của bạn...</p>
                </div>
            </div>
        </div>
    );
}