import { useState, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import imageCompression from 'browser-image-compression'

const ImageCompressor = ({ onCompressionComplete }) => {
  const [quality, setQuality] = useState(0.7)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [preview, setPreview] = useState('')
  const [selectedFile, setSelectedFile] = useState(null)

  const compressImage = async () => {
    if (!selectedFile) return

    setLoading(true)
    setError('')

    try {
      // Compression options
      const options = {
        maxSizeMB: 1,
        maxWidthOrHeight: 1920,
        useWebWorker: true,
        quality: quality,
      }

      // Compress the image
      const compressedFile = await imageCompression(selectedFile, options)
      
      // Create download link
      const link = document.createElement('a')
      link.href = URL.createObjectURL(compressedFile)
      link.download = `compressed_${selectedFile.name}`
      link.click()

      // Report compression results
      onCompressionComplete(selectedFile.size, compressedFile.size)
    } catch (err) {
      setError('Error compressing image. Please try again.')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const onDrop = useCallback((acceptedFiles) => {
    if (acceptedFiles.length === 0) return

    const file = acceptedFiles[0]
    setSelectedFile(file)
    setError('')

    // Create preview
    const previewUrl = URL.createObjectURL(file)
    setPreview(previewUrl)
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif']
    },
    multiple: false
  })

  return (
    <div className="compressor-container">
      <div
        {...getRootProps()}
        className={`dropzone ${isDragActive ? 'active' : ''}`}
      >
        <input {...getInputProps()} />
        <div className="upload-icon">📤</div>
        <h3>
          {isDragActive
            ? 'Drop the image here'
            : 'Drag and drop an image here, or click to select'}
        </h3>
        <p>Supported formats: JPEG, PNG, GIF</p>
      </div>

      {preview && (
        <div className="preview-container">
          <img
            src={preview}
            alt="Preview"
            className="preview-image"
          />
        </div>
      )}

      <div className="quality-control">
        <div className="quality-label">
          <span>Compression Quality</span>
          <span className="quality-value">{Math.round(quality * 100)}%</span>
        </div>
        <input
          type="range"
          min="0.1"
          max="1"
          step="0.05"
          value={quality}
          onChange={(e) => setQuality(parseFloat(e.target.value))}
          className="quality-slider"
          aria-label="Compression quality"
        />
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8em', color: '#666' }}>
          <span>Higher quality</span>
          <span>Smaller file size</span>
        </div>
      </div>

      {selectedFile && (
        <button 
          onClick={compressImage}
          disabled={loading}
          className="compress-button"
          style={{
            backgroundColor: '#2196f3',
            color: 'white',
            marginTop: '20px',
            width: '100%'
          }}
        >
          {loading ? 'Compressing...' : 'Compress Image'}
        </button>
      )}

      {loading && (
        <div className="loading">
          Loading...
        </div>
      )}

      {error && (
        <div className="error">
          {error}
        </div>
      )}
    </div>
  )
}

export default ImageCompressor 