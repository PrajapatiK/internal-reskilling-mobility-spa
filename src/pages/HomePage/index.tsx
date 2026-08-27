import { useState } from 'react'
import { useNavigate } from 'react-router'

const API_BASE =
  'https://df21-2401-4900-8821-5ebb-b4a7-3355-d29d-625.ngrok-free.app/api'
const HomePage = () => {
  const [username, setUsername] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

const handleNext = async () => {
  if (!username.trim()) return

  const user = username.trim()
  setLoading(true)

  try {
    const res = await fetch(
      `${API_BASE}/threads?user_id=${encodeURIComponent(user)}`,
      {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'ngrok-skip-browser-warning': '1',
        },
      }
    )

    if (!res.ok) {
      throw new Error(`HTTP error: ${res.status}`)
    }

    const threads = await res.json()

    navigate('/chat', {
      state: {
        username: user,
        threads,
      },
    })
  } catch (error) {
    console.error('Failed to fetch threads:', error)

    navigate('/chat', {
      state: {
        username: user,
        threads: [],
      },
    })
  } finally {
    setLoading(false)
  }
}

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-sm">
        <h1 className="text-2xl font-bold mb-6 text-gray-800">Welcome</h1>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Username
        </label>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleNext()}
          placeholder="Enter your username"
          className="w-full border border-gray-300 rounded-md px-3 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={handleNext}
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition cursor-pointer disabled:opacity-50"
        >
          {loading ? 'Loading…' : 'Next'}
        </button>
      </div>
    </div>
  )
}

export default HomePage;