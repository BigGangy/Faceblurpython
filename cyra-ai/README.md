# Cyra AI - AI-Powered CV Builder

Cyra AI is a multilingual, region-aware CV and cover letter builder that uses AI to help job seekers create professional, recruiter-optimized resumes.

## Features

- 🌐 Multilingual support (Arabic, English, French)
- 🎯 Region-specific CV templates (KSA, UAE, Tunisia, Morocco, France, Canada)
- 🤖 AI-powered content generation
- 📝 Cover letter generator
- 🔍 Keyword optimization tool
- 💬 AI chat assistant
- 📱 Mobile-first, responsive design
- 🔒 GDPR & PDPL compliance

## Tech Stack

- **Frontend**: Next.js, React, TailwindCSS
- **Backend**: Node.js, Next.js API routes
- **Database**: PostgreSQL with Prisma
- **Authentication**: Firebase Auth
- **Storage**: Firebase Storage
- **AI**: OpenAI GPT-4
- **i18n**: next-i18next
- **PDF Generation**: @react-pdf/renderer

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- PostgreSQL
- Firebase account
- OpenAI API key

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/cyra-ai.git
cd cyra-ai
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Set up environment variables:
```bash
cp .env.example .env.local
```
Edit `.env.local` with your configuration:
```
DATABASE_URL="postgresql://user:password@localhost:5432/cyra_ai"
OPENAI_API_KEY="your-openai-api-key"
FIREBASE_API_KEY="your-firebase-api-key"
FIREBASE_AUTH_DOMAIN="your-firebase-auth-domain"
FIREBASE_PROJECT_ID="your-firebase-project-id"
FIREBASE_STORAGE_BUCKET="your-firebase-storage-bucket"
```

4. Initialize the database:
```bash
npx prisma migrate dev
```

5. Run the development server:
```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Project Structure

```
cyra-ai/
├── src/
│   ├── app/              # Next.js app directory
│   ├── components/       # React components
│   ├── i18n/            # Internationalization
│   ├── lib/             # Utility functions
│   ├── styles/          # Global styles
│   └── types/           # TypeScript types
├── public/
│   └── locales/         # Translation files
├── prisma/              # Database schema
└── tests/               # Test files
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- OpenAI for GPT-4
- Next.js team for the amazing framework
- TailwindCSS for the utility-first CSS framework
- The open-source community for their contributions

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
