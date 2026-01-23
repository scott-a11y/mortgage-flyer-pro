import { FlyerData } from "@/types/flyer";
import { FlyerProfileImage } from "../shared/FlyerProfileImage";

interface EmailBannerProps {
    data: FlyerData;
    label1: string;
    value1: string;
    label3: string;
    rFixed15: string;
}

const GOLD = "#D4AF37";
const ONYX = "#050505";

export function EmailBanner({ data, label1, value1, label3, rFixed15 }: EmailBannerProps) {
    return (
        <div style={{ width: 600, height: 200, background: ONYX, overflow: 'hidden', position: 'relative' }} data-capture="banner">
            {/* Glow */}
            <div style={{ position: 'absolute', top: -50, left: 200, width: 200, height: 200, background: 'rgba(212, 175, 55, 0.15)', filter: 'blur(60px)', borderRadius: '50%', zIndex: 1 }} />

            <div style={{ display: 'flex', height: '100%', alignItems: 'center', padding: '0 24px', justifyContent: 'space-between', fontFamily: 'Inter, sans-serif', position: 'relative', zIndex: 10 }}>
                {/* Left: Broker */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, width: 160 }}>
                    <FlyerProfileImage
                        src={data.broker.headshot}
                        alt={data.broker.name}
                        position={data.broker.headshotPosition}
                        className="w-10 h-10 rounded-full"
                        style={{ borderRadius: '50%' }}
                    />
                    <div>
                        <div style={{ color: 'white', fontSize: 11, fontWeight: 700 }}>{data.broker.name}</div>
                        <div style={{ color: GOLD, fontSize: 8, letterSpacing: 0.5, textTransform: 'uppercase' }}>{data.broker.title}</div>
                        <div style={{ color: '#666', fontSize: 8 }}>NMLS #{data.broker.nmls}</div>
                    </div>
                </div>

                {/* Center: Rates Grid (Compact) */}
                <div style={{ display: 'flex', gap: 8, flex: 1, justifySelf: 'center', justifyContent: 'center' }}>
                    {[
                        { l: label1, v: value1 },
                        { l: 'Bridge', v: 'Non-Contingent' },
                        { l: label3, v: rFixed15 }
                    ].map(r => (
                        <div key={r.l} style={{ textAlign: 'center', background: 'rgba(255,255,255,0.03)', padding: '6px 10px', border: '1px solid rgba(255,255,255,0.05)', borderRadius: 6, width: 85 }}>
                            <div style={{ color: '#666', fontSize: 7, textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 2 }}>{r.l}</div>
                            {r.l === 'Bridge' ? (
                                <div style={{ fontFamily: 'Playfair Display, serif', color: 'white', fontSize: r.v.length > 10 ? 9 : 10, fontStyle: 'italic', paddingTop: 4, letterSpacing: r.v.length > 10 ? -0.5 : 0 }}>{r.v}</div>
                            ) : (
                                <div style={{ fontFamily: 'Playfair Display, serif', color: 'white', fontSize: 16 }}>{r.v}<span style={{ fontSize: 8, color: GOLD, fontStyle: 'italic' }}>%</span></div>
                            )}
                        </div>
                    ))}
                </div>

                {/* Right: Realtor */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexDirection: 'row-reverse', width: 160, textAlign: 'right' }}>
                    <FlyerProfileImage
                        src={data.realtor.headshot}
                        alt={data.realtor.name}
                        position={data.realtor.headshotPosition}
                        className="w-10 h-10 rounded-full"
                        style={{ borderRadius: '50%' }}
                    />
                    <div>
                        <div style={{ color: 'white', fontSize: 11, fontWeight: 700 }}>{data.realtor.name}</div>
                        <div style={{ color: GOLD, fontSize: 8, letterSpacing: 0.5, textTransform: 'uppercase' }}>{data.realtor.title}</div>
                        <div style={{ color: '#666', fontSize: 8 }}>{data.realtor.brokerage}</div>
                    </div>
                </div>
            </div>
        </div>
    );
}
