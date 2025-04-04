import { useState } from 'react'
import ImageCompressor from './components/ImageCompressor'
import Analytics from './components/Analytics'

function App() {
  const [compressionHistory, setCompressionHistory] = useState([])

  const handleCompressionComplete = (originalSize, compressedSize) => {
    setCompressionHistory(prev => [...prev, {
      originalSize,
      compressedSize,
      timestamp: new Date()
    }])
  }

  return (
    <div className="app-container">
      <h1 className="app-title">Image Compression & Analytics App</h1>
      <ImageCompressor onCompressionComplete={handleCompressionComplete} />
      <Analytics compressionHistory={compressionHistory} />
    </div>
  )
}

export default App 