import { useState, useRef } from 'react'
import './App.css'
import ReactMarkdown from 'react-markdown'

function App() {
  const [file, setFile] = useState(null)
  const [analysis, setAnalysis] = useState('')
  const [loading, setLoading] = useState(false)
  const fileInputRef = useRef(null)

  const handleFileChange = (e) => {
    if (e.target.files) {
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
        setAnalysis(`Error: ${data.detail}`)
      }
    } catch (error) {
      setAnalysis(`Error: ${error.message}`)
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
          MODEL: GEMMA-3N-E4B-IT<br />
          ENCODING: UTF-8 // NOISE_FLOOR: -45db
        </div>
      </header>

      <main className="main-content">
        <aside className="control-sidebar">
          <div className="glass-panel">
            <div className="panel-label">Source Input</div>
            <div className="file-drop-zone" onClick={triggerFileInput}>
              <input
                type="file"
                accept=".txt,.md"
                onChange={handleFileChange}
                className="hidden-input"
                ref={fileInputRef}
              />
              <p>
                {file ? (
                  <span style={{ color: 'var(--accent)' }}>{file.name}</span>
                ) : (
                  "DROP TRANSCRIPT OR CLICK TO BROWSE"
                )}
              </p>
            </div>
          </div>

          <div className="glass-panel">
            <div className="panel-label">Processing</div>
            <button
              onClick={handleUpload}
              disabled={!file || loading}
              className="action-btn"
            >
              {loading ? 'ANALYZING...' : 'EXTRACT VIRAL CLIPS'}
            </button>
            <div style={{ marginTop: '1rem', fontFamily: 'var(--font-mono)', fontSize: '0.6rem', color: 'var(--text-dim)', textAlign: 'center' }}>
              REDUNDANCY CHECK: ACTIVE // BUFFER: CLEAR
            </div>
          </div>

          <div className="glass-panel" style={{ flexGrow: 1 }}>
            <div className="panel-label">System Metadata</div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: 'var(--text-dim)' }}>
              &gt; SCANNING FOR "GOLDEN NUGGETS"<br />
              &gt; DETECTING CURIOSITY GAPS<br />
              &gt; SCORING VIRAL POTENTIAL<br />
              &gt; GENERATING NARRATION INTROS<br />
              &gt; VERIFYING TIMESTAMPS...
            </div>
          </div>
        </aside>

        <section className="output-area">
          {loading && (
            <div className="loading-overlay">
              <div className="spinner"></div>
              <p style={{ marginTop: '2rem', fontFamily: 'var(--font-mono)', fontSize: '0.8rem', letterSpacing: '2px' }}>
                PROCESSING STREAM...
              </p>
            </div>
          )}

          {!analysis && !loading && (
            <div className="empty-state">
              READY FOR SIGNAL... UPLOAD A TRANSCRIPT TO COMMENCE ANALYSIS.
            </div>
          )}

          {analysis && (
            <div className="analysis-container markdown-body">
              <div className="glass-panel" style={{ marginBottom: '2rem', background: 'var(--accent-soft)', border: '1px solid var(--accent)' }}>
                <div className="panel-label" style={{ color: '#000', background: 'var(--accent)', padding: '0.2rem 0.5rem', width: 'fit-content' }}>
                  Final Report
                </div>
                <div style={{ marginTop: '1.5rem' }}>
                  <ReactMarkdown>{analysis}</ReactMarkdown>
                </div>
              </div>
            </div>
          )}
        </section>
      </main>

      <footer style={{ marginTop: '4rem', padding: '1rem 0', borderTop: '1px solid var(--border)', fontFamily: 'var(--font-mono)', fontSize: '0.6rem', color: 'var(--text-dim)', display: 'flex', justifyContent: 'space-between' }}>
        <span>© 2026 CLIPOOOR DIGITAL RECON</span>
        <span>LAT: 37.7749° N, LONG: 122.4194° W</span>
      </footer>
    </div>
  )
}

export default App
