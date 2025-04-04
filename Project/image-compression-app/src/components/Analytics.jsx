import { useMemo } from 'react'

const Analytics = ({ compressionHistory }) => {
  const averageCompressionRatio = useMemo(() => {
    if (compressionHistory.length === 0) return 0
    const totalRatio = compressionHistory.reduce((acc, item) => {
      return acc + (item.compressedSize / item.originalSize)
    }, 0)
    return ((1 - totalRatio / compressionHistory.length) * 100).toFixed(2)
  }, [compressionHistory])

  const totalSpaceSaved = useMemo(() => {
    return compressionHistory.reduce((acc, item) => {
      return acc + (item.originalSize - item.compressedSize)
    }, 0)
  }, [compressionHistory])

  return (
    <div className="analytics-container">
      <h2>Compression Analytics</h2>

      <div className="summary-section">
        <h3>Summary</h3>
        <p>Average Compression Ratio: {averageCompressionRatio}%</p>
        <p>Total Space Saved: {(totalSpaceSaved / 1024 / 1024).toFixed(2)} MB</p>
      </div>

      {compressionHistory.length > 0 ? (
        <div className="history-table">
          <table>
            <thead>
              <tr>
                <th>Time</th>
                <th>Original Size (KB)</th>
                <th>Compressed Size (KB)</th>
                <th>Compression Ratio</th>
              </tr>
            </thead>
            <tbody>
              {compressionHistory.map((item, index) => (
                <tr key={index}>
                  <td>{new Date(item.timestamp).toLocaleTimeString()}</td>
                  <td>{(item.originalSize / 1024).toFixed(2)}</td>
                  <td>{(item.compressedSize / 1024).toFixed(2)}</td>
                  <td>
                    {((1 - item.compressedSize / item.originalSize) * 100).toFixed(2)}%
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="no-data">No compression data available yet.</p>
      )}
    </div>
  )
}

export default Analytics 