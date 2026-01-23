import { cn } from "@/lib/utils";

interface FlyerProfileImageProps {
    src?: string;
    alt: string;
    position?: number;
    className?: string;
    style?: React.CSSProperties;
}

export function FlyerProfileImage({ src, alt, position = 50, className, style }: FlyerProfileImageProps) {
    if (!src) return null;

    return (
        <div className={cn("overflow-hidden flex-shrink-0", className)} style={style}>
            <img
                src={src}
                alt={alt}
                className="w-full h-full object-cover"
                style={{ objectPosition: `center ${position}%` }}
            />
        </div>
    );
}
