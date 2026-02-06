import { useState, useRef, useEffect } from 'react'
import './App.css'
import ReactMarkdown from 'react-markdown'
import nexusAvatar from './assets/nexus_avatar.png'

const MODELS = [
  { id: 'google/gemini-2.0-flash-exp', name: 'GEMINI 2.0 FLASH // KINETIC_SPEED' },
  { id: 'openai/gpt-4o-mini', name: 'GPT-4O MINI // STRATEGIC_REASONING' },
  { id: 'deepseek/deepseek-r1-0528:free', name: 'DEEPSEEK R1 // NARRATIVE_UNIT (SLOW)' },
]

const INTEL_DATA = [
  { label: "AI_RECON", text: "Runway Gen-3 Alpha is now supporting advanced camera control for high-fidelity backgrounds." },
  { label: "VFX_RESOURCES", text: "ProductionCrate has a new library of tactical overlays and grain textures perfect for Noir edits." },
  { label: "SFX_ANCHOR", text: "Check Freesound.org for industrial glitch impacts and 'deep-thud' swooshes." },
  { label: "STRATEGY_TIP", text: "Engagement peaks when Verbatim Anchors are used as high-contrast kinetic text overlays." },
  { label: "ASSET_SYNC", text: "ElevenLabs Voice Isolator is now the gold standard for cleaning transcript audio." }
]

