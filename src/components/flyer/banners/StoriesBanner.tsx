import { FlyerData } from "@/types/flyer";
import { QRCodeSVG } from "qrcode.react";

interface StoriesBannerProps {
    data: FlyerData;
    rJumbo: string;
    rFixed15: string;
    shareUrl: string;
}

const GOLD = "#D4AF37";
const ONYX = "#050505";

export function StoriesBanner({ data, rJumbo, rFixed15, shareUrl }: StoriesBannerProps) {
    return (
        <div style={{ width: 1080, height: 1920, background: ONYX, position: 'relative', display: 'flex', flexDirection: 'column' }} data-capture="banner">
            <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: 600, background: 'linear-gradient(180deg, rgba(212,175,55,0.08), transparent)' }} />

            <div style={{ padding: '120px 80px', textAlign: 'center', zIndex: 10 }}>
                <div style={{ color: GOLD, fontSize: 20, letterSpacing: 6, textTransform: 'uppercase', marginBottom: 20 }}>Market Update</div>
                <div style={{ fontFamily: 'Playfair Display, serif', color: 'white', fontSize: 100, lineHeight: 1 }}>
                    Liquidity & <span style={{ color: GOLD }}>Acquisition.</span>
                </div>
            </div>

            <div style={{ flex: 1, padding: '0 80px', display: 'flex', flexDirection: 'column', gap: 40 }}>
                <div style={{ background: '#0a0a0c', border: '1px solid rgba(255,255,255,0.05)', padding: 60, textAlign: 'center', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                    <div style={{ color: '#555', fontSize: 20, textTransform: 'uppercase', letterSpacing: 4, marginBottom: 16 }}>Jumbo Portfolio</div>
                    <div style={{ fontFamily: 'Playfair Display, serif', color: 'white', fontSize: 140 }}>{rJumbo}<span style={{ fontSize: 40, fontStyle: 'italic', color: GOLD }}>%</span></div>
                </div>

                <div style={{ background: '#0a0a0c', border: '1px solid rgba(255,255,255,0.05)', padding: 60, textAlign: 'center', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                    <div style={{ color: '#555', fontSize: 20, textTransform: 'uppercase', letterSpacing: 4, marginBottom: 16 }}>15-Year Acq.</div>
                    <div style={{ fontFamily: 'Playfair Display, serif', color: 'white', fontSize: 140 }}>{rFixed15}<span style={{ fontSize: 40, fontStyle: 'italic', color: GOLD }}>%</span></div>
                </div>
            </div>

            {/* Footer */}
            <div style={{ padding: '100px 80px', textAlign: 'center' }}>
                <div style={{ display: 'inline-block', background: 'white', padding: 20, borderRadius: 20, marginBottom: 40 }}>
                    <QRCodeSVG value={shareUrl} size={100} />
                </div>
                <div style={{ fontFamily: 'Playfair Display, serif', fontSize: 40, color: 'white' }}>{data.broker.name} <span style={{ color: '#555', fontFamily: 'Inter' }}>x</span> {data.realtor.name}</div>
            </div>
        </div>
    );
}
