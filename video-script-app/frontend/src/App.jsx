// Build Trigger: Gemini 2.0 Flash Update
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
        errorMessage += " (This often happens if the VITE_API_URL is wrong, or the backend timed out after 10s on Vercel Hobby tier)";
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
          TRANSCRIPT_PROCESSOR_V3.0<br />
          MODEL: GEMINI-2.0-FLASH<br />
          CLIP_TARGET: 60s // ENCODING: UTF-8<br />
          NOISE_FLOOR: -45db
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
                style={{ display: 'none' }}
                onChange={onFileChange}
                accept=".txt"
              />
              {file ? (
                <div className="filename">{file.name}</div>
              ) : (
                <p>DROP TRANSCRIPT HERE<br />(OR CLICK TO BROWSE)</p>
              )}
            </div>
          </div>

          <div className="glass-panel">
            <div className="panel-label">PROCESSING</div>
            <button
              className="btn-viral"
              onClick={handleUpload}
              disabled={loading || !file}
            >
              {loading ? 'ANALYZING...' : 'EXTRACT VIRAL CLIPS'}
            </button>
            <p style={{ marginTop: '10px', fontSize: '0.65rem', color: '#666', textAlign: 'center' }}>
              REDUNDANCY CHECK: ACTIVE // BUFFER: CLEAR
            </p>
          </div>

          <div className="glass-panel">
            <div className="panel-label">SYSTEM METADATA</div>
            <ul className="metadata-list">
              <li>SCANNING FOR "GOLDEN NUGGETS"</li>
              <li>DETECTING CURIOSITY GAPS</li>
              <li>SCORING VIRAL POTENTIAL</li>
              <li>GENERATING NARRATION INTROS</li>
              <li>VERIFYING TIMESTAMPS...</li>
            </ul>
          </div>
        </aside>

        <section className="report-panel">
          {analysis ? (
            <div className="report-card">
              <div className="panel-label">[ FINAL REPORT ]</div>
              <div className="report-content">
                <ReactMarkdown>{analysis}</ReactMarkdown>
              </div>
            </div>
          ) : (
            <div className="empty-state">
              <div className="panel-label">AWAITING FEED...</div>
              <p>UPLOAD A TRANSCRIPT TO BEGIN ANALYTICS</p>
            </div>
          )}
        </section>
      </main>

      {loading && (
        <div className="processing-status">
          <div className="rec-pulse"></div>
          <span>LIVE PROCESSING IN PROGRESS // SYNCING WITH GEMINI-2.0</span>
        </div>
      )}
    </div>
  )
}

export default App