function App() {
  const [file, setFile] = useState(null)
  const [loading, setLoading] = useState(false)
  const [clips, setClips] = useState([])
  const [expandedId, setExpandedId] = useState(null)
  const [history, setHistory] = useState([])
  const [isDragging, setIsDragging] = useState(false)
  const [selectedModel, setSelectedModel] = useState(MODELS[0].id)
  const [intelIndex, setIntelIndex] = useState(0)
  const fileInputRef = useRef(null)

  useEffect(() => {
    const savedHistory = localStorage.getItem('clipooor_history_v7')
    if (savedHistory) {
      try { setHistory(JSON.parse(savedHistory)) } catch (e) { console.error("History parse fail", e) }
    }
  }, [])

  useEffect(() => {
    const timer = setInterval(() => {
      setIntelIndex(prev => (prev + 1) % INTEL_DATA.length)
    }, 8000)
    return () => clearInterval(timer)
  }, [])

  useEffect(() => {
    localStorage.setItem('clipooor_history_v7', JSON.stringify(history))
  }, [history])

  const onFileChange = (e) => {
    if (e.target.files && e.target.files[0]) { setFile(e.target.files[0]) }
    e.target.value = ''
  }

  const handleUpload = async () => {
    if (!file) return
    setLoading(true)
    setClips([])
    const formData = new FormData()
    formData.append('file', file)
    formData.append('model', selectedModel)

    try {
      // Use environment variable or detect environment
      // In production, backend should be on same domain (Vercel serverless functions)
      const apiUrl = import.meta.env.VITE_API_URL ||
        (window.location.hostname === 'localhost' ? 'http://localhost:8000' : '');
      console.log(`[TACTICAL_RECON] Initiating fetch for model: ${selectedModel} at ${apiUrl || 'same-origin'}`)
      const response = await fetch(`${apiUrl}/analyze`, { method: 'POST', body: formData })
      console.log(`[TACTICAL_RECON] Status: ${response.status} ${response.statusText}`)
      const data = await response.json()
      if (response.ok && data.clips) {
        setClips(data.clips)
        setHistory(prev => [{ id: Date.now(), timestamp: new Date().toLocaleTimeString(), filename: file.name, clips: data.clips }, ...prev].slice(0, 15))
      } else {
        alert(data.detail || "Strategic Analysis Fail")
      }
    } catch (e) {
      alert(`Network Error: ${e.message}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="app-wrapper">
      {loading && <div className="processing-status" />}

      <header className="header-nav">
        <div className="logo-group">
          <h1>CLIPR</h1>
        </div>
        <div className="status-bits">
          ENGINE: CLIPR_NOIR_SYSTEM_V7.2<br />
          UNIT: {MODELS.find(m => m.id === selectedModel)?.name.split(' // ')[0]}<br />
          STATUS: {loading ? 'DECRYPTING...' : 'READY_SIGNAL'}
        </div>
      </header>

      <main className="main-content">
        <aside className="control-sidebar">
          <div className="glass-panel">
            <div className="panel-label">INTELLIGENCE_LAYER</div>
            <select
              className="model-select"
              value={selectedModel}
              onChange={(e) => setSelectedModel(e.target.value)}
            >
              {MODELS.map(model => (
                <option key={model.id} value={model.id}>{model.name}</option>
              ))}
            </select>
          </div>

          <div className="glass-panel">
            <div className="panel-label">DATA_INPUT</div>
            <div
              className={`file-drop-zone ${isDragging ? 'dragging' : ''}`}
              onClick={() => fileInputRef.current.click()}
              onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={(e) => { e.preventDefault(); setIsDragging(false); setFile(e.dataTransfer.files[0]); }}
            >
              <input type="file" ref={fileInputRef} className="hidden-input" onChange={onFileChange} style={{ display: 'none' }} />
              {file ? <div className="filename">{file.name}</div> : <div className="p">DRAG_TRANSCRIPT_HERE</div>}
            </div>
          </div>

          <div className="glass-panel">
            <button className="action-btn" onClick={handleUpload} disabled={loading || !file}>
              {loading ? 'REASONING...' : 'START EXTRACTION'}
            </button>
          </div>

          {history.length > 0 && (
            <div className="glass-panel history-panel">
              <div className="panel-label">MISSION_RECORDS</div>
              <div className="history-list">
                {history.map(item => (
                  <div key={item.id} className="history-item" onClick={() => setClips(item.clips)}>
                    <div className="history-filename">{item.filename}</div>
                    <div className="history-date">{item.timestamp}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </aside>

        <section className="report-panel">
          {clips.length > 0 ? (
            <div className="accordion-container">
              {clips.map((clip, index) => (
                <div key={clip.id} className={`accordion-item ${expandedId === clip.id ? 'expanded' : ''}`}>
                  <div className="accordion-header" onClick={() => setExpandedId(expandedId === clip.id ? null : clip.id)}>
                    <div className="clip-rank">0{index + 1}</div>
                    <div className="clip-info">
                      <div className="clip-title">{clip.title}</div>
                      <div className="clip-sub">TSC: {clip.timestamp} // {clip.strategy?.hook_type?.toUpperCase()}</div>
                    </div>
                    <div className="clip-score">
                      <span className="label">VIRAL_LOAD</span>
                      <span className="value">{clip.viral_score}</span>
                    </div>
                  </div>

                  {expandedId === clip.id && (
                    <div className="accordion-content">
                      <div className="strategy-suite">
                        <div className="strategy-tag">REASONING_RECON: {clip.strategy?.psychological_trigger}</div>
                        <p className="strategy-logic">{clip.strategy?.logic}</p>
                      </div>

                      <div className="clip-grid">
                        <div className="clip-section">
                          <div className="section-label">NARRATIVE DIRECTIVE</div>
                          <div className="script-container">
                            <i className="context-text">{clip.narration_intro?.context}</i>
                            <div className="script-text"><ReactMarkdown>{clip.narration_intro?.script}</ReactMarkdown></div>
                          </div>
                        </div>

                        <div className="clip-section">
                          <div className="section-label">SIGNAL_VARIANTS</div>
                          <div className="variants-grid">
                            {clip.variants?.map((variant, i) => (
                              <div key={i} className="variant-card">
                                <span className="variant-type">[{variant.type.toUpperCase()}]</span>
                                <span className="variant-text"><ReactMarkdown>{variant.text}</ReactMarkdown></span>
                              </div>
                            ))}
                            {/* Fallback for old data */}
                            {!clip.variants && clip.hook_line && (
                              <div className="variant-card">
                                <span className="variant-type">[PRIMARY_SIGNAL]</span>
                                <span className="variant-text"><ReactMarkdown>{clip.hook_line}</ReactMarkdown></span>
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="clip-section">
                          <div className="section-label">VERBATIM_ANCHORS (FOR_EDITING)</div>
                          {clip.key_moments?.map((m, i) => (
                            <div key={i} className="moment-row">
                              <span className="m-time">{m.time}</span>
                              <span className="m-text"><ReactMarkdown>{m.text}</ReactMarkdown></span>
                            </div>
                          ))}
                        </div>

                        <div className="clip-section">
                          <div className="section-label">EDITORIAL_VFX_LOG</div>
                          <p className="edit-text">{clip.recommended_edit}</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <p>{loading ? 'PERFORMING_STRATEGIC_SCAN...' : 'AWAITING_INPUT_SIGNAL'}</p>
            </div>
          )}
        </section>
      </main>

      <footer className="app-footer">
        <div>DESIGNED BY JITZ // {new Date().getFullYear()} // KINETIC_NOIR</div>
        <div>IP_ORIGIN: 0.0.0.0 // SECTOR_88</div>
      </footer>

      {/* FLOATING NEXUS UNIT */}
      <div className="nexus-floating-unit">
        <div className="nexus-intel-card">
          <div className="intel-tag">{INTEL_DATA[intelIndex].label}</div>
          <div className="intel-text">{INTEL_DATA[intelIndex].text}</div>
        </div>
        <div className="nexus-orb-container">
          <img src={nexusAvatar} alt="NEXUS" className="nexus-orb" />
          <div className="pulse-ring"></div>
        </div>
      </div>
    </div>
  )
}

export default App
