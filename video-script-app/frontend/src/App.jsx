// BUILD_ID: 2026-02-02_15:45_AMBER_FINAL
import { useState, useRef } from 'react'
import './App.css'
import ReactMarkdown from 'react-markdown'

function App() {
  const [file, setFile] = useState(null)
  const [loading, setLoading] = useState(false)
  const [analysis, setAnalysis] = useState('')
  const fileInputRef = useRef(null)

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
      } else {
        setAnalysis(`Server Error: ${data.detail || 'Unknown server error'}`)
      }
    } catch (error) {
      console.error('Upload error:', error);
      let errorMessage = `Connection Error: ${error.message}`;
      if (error.message.includes('Failed to fetch')) {
        errorMessage += " (Check Vercel Environment Variable VITE_API_URL)";
      }
      setAnalysis(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="app-wrapper">
      <header className="header-nav">
        <div className="logo-group">
          <h1>CLIPOOOR</h1>
        </div>
        <div className="status-bits">
          TRANSCRIPT_PROCESSOR_V4.0<br />
          MODEL: GEMINI-2.0-FLASH<br />
          CLIP_TARGET: 60s // STATUS: READY
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
                <p>READY_FOR_SIGNAL...<br />CLICK TO UPLOAD TRANSCRIPT</p>
              )}
            </div>
          </div>

          <div className="glass-panel">
            <div className="panel-label">EXECUTION_MODULE</div>
            <button
              className="action-btn"
              onClick={handleUpload}
              disabled={loading || !file}
            >
              {loading ? 'ANALYZING...' : 'EXTRACT VIRAL CLIPS'}
            </button>
            <p style={{ marginTop: '15px', fontFamily: 'Space Mono', fontSize: '0.6rem', color: '#444', textAlign: 'center' }}>
              REDUNDANCY CHECK: ACTIVE // BUFFER: CLEAR
            </p>
          </div>

          <div className="glass-panel">
            <div className="panel-label">SYSTEM_CORE</div>
            <ul className="metadata-list" style={{ listStyle: 'none', fontFamily: 'Space Mono', fontSize: '0.7rem', color: '#555', padding: 0 }}>
              <li style={{ marginBottom: '10px' }}>&gt; SCANNING FOR "GOLDEN NUGGETS"</li>
              <li style={{ marginBottom: '10px' }}>&gt; DETECTING CURIOSITY GAPS</li>
              <li style={{ marginBottom: '10px' }}>&gt; SCORING VIRAL POTENTIAL</li>
              <li style={{ marginBottom: '10px' }}>&gt; CALIBRATING STORYTELLER AI</li>
              <li style={{ marginBottom: '10px' }}>&gt; VERIFYING TIMESTAMPS...</li>
            </ul>
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
