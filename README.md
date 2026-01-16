# 🏡 Mortgage Flyer Pro
**Co-Branded Live Rate Flyers for Mortgage Brokers & Real Estate Agents**

[![Build Status](https://img.shields.io/badge/build-passing-brightgreen)](https://github.com)
[![Security](https://img.shields.io/badge/vulnerabilities-0-brightgreen)](https://github.com)
[![License](https://img.shields.io/badge/license-MIT-blue)](https://github.com)

---

## 🎯 What Is This?

A professional flyer builder that creates **live, shareable mortgage rate flyers** for real estate agents and mortgage brokers. Agents can share a simple link with their clients, who always see the most current rates.

### Key Features

✅ **Live Rate Updates** - Rates refresh automatically when clients view the flyer  
✅ **Co-Branded** - Features both mortgage broker and realtor information  
✅ **Mobile Optimized** - Works perfectly on any device  
✅ **QR Codes** - Automatically generated for easy sharing  
✅ **Multiple Formats** - Export for email, social media, stories, and more  
✅ **AI-Powered** - Generate compelling market insights automatically  
✅ **Professional Design** - Beautiful, modern templates  

---

## 🚀 Quick Start

### For Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Run linter
npm run lint
```

### For Deployment

See **[DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md)** for complete deployment instructions.

---

## 📚 Documentation

- **[DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md)** - Complete deployment guide for Vercel & Supabase
- **[AGENT_GUIDE.md](./AGENT_GUIDE.md)** - Quick start guide for real estate agents
- **[AUDIT_FIX_REPORT.md](./AUDIT_FIX_REPORT.md)** - Security audit results and fixes

---

## 🛠️ Tech Stack

- **Frontend:** React 18 + TypeScript + Vite 7
- **UI Framework:** shadcn/ui + Tailwind CSS
- **Backend:** Supabase (Database + Edge Functions)
- **Deployment:** Vercel
- **AI:** Lovable AI for market insights

---

## 📋 How It Works

### For Mortgage Brokers:

1. **Create a Flyer** using the visual builder
2. **Add Agent Information** (name, photo, contact details)
3. **Customize Branding** (colors, logos, messaging)
4. **Publish & Share** the unique link with your agents

### For Real Estate Agents:

1. **Receive the Link** from your mortgage broker partner
2. **Share with Clients** via text, email, or social media
3. **Clients See Live Rates** - always current, no app required
4. **Download Graphics** for social media and email campaigns

### For Clients:

1. **Click the Link** (works on any device)
2. **View Current Rates** (updated in real-time)
3. **Scan QR Code** to apply for pre-qualification
4. **Contact Agent** directly from the flyer

---

## 🎨 Features

### Flyer Builder
- Drag-and-drop interface
- Real-time preview
- Multiple templates
- Custom color themes
- Logo upload
- Headshot positioning

### Rate Management
- Manual rate entry
- API integration support
- Automatic updates
- Historical tracking
- Date stamping

### Export Options
- **Email Banner** (600×200px)
- **Social Media Post** (1080×1080px)
- **Instagram Stories** (1080×1920px)
- **Facebook Cover** (1640×624px)
- **PDF Download**
- **QR Code Generation**

### AI Features
- Market insight generation
- Headline suggestions
- Regional market analysis
- Compelling copy creation

---

## 🔐 Security

- ✅ **0 Vulnerabilities** (npm audit)
- ✅ **Row Level Security** (Supabase)
- ✅ **Environment Variables** for sensitive data
- ✅ **HTTPS Only** in production
- ✅ **CORS Protection**

---

## 📊 Project Status

| Component | Status |
|-----------|--------|
| Security Audit | ✅ Passed (0 vulnerabilities) |
| Build | ✅ Successful |
| Linting | ✅ Clean (0 errors) |
| TypeScript | ✅ Strict mode |
| Tests | ⚠️ Not implemented yet |
| Documentation | ✅ Complete |

---

## 🌐 Environment Variables

Required for deployment:

```bash
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
LOVABLE_API_KEY=your_lovable_api_key  # Optional, for AI features
```

See [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md) for details.

---

## 📱 Live Demo

**Example Flyer:** `https://your-domain.com/live/seattle-jan-2026`

Features:
- Current mortgage rates for Seattle area
- Co-branded with broker and agent info
- QR code for mobile application
- Regional market insights
- Refresh button for latest rates

---

## 🤝 Use Cases

### For Mortgage Brokers:
- Generate co-branded marketing materials
- Support your agent partners
- Showcase competitive rates
- Build brand awareness
- Track engagement

### For Real Estate Agents:
- Share with buyers and sellers
- Add value to client relationships
- Stand out from competition
- Professional marketing materials
- Easy to use and share

### For Clients:
- Always see current rates
- No app download required
- Easy to access on mobile
- Professional presentation
- Direct contact with agent

---

## 🔄 Workflow Example

```
1. Broker creates flyer for "Greater Seattle"
   ↓
2. Adds Agent Sarah's info (photo, contact, brokerage)
   ↓
3. Publishes flyer → generates link
   ↓
4. Sends link to Sarah
   ↓
5. Sarah shares with her buyer clients
   ↓
6. Clients view live rates anytime
   ↓
7. Clients scan QR code to apply
   ↓
8. Sarah gets the lead!
```

---

## 📈 Future Enhancements

- [ ] Analytics dashboard
- [ ] Email campaign integration
- [ ] Automated rate updates via API
- [ ] Multi-language support
- [ ] White-label options
- [ ] Agent self-service portal
- [ ] SMS notifications
- [ ] A/B testing for copy

---

## 🐛 Troubleshooting

### Common Issues:

**Flyer not loading?**
- Check that flyer is published (`is_published = true`)
- Verify slug in URL matches database
- Check browser console for errors

**Rates not updating?**
- Verify Supabase function is deployed
- Check function logs in Supabase dashboard
- Ensure API keys are set correctly

**Build failing?**
- Run `npm install` to update dependencies
- Check Node.js version (16+ required)
- Clear `node_modules` and reinstall

See [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md#troubleshooting) for more help.

---

## 📞 Support

- **Documentation:** See guides in this repo
- **Issues:** Open a GitHub issue
- **Deployment:** Check Vercel/Supabase docs

---

## 📄 License

MIT License - feel free to use for your business!

---

## 🙏 Acknowledgments

Built with:
- [Vite](https://vitejs.dev/)
- [React](https://react.dev/)
- [shadcn/ui](https://ui.shadcn.com/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Supabase](https://supabase.com/)
- [Vercel](https://vercel.com/)

---

## 🚀 Get Started Now!

1. **Clone this repo**
2. **Follow [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md)**
3. **Create your first flyer**
4. **Share with your agents**
5. **Watch the leads come in!**

---

**Built for mortgage professionals who want to empower their agent partners and close more deals.**

**Last Updated:** January 15, 2026  
**Version:** 1.0.0  
**Status:** ✅ Production Ready
