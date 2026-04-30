export default function Loading() {
    return (
        <div className="fixed inset-0 bg-white/80 backdrop-blur-sm z-[9999] flex items-center justify-center">
            <div className="relative">
                <div className="w-16 h-16 border-4 border-[#1e3a8a]/10 border-t-[#1e3a8a] rounded-full animate-spin"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-2 h-2 bg-[#1e3a8a] rounded-full animate-ping"></div>
                </div>
            </div>
        </div>
    );
}
