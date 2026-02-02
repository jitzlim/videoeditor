// Build Trigger: Cyber Blue Ultra
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
          TRANSCRIPT_PROCESSOR_V4.0<br />
          MODEL: GEMINI-2.0-FLASH<br />
          CLIP_TARGET: 60s // ENCODING: UTF-8
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
                <p>READY FOR SIGNAL...<br />UPLOAD A TRANSCRIPT TO COMMENCE ANALYSIS.</p>
              )}
            </div>
          </div>

          <div className="glass-panel">
            <div className="panel-label">PROCESSING_MODULE</div>
            <button
              className="btn-viral"
              onClick={handleUpload}
              disabled={loading || !file}
            >
              {loading ? 'DETERMINING...' : 'EXTRACT VIRAL CLIPS'}
            </button>
            <p style={{ marginTop: '15px', fontFamily: 'Space Mono', fontSize: '0.6rem', color: '#444', textAlign: 'center' }}>
              REDUNDANCY CHECK: ACTIVE // BUFFER: CLEAR
            </p>
          </div>

          <div className="glass-panel">
            <div className="panel-label">SYSTEM_CORE</div>
            <ul className="metadata-list" style={{ listStyle: 'none', fontFamily: 'Space Mono', fontSize: '0.7rem', color: '#555' }}>
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
              <p>NO SIGNAL DETECTED</p>
            </div>
          )}
        </section>
      </main>

      <footer className="app-footer">
        <div>© 2026 CLIPOOOR DIGITAL RECON</div>
        <div>LAT: 37.7749° N, LONG: 122.4194° W</div>
      </footer>

      {loading && (
        <div className="processing-status" style={{ position: 'fixed', bottom: '60px', right: '40px', background: '#00f2ff', color: '#000', padding: '10px 20px', fontFamily: 'Space Mono', fontWeight: 'bold' }}>
          <span>PROCESSING DATA STREAMS...</span>
        </div>
      )}
    </div>
  )
}

export default App
