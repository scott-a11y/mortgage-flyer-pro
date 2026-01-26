import { FlyerData } from "@/types/flyer";
import { ShieldCheck, Landmark, TrendingDown } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import { FlyerProfileImage } from "../shared/FlyerProfileImage";

interface SocialBannerProps {
    data: FlyerData;
    rJumbo: string;
    rFixed15: string;
    shareUrl: string;
}

const GOLD = "#D4AF37";
const ONYX = "#050505";

export function SocialBanner({ data, rJumbo, rFixed15, shareUrl }: SocialBannerProps) {
    return (
        <div style={{ width: 1080, height: 1080, background: ONYX, display: 'flex', flexDirection: 'column', position: 'relative' }} data-capture="banner">
            <div style={{ position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)', width: 600, height: 300, background: 'rgba(212, 175, 55, 0.1)', filter: 'blur(120px)', borderRadius: '50%' }} />

            {/* Header */}
            <div style={{ padding: '80px 40px', textAlign: 'center', zIndex: 10 }}>
                <div style={{ display: 'inline-block', padding: '8px 24px', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 50, marginBottom: 30, background: 'rgba(255,255,255,0.03)' }}>
                    <span style={{ color: GOLD, fontSize: 14, letterSpacing: 3, textTransform: 'uppercase', fontWeight: 600 }}>Private Client Market Update</span>
                </div>
                <div style={{ fontFamily: 'Playfair Display, serif', color: 'white', fontSize: 80, lineHeight: 1 }}>
                    Liquidity & <span style={{ background: `linear-gradient(to right, #FFE5A0, ${GOLD})`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Acquisition.</span>
                </div>
            </div>

            {/* Grid */}
            <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 40, padding: '0 60px' }}>
                <div style={{ background: '#0a0a0c', border: '1px solid rgba(255,255,255,0.05)', padding: 40, textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                    <ShieldCheck size={40} color={GOLD} style={{ marginBottom: 20, opacity: 0.8 }} />
                    <div style={{ color: '#555', fontSize: 14, textTransform: 'uppercase', letterSpacing: 2, marginBottom: 8 }}>Jumbo Portfolio</div>
                    <div style={{ fontFamily: 'Playfair Display, serif', color: 'white', fontSize: 72 }}>{rJumbo}<span style={{ fontSize: 24, fontStyle: 'italic', color: GOLD }}>%</span></div>
                    <div style={{ color: '#444', fontSize: 14, marginTop: 12 }}>Flexible underwriting for HNW liquidity.</div>
                </div>

                <div style={{ background: `linear-gradient(to bottom, rgba(212, 175, 55, 0.1), transparent)`, border: `1px solid ${GOLD}40`, padding: 40, textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
                    <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 1, background: `linear-gradient(90deg, transparent, ${GOLD}, transparent)` }} />
                    <Landmark size={40} color={GOLD} style={{ marginBottom: 20 }} />
                    <div style={{ color: GOLD, fontSize: 14, textTransform: 'uppercase', letterSpacing: 2, marginBottom: 8, fontWeight: 700 }}>Bridge Strategy</div>
                    <div style={{ fontFamily: 'Playfair Display, serif', color: 'white', fontSize: 36, fontStyle: 'italic' }}>Non-Contingent</div>
                    <div style={{ color: GOLD, fontSize: 14, marginTop: 12, opacity: 0.8 }}>Secure the asset first.</div>
                </div>

                <div style={{ background: '#0a0a0c', border: '1px solid rgba(255,255,255,0.05)', padding: 40, textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                    <TrendingDown size={40} color={GOLD} style={{ marginBottom: 20, opacity: 0.8 }} />
                    <div style={{ color: '#555', fontSize: 14, textTransform: 'uppercase', letterSpacing: 2, marginBottom: 8 }}>15-Year Acq.</div>
                    <div style={{ fontFamily: 'Playfair Display, serif', color: 'white', fontSize: 72 }}>{rFixed15}<span style={{ fontSize: 24, fontStyle: 'italic', color: GOLD }}>%</span></div>
                    <div style={{ color: '#444', fontSize: 14, marginTop: 12 }}>Accelerated equity strategy.</div>
                </div>
            </div>

            {/* Footer */}
            <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', padding: '40px 60px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#0a0a0c' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
                    <FlyerProfileImage
                        src={data.broker.headshot}
                        alt={data.broker.name}
                        position={data.broker.headshotPosition}
                        className="w-24 h-24 rounded-full"
                        style={{ borderRadius: '50%' }}
                    />
                    <div>
                        <div style={{ fontFamily: 'Playfair Display, serif', color: 'white', fontSize: 24 }}>{data.broker.name}</div>
                        <div style={{ color: GOLD, fontSize: 14, letterSpacing: 1, textTransform: 'uppercase' }}>{data.broker.title}</div>
                        <div style={{ color: '#666', fontSize: 14 }}>NMLS #{data.broker.nmls}</div>
                    </div>
                </div>
                <div style={{ textAlign: 'center' }}>
                    <QRCodeSVG value={shareUrl} size={60} fgColor="white" bgColor="transparent" />
                    <div style={{ color: '#444', fontSize: 10, letterSpacing: 1, textTransform: 'uppercase', marginTop: 8 }}>
                        {data.cta.qrLabel || "Scan Me"}
                    </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 20, flexDirection: 'row-reverse', textAlign: 'right' }}>
                    <FlyerProfileImage
                        src={data.realtor.headshot}
                        alt={data.realtor.name}
                        position={data.realtor.headshotPosition}
                        className="w-24 h-24 rounded-full"
                        style={{ borderRadius: '50%' }}
                    />
                    <div>
                        <div style={{ fontFamily: 'Playfair Display, serif', color: 'white', fontSize: 24 }}>{data.realtor.name}</div>
                        <div style={{ color: GOLD, fontSize: 14, letterSpacing: 1, textTransform: 'uppercase' }}>{data.realtor.title}</div>
                        <div style={{ color: '#666', fontSize: 14 }}>{data.realtor.email}</div>
                    </div>
                </div>
            </div>
        </div>
    );
}
