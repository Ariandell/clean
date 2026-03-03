import React from 'react';

const auroraKeyframes = `
@keyframes aurora-1 {
    0%, 100% { transform: translate(0, 0) scale(1); }
    33% { transform: translate(30px, -50px) scale(1.1); }
    66% { transform: translate(-20px, 30px) scale(0.95); }
}
@keyframes aurora-2 {
    0%, 100% { transform: translate(0, 0) scale(1); }
    33% { transform: translate(-40px, 30px) scale(1.1); }
    66% { transform: translate(25px, -40px) scale(0.9); }
}
@keyframes aurora-3 {
    0%, 100% { transform: translate(0, 0) scale(1); }
    50% { transform: translate(35px, 35px) scale(1.05); }
}
`;

export const AuroraBackground = () => {
    return (
        <div className="fixed inset-0 z-0 bg-[#000000] overflow-hidden pointer-events-none">
            <style>{auroraKeyframes}</style>



            <div className="absolute inset-0 opacity-60">

                <div
                    className="absolute top-[40%] -right-[10%] w-[70vw] h-[70vw] rounded-full blur-[100px] mix-blend-screen"
                    style={{
                        background: 'radial-gradient(circle, rgba(16, 185, 129, 0.15) 0%, rgba(5, 150, 105, 0.05) 50%, transparent 70%)',
                        animation: 'aurora-1 25s ease-in-out infinite',
                    }}
                />


                <div
                    className="absolute -top-[10%] -left-[10%] w-[80vw] h-[80vw] rounded-full blur-[100px] mix-blend-screen"
                    style={{
                        background: 'radial-gradient(circle, rgba(99, 102, 241, 0.15) 0%, rgba(67, 56, 202, 0.05) 50%, transparent 70%)',
                        animation: 'aurora-2 30s ease-in-out infinite reverse',
                    }}
                />


                <div
                    className="absolute top-[50%] -left-[20%] w-[60vw] h-[60vw] rounded-full blur-[120px] mix-blend-screen"
                    style={{
                        background: 'radial-gradient(circle, rgba(139, 92, 246, 0.12) 0%, rgba(109, 40, 217, 0.04) 50%, transparent 70%)',
                        animation: 'aurora-3 28s ease-in-out infinite',
                    }}
                />


                <div
                    className="absolute top-[20%] left-[20%] w-[50vw] h-[50vw] rounded-full blur-[100px] mix-blend-screen"
                    style={{
                        background: 'radial-gradient(circle, rgba(6, 182, 212, 0.10) 0%, transparent 60%)',
                        animation: 'aurora-1 35s ease-in-out infinite reverse',
                    }}
                />
            </div>



            <div className="absolute inset-0 opacity-[0.25] mix-blend-overlay pointer-events-none"
                style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
                }}
            />


            <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/60 pointer-events-none" />
        </div>
    );
};
