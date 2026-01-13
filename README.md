# multidevTools - Developer Tools Suite

A comprehensive collection of 80+ developer tools built with Next.js 16, featuring formatters, validators, encoders, converters, and more. All tools work entirely in your browser for maximum privacy and speed.

## 🚀 Features

- **80+ Developer Tools** - JSON formatter, Base64 encoder, color converter, and many more
- **Privacy First** - All processing happens locally in your browser
- **Lightning Fast** - Real-time results as you type
- **Beautiful UI** - Modern design with dark/light theme support
- **Mobile Friendly** - Responsive design that works on all devices
- **No Registration** - Use all tools immediately without signing up

## 🛠️ Tech Stack

- **Framework**: Next.js 16 with App Router
- **Styling**: Tailwind CSS v4
- **UI Components**: Radix UI + Custom Components
- **Icons**: Tabler Icons + Lucide React
- **TypeScript**: Full type safety
- **Deployment**: Vercel

## 🏃‍♂️ Quick Start

1. **Clone the repository**
   ```bash
   git clone https://github.com/KrAkashdeep/devloper-tools-hub.git
   cd devtools-hub
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```
   Edit `.env.local` with your configuration.

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📦 Deployment on Vercel

### Automatic Deployment (Recommended)

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

2. **Deploy to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your GitHub repository
   - Vercel will automatically detect Next.js and deploy

3. **Set Environment Variables** (Optional)
   In your Vercel dashboard:
   - Go to Project Settings → Environment Variables
   - Add `NEXT_PUBLIC_SITE_URL` with your domain
   - Add email configuration if you want the feedback form to work

### Manual Deployment

```bash
# Build the project
npm run build

# Deploy to Vercel CLI
npx vercel --prod
```

## 🔧 Configuration

### Environment Variables

Create a `.env.local` file with:

```env
# Site Configuration
NEXT_PUBLIC_SITE_URL=https://your-domain.vercel.app
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-tool`)
3. Commit your changes (`git commit -m 'Add amazing tool'`)
4. Push to the branch (`git push origin feature/amazing-tool`)
5. Open a Pull Request


**Ready to deploy?** Just push to GitHub and connect with Vercel! 🚀
