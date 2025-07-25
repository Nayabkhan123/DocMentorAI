'use client'
import { SquarePen } from 'lucide-react'
import * as React from 'react'

interface Doc {
  pageContent?: string
  metadata?: {
    loc?: {
      pageNumber?: number
    }
    source?: string
  }
}

interface IMessage {
  role: 'assistant' | 'user'
  content?: string
  document?: Doc[]
}

const ChatComponent: React.FC = () => {
  const [message, setMessage] = React.useState<string>('')
  const [messages, setMessages] = React.useState<IMessage[]>([])
  const [loading, setLoading] = React.useState(false)

  const handleSendButton = async () => {
    setMessage('')
    if (!message.trim()) return

    // Add user's message to chat
    setMessages((prev) => [...prev, { role: 'user', content: message }])
    setLoading(true)

    try {
      const res = await fetch(`http://localhost:8000/chat?message=${encodeURIComponent(message)}`)
      const data = await res.json()

      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: data?.message || 'No response',
          document: data?.docs || []
        }
      ])
    } catch (err) {
      console.error('Error:', err)
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: '❌ Failed to fetch response' }
      ])
    }
    setLoading(false)
  }

    const bottomRef = React.useRef<HTMLDivElement | null>(null);
    const scrollToBottom = () => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

  React.useEffect(() => {
    scrollToBottom();
  }, [messages]);
  return (
    <div className="min-h-screen p-10 pb-24 bg-zinc-900 text-white">
      <div className="space-y-4 mb-16">
        <div >
          {
            messages?.length==0 && <div className='w-full flex justify-center items-start mt-[10vh] text-2xl font-semibold gap-4'><p>Start asking questions</p><span><SquarePen /></span></div>
          }
        </div>
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`p-3 rounded-lg w-fit whitespace-pre-wrap ${
              msg.role === 'user' ? 'bg-slate-800 border-2 border-slate-700 self-end ml-auto max-w-xl' : '  max-w-full'
            }`}
          >
            <p>{msg?.content}</p>
            {msg?.document && msg.document.length > 0 && (
              <details className="mt-2 text-sm text-gray-300">
                <summary>🔎 Sources ({msg?.document?.length})</summary>
                <ul className="list-disc ml-4">
                  {msg?.document?.map((doc, i) => (
                    <li key={i} className='text-wrap'>
                      <span className='font-semibold text-green-100'>Page</span> {doc.metadata?.loc?.pageNumber} from{' '}
                      <div>{doc.metadata?.source?.split('\\').pop()}</div>
                      <br/>
                      <div><span className='font-semibold text-green-100'>Content Matches from PDF:</span> {doc.pageContent}</div>
                    </li>
                  ))}
                </ul>
              </details>
            )}
          </div>
        ))}
      </div>

      <div className="fixed bottom-0 right-0 w-full md:w-[70vw] rounded-t-2xl p-4 bg-zinc-800 border-t border-zinc-700 flex gap-2">
        <input
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              handleSendButton();
            }
          }}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type your query..."
          className="flex-1 px-5 py-2 rounded-md bg-zinc-700 text-white outline-none"
        />
        <button
          onClick={handleSendButton}
          disabled={loading}
          className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-md text-white"
        >
          {loading ? 'Thinking...' : 'Send'}
        </button>
      </div>
    </div>
  )
}

export default ChatComponent
