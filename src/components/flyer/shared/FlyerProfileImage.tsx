import { cn } from "@/lib/utils";
import { useState } from "react";

interface FlyerProfileImageProps {
    src?: string;
    alt: string;
    position?: number;
    className?: string;
    style?: React.CSSProperties;
}

export function FlyerProfileImage({ src, alt, position = 50, className, style }: FlyerProfileImageProps) {
    const [error, setError] = useState(false);

    // Get initials from alt name (e.g. "Adrian Mitchell" -> "AM")
    const initials = alt
        .split(' ')
        .map(n => n.charAt(0))
        .join('')
        .toUpperCase()
        .substring(0, 2);

    if (!src || error) {
        return (
            <div
                className={cn("flex-shrink-0 flex items-center justify-center bg-slate-800 text-amber-500 font-bold border-2 border-amber-500/20", className)}
                style={style}
            >
                {initials}
            </div>
        );
    }

    return (
        <div className={cn("overflow-hidden flex-shrink-0", className)} style={style}>
            <img
                src={src}
                alt={alt}
                className="w-full h-full object-cover"
                style={{ objectPosition: `center ${position}%` }}
                onError={() => setError(true)}
                crossOrigin="anonymous"
            />
        </div>
    );
}
