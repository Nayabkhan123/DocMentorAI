'use client'

import { SignInButton, SignOutButton, UserButton, useUser } from '@clerk/nextjs'
import Link from 'next/link'
import { Sparkles } from 'lucide-react'

const Navbar = () => {
  const { user } = useUser()

  return (
    <nav className="fixed top-0 w-full z-50 bg-zinc-900/40 backdrop-blur-lg border-b border-zinc-800 shadow-sm">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo / Brand */}
        <Link href="/" className="flex items-center  gap-2 text-white font-semibold text-lg hover:text-blue-400 transition">
          <Sparkles className=" text-blue-500" size={30}/>
          DocMentor AI
        </Link>

        {/* Navigation Links */}
        <div className="flex items-center gap-4">
          {/* Auth Buttons */}
          {!user ? (
            <SignInButton mode="modal">
              <button className="bg-blue-600 hover:bg-blue-500 text-white text-sm px-4 py-2 rounded-md transition">
                Sign In
              </button>
            </SignInButton>
          ) : (
            <div className="flex items-center gap-6">
              <UserButton/>
            <SignOutButton>
                <button className="border border-zinc-500 text-sm px-3 py-1.5 rounded-md hover:bg-zinc-800 transition">
                Sign Out
                </button>
            </SignOutButton>
            </div>
          )}
        </div>
      </div>
    </nav>
  )
}

export default Navbar
