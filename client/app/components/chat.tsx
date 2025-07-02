'use client'
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
    <div className="min-h-screen p-10 pb-24 bg-zinc-900 text-white overflow-y-auto">
      <div className="space-y-4 mb-16">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`p-3 rounded-lg w-fit whitespace-pre-wrap ${
              msg.role === 'user' ? 'border border-slate-700 self-end ml-auto max-w-xl' : 'bg-zinc-800 max-w-3xl'
            }`}
          >
            <p>{msg?.content}</p>
            {msg?.document?.length > 0 && (
              <details className="mt-2 text-sm text-gray-300">
                <summary>🔎 Sources ({msg?.document?.length})</summary>
                <ul className="list-disc ml-4">
                  {msg?.document?.map((doc, i) => (
                    <li key={i}>
                      <span className='font-semibold text-green-100'>Page</span> {doc.metadata?.loc?.pageNumber} from{' '}
                      <code>{doc.metadata?.source?.split('\\').pop()}</code>
                      <br/>
                      <code><span className='font-semibold text-green-100'>Content Matches from PDF:</span> {doc.pageContent}</code>
                    </li>
                  ))}
                </ul>
              </details>
            )}
          </div>
        ))}
      </div>

      <div className="fixed bottom-0 right-0 w-[70vw] rounded-t-2xl p-4 bg-zinc-800 border-t border-zinc-700 flex gap-2">
        <input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type your query..."
          className="flex-1 px-4 py-2 rounded-md bg-zinc-700 text-white outline-none"
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
