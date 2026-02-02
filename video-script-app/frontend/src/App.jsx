// BUILD_ID: 2026-02-02_16:05_AMBER_HISTORY
import { useState, useRef, useEffect } from 'react'
import './App.css'
import ReactMarkdown from 'react-markdown'

function App() {
  const [file, setFile] = useState(null)
  const [loading, setLoading] = useState(false)
  const [analysis, setAnalysis] = useState('')
  const [history, setHistory] = useState([])
  const fileInputRef = useRef(null)

  // Load history from localStorage on mount
  useEffect(() => {
    const savedHistory = localStorage.getItem('clipooor_history')
    if (savedHistory) {
      try {
        setHistory(JSON.parse(savedHistory))
      } catch (e) {
        console.error("Failed to parse history", e)
      }
    }
  }, [])

  // Save history whenever it changes
  useEffect(() => {
    localStorage.setItem('clipooor_history', JSON.stringify(history))
  }, [history])

  const onFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0])
    }
  }

  const triggerFileInput = () => {
    fileInputRef.current.click()
  }

  const handleUpload = async () => {
    if (!file) return

    setLoading(true)
    const formData = new FormData()
    formData.append('file', file)

    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000';
      const response = await fetch(`${apiUrl}/analyze`, {
        method: 'POST',
        body: formData,
      })

      const data = await response.json()
      if (response.ok) {
        setAnalysis(data.analysis)

        // Save to History
        const newEntry = {
          id: Date.now(),
          timestamp: new Date().toLocaleString(),
          filename: file.name,
          content: data.analysis
        }
        setHistory(prev => [newEntry, ...prev].slice(0, 20)) // Keep last 20
      } else {
        setAnalysis(`Server Error: ${data.detail || 'Unknown server error'}`)
      }
    } catch (error) {
      console.error('Upload error:', error);
      setAnalysis(`Connection Error: ${error.message}`)
    } finally {
      setLoading(false)
    }
  }

  const clearHistory = () => {
    if (window.confirm("Delete all saved reports?")) {
      setHistory([])
      setAnalysis('')
    }
  }

  return (
    <div className="app-wrapper">
      <header className="header-nav">
        <div className="logo-group">
          <h1>CLIPOOOR</h1>
        </div>
        <div className="status-bits">
          TRANSCRIPT_PROCESSOR_V4.2<br />
          MODEL: GPT-OSS-120B (OPENROUTER)<br />
          CLIP_TARGET: 60s // HISTORY: ACTIVE
        </div>
      </header>

      <main className="main-content">
        <aside className="control-sidebar">
          <div className="glass-panel">
            <div className="panel-label">SOURCE INPUT</div>
            <div className="file-drop-zone" onClick={triggerFileInput}>
              <input
                type="file"
                ref={fileInputRef}
                className="hidden-input"
                onChange={onFileChange}
                accept=".txt"
              />
              {file ? (
                <div className="filename">{file.name}</div>
              ) : (
                <p>READY_FOR_SIGNAL...<br />UPLOAD TRANSCRIPT</p>
              )}
            </div>
          </div>

          <div className="glass-panel">
            <div className="panel-label">EXECUTION</div>
            <button className="action-btn" onClick={handleUpload} disabled={loading || !file}>
              {loading ? 'DETERMINING...' : 'EXTRACT VIRAL CLIPS'}
            </button>
          </div>

          <div className="glass-panel history-panel">
            <div className="panel-label">
              <span>MISSION_LOG</span>
              <button className="clear-btn" onClick={clearHistory}>CLEAR</button>
            </div>
            <div className="history-list">
              {history.length === 0 ? (
                <div className="history-empty">NO RECENT MISSIONS</div>
              ) : (
                history.map(item => (
                  <div
                    key={item.id}
                    className={`history-item ${analysis === item.content ? 'active' : ''}`}
                    onClick={() => setAnalysis(item.content)}
                  >
                    <div className="history-filename">{item.filename}</div>
                    <div className="history-date">{item.timestamp}</div>
                  </div>
                ))
              )}
            </div>
          </div>
        </aside>

        <section className="report-panel">
          {analysis ? (
            <div className="report-card">
              <div className="panel-label">[ FINAL_ANALYTICS_REPORT ]</div>
              <div className="report-content">
                <ReactMarkdown>{analysis}</ReactMarkdown>
              </div>
            </div>
          ) : (
            <div className="empty-state">
              <p>NO SIGNAL</p>
            </div>
          )}
        </section>
      </main>

      <footer className="app-footer">
        <div>© 2026 CLIPOOOR DIGITAL RECON</div>
        <div>LAT: 37.7749° N, LONG: 122.4194° W</div>
      </footer>

      {loading && (
        <div className="processing-status">
          <span>UPLOADING_DATA_STREAM...</span>
        </div>
      )}
    </div>
  )
}

export default App
