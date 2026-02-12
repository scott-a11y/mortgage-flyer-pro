import emailjs from '@emailjs/browser';

interface LeadNotification {
    leadName: string;
    leadEmail: string;
    leadPhone: string;
    property: string;
    preApproved: string;
    message?: string;
    timestamp: string;
}

interface NotificationConfig {
    enableBrowserPush: boolean;
    enableSound: boolean;
    enableEmail: boolean;
    agentEmail?: string;
    agentPhone?: string;
    emailjsServiceId?: string;
    emailjsTemplateId?: string;
    emailjsPublicKey?: string;
}

// Default notification sound (base64 encoded short beep)
const NOTIFICATION_SOUND = 'data:audio/wav;base64,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';

class NotificationService {
    private config: NotificationConfig;
    private audio: HTMLAudioElement | null = null;
    private permissionGranted: boolean = false;

    constructor() {
        this.config = this.loadConfig();
        this.initAudio();
        this.checkBrowserPermission();
    }

    private loadConfig(): NotificationConfig {
        const saved = localStorage.getItem('notification_config');
        if (saved) {
            return JSON.parse(saved);
        }
        return {
            enableBrowserPush: true,
            enableSound: true,
            enableEmail: false,
        };
    }

    saveConfig(config: Partial<NotificationConfig>) {
        this.config = { ...this.config, ...config };
        localStorage.setItem('notification_config', JSON.stringify(this.config));
    }

    getConfig(): NotificationConfig {
        return this.config;
    }

    private initAudio() {
        if (typeof window !== 'undefined') {
            this.audio = new Audio(NOTIFICATION_SOUND);
            this.audio.volume = 0.5;
        }
    }

    private async checkBrowserPermission(): Promise<boolean> {
        if (typeof window === 'undefined' || !('Notification' in window)) {
            return false;
        }

        if (Notification.permission === 'granted') {
            this.permissionGranted = true;
            return true;
        }

        return false;
    }

    async requestPermission(): Promise<boolean> {
        if (typeof window === 'undefined' || !('Notification' in window)) {
            return false;
        }

        const permission = await Notification.requestPermission();
        this.permissionGranted = permission === 'granted';
        return this.permissionGranted;
    }

    async notifyNewLead(lead: LeadNotification): Promise<void> {
        console.log('[NotificationService] New lead received:', lead);

        // Play sound
        if (this.config.enableSound && this.audio) {
            try {
                this.audio.currentTime = 0;
                await this.audio.play();
            } catch (e) {
                console.log('Audio play failed (user interaction required)');
            }
        }

        // Browser push notification
        if (this.config.enableBrowserPush && this.permissionGranted) {
            this.showBrowserNotification(lead);
        }

        // Email notification (if EmailJS is configured)
        if (this.config.enableEmail && this.config.emailjsServiceId) {
            await this.sendEmailNotification(lead);
        }

        // Store notification for dashboard
        this.storeNotification(lead);
    }

    private showBrowserNotification(lead: LeadNotification): void {
        const preApprovalBadge = lead.preApproved === 'yes' ? '✅ Pre-Approved'
            : lead.preApproved === 'cash' ? '💰 Cash Buyer'
                : '';

        const notification = new Notification('🔥 New Lead!', {
            body: `${lead.leadName} ${preApprovalBadge}\n${lead.property}\n📞 ${lead.leadPhone}`,
            icon: '/favicon.ico',
            tag: `lead-${Date.now()}`,
            requireInteraction: true,
        });

        notification.onclick = () => {
            window.focus();
            window.location.href = '/leads';
            notification.close();
        };

        // Auto-close after 30 seconds
        setTimeout(() => notification.close(), 30000);
    }

    private async sendEmailNotification(lead: LeadNotification): Promise<void> {
        if (!this.config.emailjsServiceId || !this.config.emailjsTemplateId || !this.config.emailjsPublicKey) {
            console.log('[NotificationService] EmailJS not configured - skipping email notification');
            return;
        }

        try {
            await emailjs.send(
                this.config.emailjsServiceId,
                this.config.emailjsTemplateId,
                {
                    to_email: this.config.agentEmail,
                    lead_name: lead.leadName,
                    lead_email: lead.leadEmail,
                    lead_phone: lead.leadPhone,
                    property: lead.property,
                    pre_approved: lead.preApproved,
                    message: lead.message || 'No message',
                    timestamp: new Date(lead.timestamp).toLocaleString(),
                },
                this.config.emailjsPublicKey
            );

            console.log('[NotificationService] Email sent successfully');
        } catch (error) {
            console.error('[NotificationService] Email failed:', error);
        }
    }

    private storeNotification(lead: LeadNotification): void {
        const notifications = JSON.parse(localStorage.getItem('lead_notifications') || '[]');
        notifications.unshift({
            id: Date.now(),
            type: 'new_lead',
            lead,
            timestamp: new Date().toISOString(),
            read: false,
        });
        // Keep only last 50 notifications
        localStorage.setItem('lead_notifications', JSON.stringify(notifications.slice(0, 50)));
    }

    getUnreadCount(): number {
        const notifications = JSON.parse(localStorage.getItem('lead_notifications') || '[]');
        return notifications.filter((n: any) => !n.read).length;
    }

    markAllRead(): void {
        const notifications = JSON.parse(localStorage.getItem('lead_notifications') || '[]');
        notifications.forEach((n: any) => n.read = true);
        localStorage.setItem('lead_notifications', JSON.stringify(notifications));
    }
}

// Singleton instance
export const notificationService = new NotificationService();

// React hook for notification state
export function useNotifications() {
    const requestPermission = async () => {
        return notificationService.requestPermission();
    };

    const sendLeadNotification = async (lead: LeadNotification) => {
        return notificationService.notifyNewLead(lead);
    };

    const getConfig = () => notificationService.getConfig();
    const saveConfig = (config: Partial<NotificationConfig>) => notificationService.saveConfig(config);
    const getUnreadCount = () => notificationService.getUnreadCount();
    const markAllRead = () => notificationService.markAllRead();

    return {
        requestPermission,
        sendLeadNotification,
        getConfig,
        saveConfig,
        getUnreadCount,
        markAllRead,
    };
}
