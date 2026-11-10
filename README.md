# 🦁 Kangiten Agency

**AI WhatsApp Chatbots for Local Businesses** — Built with Vercel, AI SDK, and modern tooling.

## 🎯 What This Monorepo Contains

```
kangiten-agency/
├── apps/
│   ├── marketing-site/        # Next.js marketing site (kangiten.com)
│   ├── demo-chatbot/          # Live demo chatbot (demo.kangiten.com)
│   ├── client-dashboard/      # Client analytics dashboard (app.kangiten.com)
│   └── outreach-automation/   # Email outreach & lead gen scripts
├── packages/
│   ├── ai-agents/             # Automated workflows (lead research, proposals, onboarding, QA)
│   ├── video-pipeline/        # Remotion videos for marketing
│   ├── ui/                    # Shared React components
│   └── shared-config/         # Tailwind, TypeScript configs
└── tools/
    ├── deploy-client.ts       # One-command client deployment
    ├── generate-proposal.ts   # Custom proposal generator
    ├── outreach-runner.ts     # Automated email sequences
    └── video-renderer.ts      # Marketing video renderer
```

## 🚀 Quick Start

### Prerequisites
- Node.js 20+
- pnpm (recommended) or npm
- Vercel account
- OpenAI/Anthropic API keys
- Resend account (for outreach)

### Installation

```bash
# Clone and install
git clone <your-repo> kangiten-agency
cd kangiten-agency
pnpm install

# Copy environment template
cp .env.example .env.local
# Edit .env.local with your keys

# Start all dev servers
pnpm dev
```

This starts:
- Marketing site: http://localhost:3000
- Demo chatbot: http://localhost:3001
- Client dashboard: http://localhost:3002

## 🛠 Key Commands

### Deploy a New Client (30 seconds)
```bash
pnpm deploy:client \
  --client glow-salon \
  --name "Glow Salon" \
  --type salon \
  --phone "+919876543210" \
  --plan growth \
  --calendar "https://calendly.com/glow-salon"
```

### Generate a Proposal
```bash
pnpm generate:proposal \
  --name "Glow Salon" \
  --type salon \
  --contact "Priya" \
  --plan growth
```

### Run Outreach Campaign
```bash
# Prepare leads.csv first (see apps/outreach-automation/leads.csv)
pnpm outreach:run --csv apps/outreach-automation/leads.csv
```

### Render Marketing Videos
```bash
# Horizontal demo video (1920x1080)
pnpm video:render --composition kangiten-demo

# Vertical short for Reels/TikTok (1080x1920)
pnpm video:render --composition kangiten-short
```

## 🏗 Architecture

### Marketing Site (`apps/marketing-site`)
- Next.js 14 + App Router
- Contentlayer for blog/case studies
- Auto-generated OG images via `@vercel/og`
- Tailwind CSS with Kangiten brand theme
- Deployed to Vercel with edge functions

### Demo Chatbot (`apps/demo-chatbot`)
- Vercel AI SDK streaming responses
- GPT-4o / Claude 3.5 Sonnet (configurable)
- Vercel KV for conversation history
- WhatsApp Business API webhook endpoint
- Tool calling: booking, lead capture, handoff

### Client Dashboard (`apps/client-dashboard`)
- Recharts for analytics visualization
- Real-time conversation monitoring
- Lead management pipeline
- FAQ/training data editor
- Multi-tenant (one dashboard per client)

### AI Agents (`packages/ai-agents`)
- **Lead Researcher**: Finds prospects via web scraping
- **Proposal Generator**: Creates customized proposals
- **Onboarding Agent**: Deploys full stack to Vercel
- **QA Agent**: Tests webhook + chatbot end-to-end

### Video Pipeline (`packages/video-pipeline`)
- Remotion for programmatic video creation
- Horizontal (YouTube/website) + vertical (Reels/TikTok) compositions
- Brand-consistent animations
- Renders to MP4 via headless Chrome

## 📦 Deploy to Production

### 1. Vercel Setup
```bash
# Install Vercel CLI
pnpm i -g vercel

# Login and link projects
vercel login
vercel link  # Run in each app directory
```

### 2. Configure Environment Variables
Add all keys from `.env.example` to Vercel dashboard for each project.

### 3. Deploy
```bash
# Deploy all apps
vercel --prod  # Run in each app directory

# Or use GitHub Actions (see .github/workflows/)
```

### 4. WhatsApp Business API
1. Create Meta Business Manager account
2. Set up WhatsApp Business API
3. Configure webhook: `https://your-demo.vercel.app/api/webhook`
4. Add verify token to environment variables

## 💰 Business Model

| Plan | Price/Month | Best For |
|------|-------------|----------|
| **Starter** | ₹15,000 | Solo professionals |
| **Growth** | ₹35,000 | Growing local businesses |
| **Scale** | ₹75,000 | Multi-location & agencies |

**Included in all plans:**
- First month FREE
- 30-minute deployment
- Custom FAQ training
- Analytics dashboard
- Email support
- Cancel anytime

## 🎯 Getting Your First Client

1. **Build the demo** — `pnpm dev` and test at `localhost:3001/demo`
2. **Find prospects** — Use `packages/ai-agents` lead researcher or manual search
3. **Generate proposal** — `pnpm generate:proposal --name "Business" --type salon`
4. **Run outreach** — `pnpm outreach:run --csv leads.csv`
5. **Deploy client** — `pnpm deploy:client --client biz-name --type salon --phone +91...`
6. **Onboard** — Share dashboard, configure WhatsApp, schedule check-in

## 📚 Key Integrations

| Service | Purpose | Free Tier |
|---------|---------|-----------|
| Vercel | Hosting, KV, Postgres, Blob | Generous |
| OpenAI/Claude | LLM inference | Pay-per-use |
| Resend | Transactional email | 3k/month |
| Novu | Multi-channel notifications | Self-hosted |
| Calendly | Booking integration | Free tier |
| Meta WhatsApp | Business API | Free tier (1k conversations) |

## 🧪 Testing

```bash
# Run QA on deployed client
pnpm tsx tools/deploy-client.ts --client test-biz --type salon --phone +919876543210 --skip-qa false

# Manual webhook test
curl -X POST https://your-demo.vercel.app/api/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "Hi, what are your timings?"}'
```

## 📈 Scaling Checklist

- [ ] Add multi-tenant auth (NextAuth)
- [ ] Implement usage-based billing (Stripe)
- [ ] Add white-label dashboard option
- [ ] Build self-serve onboarding flow
- [ ] Create partner/affiliate program
- [ ] Add more integrations (HubSpot, Zoho, etc.)

## 🤝 Contributing

1. Fork the repo
2. Create feature branch
3. Make changes with tests
4. Submit PR

## 📄 License

MIT — Use freely for your agency.

---

**Built with ❤️ by Kangiten Agency**  
[kangiten.com](https://kangiten.com) | [Twitter](https://twitter.com/kangiten) | [LinkedIn](https://linkedin.com/company/kangiten)