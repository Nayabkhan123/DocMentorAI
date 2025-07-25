'use client'

import { SignedIn, SignedOut, SignInButton, SignUpButton } from '@clerk/nextjs'
import Link from 'next/link'
import {
  UploadCloud,
  MessageCircle,
  BookOpenCheck,
  Sparkles
} from 'lucide-react'
import Navbar from '../components/Navbar'

const HomePage = () => {
  return (<>
    <Navbar/>
    <div className="relative mt-12 min-h-screen bg-gradient-to-br from-zinc-900 via-black to-zinc-950 text-white px-6 py-16 flex flex-col items-center text-center overflow-hidden">
      {/* Dynamic Glow Background Blobs */}
      <div className="absolute -top-40 -left-40 w-[700px] h-[700px] bg-purple-700 opacity-30 rounded-full blur-[200px] animate-slow-float z-0" />
      <div className="absolute -bottom-32 -right-32 w-[600px] h-[600px] bg-blue-600 opacity-20 rounded-full blur-[180px] animate-slow-float-rev z-0" />
      <div className="absolute inset-0 bg-gradient-radial from-transparent via-zinc-950/50 to-black z-0 pointer-events-none" />

      {/* Hero Section */}
      <div className="relative z-10 max-w-5xl w-full">
        <h1 className="text-5xl md:text-6xl font-extrabold mb-6 leading-tight tracking-tight bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 text-transparent bg-clip-text">
          Meet Your AI Document Mentor
        </h1>
        <p className="text-zinc-400 text-lg md:text-xl mb-10 max-w-3xl mx-auto">
          Upload PDFs. Ask questions. Get cited answers — fast. All powered by vector search and Google Gemini, with zero setup.
        </p>

        {/* CTAs */}
        <div className="flex flex-wrap justify-center gap-4 mb-6">
          
          <SignedOut>
            <SignUpButton mode="modal">
              <button className="bg-blue-600 cursor-pointer px-6 py-3 rounded-lg text-white hover:bg-blue-500 transition font-medium shadow-lg hover:shadow-blue-500/30">
                Get Started Free
              </button>
            </SignUpButton>
          </SignedOut>
          
          <SignedIn>
            <Link href="/chat">
              <button className="bg-blue-600 cursor-pointer px-6 py-3 rounded-lg text-white hover:bg-blue-500 transition font-medium shadow-lg hover:shadow-blue-500/30">
                Go to Chat
              </button>
            </Link>
          </SignedIn> 
        
          <SignedOut>
            <SignInButton mode="modal">
              <button className="border border-gray-600 cursor-pointer px-6 py-3 rounded-lg text-white hover:bg-zinc-800 transition font-medium">
                Sign In
              </button>
            </SignInButton>
          </SignedOut>

          <SignedOut>
            <Link href="/chat">
              <button className="border border-green-500 cursor-pointer text-green-400 px-6 py-3 rounded-lg hover:bg-green-700 hover:text-white transition font-medium">
                Explore Without Login
              </button>
            </Link>
          </SignedOut>
          
        </div>
      </div>

      {/* Features */}
      <section className="relative z-10 mt-24 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl w-full px-4">
        {features.map((feature, i) => (
          <FeatureCard key={i} {...feature} />
        ))}
      </section>

      {/* How It Works */}
      <section className="relative z-10 mt-28 max-w-4xl">
        <h2 className="text-3xl font-bold mb-6 flex items-center justify-center gap-2 text-white">
          <Sparkles className="w-6 h-6 text-yellow-400 animate-pulse" />
          How It Works
        </h2>
        <ol className="text-left text-zinc-300 space-y-4 list-decimal list-inside text-lg backdrop-blur-sm p-4 rounded-lg bg-white/5 border border-zinc-800">
          <li>Upload a PDF document.</li>
          <li>We intelligently split and embed them using AI.</li>
          <li>Ask any question — in plain English.</li>
          <li>Receive contextual, cited answers in seconds.</li>
        </ol>
      </section>

      {/* Footer */}
      <footer className="relative z-10 mt-32 text-sm text-zinc-500 text-center pb-8">
        Built with ❤️ by DocMentor AI · Powered by Gemini, LangChain, and Qdrant
      </footer>
    </div>
    </>
  )
}

const FeatureCard = ({
  icon,
  title,
  description
}: {
  icon: React.ReactNode
  title: string
  description: string
}) => (
  <div className={`bg-zinc-900/70 backdrop-blur-md p-6 rounded-xl border border-zinc-800  transition text-left shadow-md hover:shadow-blue-500/20 hover:scale-[1.02] transform duration-300 ${title==='Upload PDFs' ? "hover:border-blue-600" : title==='Chat With Docs' ? "hover:border-purple-600" : "hover:border-green-600"}`}>
    <div className="mb-3">{icon}</div>
    <h3 className="text-xl font-semibold mb-1">{title}</h3>
    <p className="text-zinc-400 text-sm">{description}</p>
  </div>
)

const features = [
  {
    icon: <UploadCloud className="w-8 h-8 text-blue-500" />,
    title: 'Upload PDFs',
    description: 'Securely upload PDF files. We intelligently chunk and embed them with AI.',
  },
  {
    icon: <MessageCircle className="w-8 h-8 text-purple-400" />,
    title: 'Chat With Docs',
    description: 'Ask complex questions and get precise, cited answers from your content.',
  },
  {
    icon: <BookOpenCheck className="w-8 h-8 text-green-400" />,
    title: 'Cited Sources',
    description: 'Every answer shows which document and page it came from — for trust & clarity.',
  },
]

export default HomePage
