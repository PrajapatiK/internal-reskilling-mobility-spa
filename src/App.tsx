import { Route, Routes } from 'react-router'
import './App.css'
import HomePage from './pages/HomePage'
import ChatPage from './pages/Chat'
import MarkdownContainer from './pages/Markdown/MarkdownContainer'

function App() {

  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/chat" element={<ChatPage />} />
      <Route path="/markdown" element={<MarkdownContainer />} />
    </Routes>
  )
}

export default App
