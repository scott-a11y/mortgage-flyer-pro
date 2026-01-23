import { FlyerData } from "@/types/flyer";
import { FlyerProfileImage } from "../shared/FlyerProfileImage";

interface FacebookBannerProps {
    data: FlyerData;
    rJumbo: string;
    rFixed15: string;
}

const GOLD = "#D4AF37";
const ONYX = "#050505";

export function FacebookBanner({ data, rJumbo, rFixed15 }: FacebookBannerProps) {
    return (
        <div style={{ width: 1640, height: 624, background: ONYX, position: 'relative', display: 'flex', padding: 60, alignItems: 'center' }} data-capture="banner">
            {/* Left Text */}
            <div style={{ width: '40%' }}>
                <div style={{ color: GOLD, fontSize: 16, letterSpacing: 3, textTransform: 'uppercase', marginBottom: 20 }}>Private Client Update</div>
                <div style={{ fontFamily: 'Playfair Display, serif', color: 'white', fontSize: 80, lineHeight: 1 }}>
                    Liquidity & <span style={{ color: GOLD }}>Acquisition.</span>
                </div>
                <div style={{ display: 'flex', gap: 30, marginTop: 40 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                        <FlyerProfileImage
                            src={data.broker.headshot}
                            alt={data.broker.name}
                            position={data.broker.headshotPosition}
                            className="w-16 h-16 rounded-full"
                            style={{ borderRadius: '50%' }}
                        />
                        <div>
                            <div style={{ color: 'white', fontWeight: 700, fontSize: 18 }}>{data.broker.name}</div>
                            <div style={{ color: '#666', fontSize: 14 }}>{data.broker.title}</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Right Rates */}
            <div style={{ flex: 1, display: 'flex', gap: 30 }}>
                <div style={{ flex: 1, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)', padding: 40, textAlign: 'center' }}>
                    <div style={{ color: '#666', fontSize: 14, textTransform: 'uppercase', letterSpacing: 2 }}>Jumbo</div>
                    <div style={{ fontFamily: 'Playfair Display, serif', fontSize: 80, color: 'white' }}>{rJumbo}<span style={{ fontSize: 20, color: GOLD }}>%</span></div>
                </div>
                <div style={{ flex: 1, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)', padding: 40, textAlign: 'center' }}>
                    <div style={{ color: '#666', fontSize: 14, textTransform: 'uppercase', letterSpacing: 2 }}>15-Yr Acq.</div>
                    <div style={{ fontFamily: 'Playfair Display, serif', fontSize: 80, color: 'white' }}>{rFixed15}<span style={{ fontSize: 20, color: GOLD }}>%</span></div>
                </div>
            </div>
        </div>
    );
}
