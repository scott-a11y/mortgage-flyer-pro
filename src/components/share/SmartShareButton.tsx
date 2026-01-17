import { useState } from 'react';
import { Share2, Copy, Smartphone } from 'lucide-react';
import { toast } from 'sonner';

interface SmartShareProps {
    onGenerateBlob: () => Promise<Blob | null>;
    title?: string;
    text?: string;
}

export const SmartShareButton = ({
    onGenerateBlob,
    title = "Check out this new listing!",
    text = "Contact me for the latest rates. #RealEstate #Mortgage"
}: SmartShareProps) => {
    const [isSharing, setIsSharing] = useState(false);

    // 1. The Magic "Native Share" Function
    const handleNativeShare = async () => {
        setIsSharing(true);
        const toastId = toast.loading("Preparing optimized image...");

        try {
            const blob = await onGenerateBlob();
            if (!blob) throw new Error("Failed to generate image");

            const file = new File([blob], 'rate-flyer.png', { type: 'image/png' });

            // Check if the browser supports sharing FILES (Mobile mostly)
            if (navigator.canShare && navigator.canShare({ files: [file] })) {
                toast.dismiss(toastId);
                await navigator.share({
                    files: [file],
                    title: title,
                    text: text,
                });
                toast.success("Shared successfully!");
            } else {
                throw new Error("Native file sharing not supported");
            }
        } catch (error) {
            console.log("Fallback to clipboard/download", error);
            toast.dismiss(toastId);
            handleFallbackShare();
        } finally {
            setIsSharing(false);
        }
    };

    // 2. The Fallback (Desktop / Non-compatible browsers)
    const handleFallbackShare = async () => {
        try {
            const blob = await onGenerateBlob();
            if (!blob) throw new Error("Failed to generate image");

            // Smart Clipboard: Writes the IMAGE to clipboard
            await navigator.clipboard.write([
                new ClipboardItem({
                    [blob.type]: blob,
                }),
            ]);
            toast.success("Image copied to clipboard!", { description: "Paste it directly into Instagram, Email, or Slack." });
        } catch (err) {
            // Absolute worst case: Download the file
            if (typeof window !== 'undefined') {
                const link = document.createElement('a');
                const blob = await onGenerateBlob();
                if (blob) {
                    link.href = URL.createObjectURL(blob);
                    link.download = 'rate-flyer.png';
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                    toast.success("Flyer image downloaded.");
                }
            }
        }
    };

    return (
        <div className="flex flex-col gap-3 w-full max-w-sm mx-auto">
            {/* The "One Tap" Hero Button */}
            <button
                onClick={handleNativeShare}
                disabled={isSharing}
                className="bg-blue-600 hover:bg-blue-700 text-white text-lg font-bold py-4 px-6 rounded-xl shadow-xl flex items-center justify-center gap-3 transition-transform active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed"
            >
                {isSharing ? (
                    "Preparing..."
                ) : (
                    <>
                        <Share2 className="w-6 h-6" />
                        Post to Instagram / Socials
                    </>
                )}
            </button>

            {/* Helper Text */}
            <p className="text-[10px] text-center text-slate-400 mt-1">
                Tapping above opens your phone's native share menu. <br />
                Select <strong className="text-slate-200">Instagram Stories</strong> or <strong className="text-slate-200">Messages</strong>.
            </p>

            {/* Secondary Options (Desktop friendly) */}
            <div className="grid grid-cols-1 gap-3 mt-1">
                <button
                    onClick={handleFallbackShare}
                    className="bg-white/5 border border-white/10 text-slate-400 py-2.5 rounded-lg text-xs font-medium flex items-center justify-center gap-2 hover:bg-white/10 hover:text-white transition-colors"
                >
                    <Copy className="w-3.5 h-3.5" /> Copy Image to Clipboard
                </button>
            </div>
        </div >
    );
};
