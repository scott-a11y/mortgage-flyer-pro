import { forwardRef } from "react";
import { FlyerData } from "@/types/flyer";
import { QRCodeSVG } from "qrcode.react";
import { ShieldCheck, TrendingDown, Landmark, Building2, Flag } from "lucide-react";

interface SocialShareCardProps {
    data: FlyerData;
    shareUrl: string;
}

// Helper for soft headshots
function HeadshotImage({
    src,
    alt,
    size,
    positionY = 15,
    positionX = 50
}: {
    src: string;
    alt: string;
    size: number;
    positionY?: number;
    positionX?: number;
}) {
    return (
        <img
            src={src}
            alt={alt}
            crossOrigin="anonymous"
            style={{
                width: size,
                height: size,
                objectFit: 'cover',
                objectPosition: `${positionX}% ${positionY}%`,
                flexShrink: 0,
                borderRadius: size / 2, // Circular
                transform: 'translateZ(0)',
                backfaceVisibility: 'hidden',
            }}
        />
    );
}

const GOLD = "#D4AF37";
const ONYX = "#050505";

export const SocialShareCard = forwardRef<HTMLDivElement, SocialShareCardProps>(({ data, shareUrl }, ref) => {
    // Logic for Rate Display
    const rJumbo = data.rates.thirtyYearJumbo.replace('%', '');
    const rFixed30 = data.rates.thirtyYearFixed.replace('%', '');
    const rFixed15 = data.rates.fifteenYearFixed.replace('%', '');
    const rFHA = data.rates.fha ? data.rates.fha.replace('%', '') : '5.50';
    const rVA = data.rates.va ? data.rates.va.replace('%', '') : '5.50';

    const isConventional = data.rateType === 'conventional';
    const isGovernment = data.rateType === 'government';

    // Card 1
    const label1 = isGovernment ? 'FHA 30-Year' : (isConventional ? '30-Yr Fixed' : 'Jumbo Portfolio');
    const value1 = isGovernment ? rFHA : (isConventional ? rFixed30 : rJumbo);

    // Card 3
    const label3 = isGovernment ? 'VA 30-Year' : (isConventional ? '15-Yr Fixed' : '15-Yr Acq.');
    const value3 = isGovernment ? rVA : (isConventional ? rFixed15 : rFixed15);

    const headline = isGovernment ? 'Security & Stability' : 'Liquidity & Acquisition';
    const subhead = isGovernment ? 'Government Loan Update' : 'Private Client Market Update';

    // Fallback positions for Scott
    const getX = (name: string, x?: number) => x ?? (name.includes('Scott Little') ? 35 : 50);
    const getY = (name: string, y?: number) => name.includes('Scott Little') ? 15 : (y ?? 15);

    return (
        <div style={{ width: 1080, height: 1080, background: ONYX, display: 'flex', flexDirection: 'column', position: 'relative' }} ref={ref}>
            <div style={{ position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)', width: 600, height: 300, background: 'rgba(212, 175, 55, 0.1)', filter: 'blur(120px)', borderRadius: '50%' }} />

            {/* Header */}
            <div style={{ padding: '80px 40px', textAlign: 'center', zIndex: 10 }}>
                <div style={{ display: 'inline-block', padding: '8px 24px', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 50, marginBottom: 30, background: 'rgba(255,255,255,0.03)' }}>
                    <span style={{ color: GOLD, fontSize: 14, letterSpacing: 3, textTransform: 'uppercase', fontWeight: 600 }}>{subhead}</span>
                </div>
                <div style={{ fontFamily: 'Playfair Display, serif', color: 'white', fontSize: 80, lineHeight: 1 }}>
                    {isGovernment ? (
                        <span>Security & <span style={{ color: '#60a5fa' }}>Stability.</span></span>
                    ) : (
                        <span>Liquidity & <span style={{ background: `linear-gradient(to right, #FFE5A0, ${GOLD})`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Acquisition.</span></span>
                    )}
                </div>
            </div>

            {/* Grid */}
            <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 40, padding: '0 60px' }}>
                {/* Left Card */}
                <div style={{ background: '#0a0a0c', border: '1px solid rgba(255,255,255,0.05)', padding: 40, textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                    {isGovernment ? <Building2 size={40} className="text-blue-400" style={{ marginBottom: 20, opacity: 0.8 }} /> : <ShieldCheck size={40} color={GOLD} style={{ marginBottom: 20, opacity: 0.8 }} />}
                    <div style={{ color: '#555', fontSize: 14, textTransform: 'uppercase', letterSpacing: 2, marginBottom: 8 }}>{label1}</div>
                    <div style={{ fontFamily: 'Playfair Display, serif', color: 'white', fontSize: 72 }}>{value1}<span style={{ fontSize: 24, fontStyle: 'italic', color: isGovernment ? '#60a5fa' : GOLD }}>%</span></div>
                    <div style={{ color: '#444', fontSize: 14, marginTop: 12 }}>
                        {isGovernment ? "Low down payment options." : "Flexible underwriting for HNW liquidity."}
                    </div>
                </div>

                {/* Center - Bridge */}
                <div style={{ background: `linear-gradient(to bottom, rgba(212, 175, 55, 0.1), transparent)`, border: `1px solid ${GOLD}40`, padding: 40, textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
                    <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 1, background: `linear-gradient(90deg, transparent, ${GOLD}, transparent)` }} />
                    <Landmark size={40} color={GOLD} style={{ marginBottom: 20 }} />
                    <div style={{ color: GOLD, fontSize: 14, textTransform: 'uppercase', letterSpacing: 2, marginBottom: 8, fontWeight: 700 }}>Bridge Strategy</div>
                    <div style={{ fontFamily: 'Playfair Display, serif', color: 'white', fontSize: 36, fontStyle: 'italic' }}>Non-Contingent</div>
                    <div style={{ color: GOLD, fontSize: 14, marginTop: 12, opacity: 0.8 }}>Secure the asset first.</div>
                </div>

                {/* Right Card */}
                <div style={{ background: '#0a0a0c', border: '1px solid rgba(255,255,255,0.05)', padding: 40, textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                    {isGovernment ? <Flag size={40} className="text-red-400" style={{ marginBottom: 20, opacity: 0.8 }} /> : <TrendingDown size={40} color={GOLD} style={{ marginBottom: 20, opacity: 0.8 }} />}
                    <div style={{ color: '#555', fontSize: 14, textTransform: 'uppercase', letterSpacing: 2, marginBottom: 8 }}>{label3}</div>
                    <div style={{ fontFamily: 'Playfair Display, serif', color: 'white', fontSize: 72 }}>{value3}<span style={{ fontSize: 24, fontStyle: 'italic', color: isGovernment ? '#ef4444' : GOLD }}>%</span></div>
                    <div style={{ color: '#444', fontSize: 14, marginTop: 12 }}>
                        {isGovernment ? "Zero down for veterans." : "Accelerated equity strategy."}
                    </div>
                </div>
            </div>

            {/* Footer */}
            <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', padding: '40px 60px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#0a0a0c' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
                    {data.broker.headshot && <HeadshotImage src={data.broker.headshot} alt="" size={80} positionY={getY(data.broker.name, data.broker.headshotPosition)} positionX={getX(data.broker.name, data.broker.headshotPositionX)} />}
                    <div>
                        <div style={{ fontFamily: 'Playfair Display, serif', color: 'white', fontSize: 24 }}>{data.broker.name}</div>
                        <div style={{ color: GOLD, fontSize: 14, letterSpacing: 1, textTransform: 'uppercase' }}>{data.broker.title}</div>
                        <div style={{ color: '#666', fontSize: 14 }}>NMLS #{data.broker.nmls}</div>
                    </div>
                </div>
                <div style={{ textAlign: 'center' }}>
                    <QRCodeSVG value={shareUrl} size={60} fgColor="white" bgColor="transparent" />
                    <div style={{ color: '#444', fontSize: 10, letterSpacing: 1, textTransform: 'uppercase', marginTop: 8 }}>Scan Me</div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 20, flexDirection: 'row-reverse', textAlign: 'right' }}>
                    {data.realtor.headshot && <HeadshotImage src={data.realtor.headshot} alt="" size={80} positionY={getY(data.realtor.name, data.realtor.headshotPosition)} positionX={getX(data.realtor.name, data.realtor.headshotPositionX)} />}
                    <div>
                        <div style={{ fontFamily: 'Playfair Display, serif', color: 'white', fontSize: 24 }}>{data.realtor.name}</div>
                        <div style={{ color: GOLD, fontSize: 14, letterSpacing: 1, textTransform: 'uppercase' }}>{data.realtor.title}</div>
                        <div style={{ color: '#666', fontSize: 14 }}>{data.realtor.email}</div>
                    </div>
                </div>
            </div>
        </div>
    );
});
