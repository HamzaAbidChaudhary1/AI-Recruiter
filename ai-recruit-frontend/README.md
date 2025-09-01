# AI Recruit Frontend Platform

A sophisticated, modern frontend platform for AI-powered recruitment with advanced proctoring, real-time analytics, and secure assessment capabilities.

## 🏗️ Repository Structure

```
ai-recruit-frontend/
├── apps/
│   ├── recruiter-dashboard/    # Recruiter analytics & management portal
│   └── candidate-portal/        # Secure candidate assessment interface
├── packages/
│   ├── ui/                     # Shared UI components & animations
│   ├── composables/             # Vue composables (exam mode, proctoring, etc.)
│   ├── types/                   # TypeScript type definitions
│   └── utils/                   # Shared utility functions
├── services/
│   └── mock-api/               # Mock API server for development
├── turbo.json                  # Turborepo configuration
├── pnpm-workspace.yaml          # PNPM workspace configuration
└── package.json                # Root package configuration
```

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ 
- PNPM 8+ (`npm install -g pnpm`)

### Installation

```bash
# Clone the repository
git clone https://github.com/your-org/ai-recruit-frontend.git
cd ai-recruit-frontend

# Install dependencies
pnpm install

# Start all services in development mode
pnpm dev
```

### Individual Application Commands

```bash
# Start only the recruiter dashboard
pnpm recruiter:dev

# Start only the candidate portal
pnpm candidate:dev

# Start only the mock API server
pnpm mock:dev

# Start the UI component development server
pnpm ui:dev
```

## 📦 Applications

### Recruiter Dashboard (`apps/recruiter-dashboard`)
**URL:** http://localhost:3000

The main dashboard for recruiters featuring:
- Real-time candidate pipeline visualization
- Advanced analytics with ECharts & D3.js
- Live proctoring monitoring
- Assessment configuration builder
- Candidate management with filtering & search
- Export capabilities

### Candidate Portal (`apps/candidate-portal`)
**URL:** http://localhost:3001

Secure assessment portal with:
- Token-based access control
- Browser lockdown mode (exam mode)
- Webcam & screen proctoring
- Voice recording capabilities
- Auto-save functionality
- Anti-cheating detection

## 🎨 Shared Packages

### UI Components (`packages/ui`)
Reusable Vue components with GSAP animations:
- `AnimatedCard` - Cards with various animation effects
- `StatsCard` - Analytics display cards
- `ChartWrapper` - ECharts/D3 integration components
- `LoadingStates` - Lottie-based loading animations
- `VideoRecorder` - WebRTC recording component

### Composables (`packages/composables`)
Critical Vue composables for platform functionality:

#### `useExamMode`
```typescript
const { start, stop, violations, isActive } = useExamMode({
  preventRightClick: true,
  preventDevTools: true,
  enforceFullscreen: true,
  detectTabSwitch: true,
  maxTabSwitches: 3,
  onViolation: (type) => console.log('Violation:', type)
})
```

#### `useProctoring`
```typescript
const { start, stop, state, takeScreenshot } = useProctoring({
  video: true,
  audio: true,
  screen: true,
  detectMultipleFaces: true,
  recordVideo: true,
  onMultipleFaces: () => alert('Multiple faces detected!')
})
```

## 🔧 Technology Stack

### Core Framework
- **Vue 3** + **Nuxt 3** - Modern Vue framework with SSR/SSG capabilities
- **TypeScript** - Type-safe development (strict mode)
- **UnoCSS** - Atomic CSS with zero runtime overhead
- **Pinia** - Type-safe state management

### UI & Animations
- **GSAP** - Professional-grade animations
- **Lottie** - Complex vector animations
- **Floating UI** - Positioning engine for tooltips/dropdowns
- **VueUse** - 200+ essential Vue composables

### Data Visualization
- **Apache ECharts** - 60+ chart types
- **D3.js** - Custom data visualizations
- **Three.js** - 3D visualizations

### Real-time & Performance
- **Socket.io** - WebSocket communication
- **Web Workers** - Background processing
- **IndexedDB** - Offline storage
- **PWA** - Installable progressive web app

## 🔒 Security Features

### Exam Mode
- Browser developer tools blocking
- Right-click prevention
- Copy/paste disabling
- Print screen blocking
- Keyboard shortcut interception
- Fullscreen enforcement
- Tab switching detection

### Proctoring
- Live webcam monitoring
- Screen recording
- Multiple face detection
- Audio recording
- Device disconnection alerts
- Suspicious activity logging

## 🧪 Mock API Server

The mock API (`services/mock-api`) provides:
- REST endpoints for all platform features
- WebSocket server for real-time updates
- Faker.js-generated test data
- Proctoring event simulation

**Endpoints:**
- `POST /api/auth/login` - Authentication
- `GET /api/candidates` - Candidate listing
- `GET /api/assessments` - Assessment management
- `GET /api/analytics/*` - Analytics data
- WebSocket events for real-time updates

## 📊 Performance Targets

- First Contentful Paint: < 1.5s
- Largest Contentful Paint: < 2.5s
- Cumulative Layout Shift: < 0.1
- First Input Delay: < 100ms
- Lighthouse Score: > 95

## 🛠️ Development Workflow

### Build All Applications
```bash
pnpm build
```

### Run Tests
```bash
pnpm test
```

### Lint & Type Check
```bash
pnpm lint
pnpm type-check
```

### Clean Build Artifacts
```bash
pnpm clean
```

## 📝 Environment Variables

Create `.env` files in each app directory:

```env
# apps/recruiter-dashboard/.env
NUXT_PUBLIC_API_BASE=http://localhost:4000
NUXT_PUBLIC_WS_URL=ws://localhost:4001
NUXT_PUBLIC_WEBRTC_URL=http://localhost:4002

# apps/candidate-portal/.env
NUXT_PUBLIC_API_BASE=http://localhost:4000
NUXT_PUBLIC_WS_URL=ws://localhost:4001
NUXT_PUBLIC_WEBRTC_URL=http://localhost:4002
NUXT_PUBLIC_MAX_RECORDING_DURATION=300
NUXT_PUBLIC_IDLE_TIMEOUT=300
NUXT_PUBLIC_TAB_SWITCH_LIMIT=3
```

## 🚢 Deployment

### Production Build
```bash
# Build all applications
pnpm build

# Preview production builds
pnpm preview
```

### Docker Support
```bash
# Build Docker images
docker-compose build

# Run containers
docker-compose up
```

## 📚 Additional Resources

- [Nuxt 3 Documentation](https://nuxt.com)
- [Vue 3 Documentation](https://vuejs.org)
- [UnoCSS Documentation](https://unocss.dev)
- [GSAP Documentation](https://greensock.com/docs)
- [ECharts Documentation](https://echarts.apache.org)

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.
