import React from 'react'

/** Catches render-time errors so the app never goes fully blank. */
export default class ErrorBoundary extends React.Component {
  state = { error: null }

  static getDerivedStateFromError(error) {
    return { error }
  }

  componentDidCatch(error, info) {
    console.error('[EmpowerCraft] render error:', error, info)
  }

  handleReload = () => {
    this.setState({ error: null })
    if (window.location.pathname.startsWith('/marketplace')) {
      window.location.href = '/marketplace/home'
    } else if (window.location.pathname.startsWith('/artisan')) {
      window.location.href = '/artisan/dashboard'
    } else {
      window.location.href = '/'
    }
  }

  render() {
    if (this.state.error) {
      return (
        <div style={{
          minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
          background: '#FFF6E9', fontFamily: 'system-ui',
        }}>
          <div style={{ textAlign: 'center', padding: 24, maxWidth: 420 }}>
            <div style={{ fontSize: 44 }}>🪔</div>
            <h1 style={{ fontFamily: 'ui-rounded, system-ui', fontSize: 22, fontWeight: 800, margin: '12px 0 6px', color: '#1A1423' }}>
              Oops — something went wrong
            </h1>
            <p style={{ color: '#666', fontSize: 14, lineHeight: 1.5 }}>
              A page failed to load. This is normally a browser/network quirk, not your fault.
            </p>
            <div style={{ display: 'flex', gap: 10, justifyContent: 'center', marginTop: 18, flexWrap: 'wrap' }}>
              <button onClick={this.handleReload}
                style={{ background: '#FF9933', color: '#fff', border: 0, borderRadius: 12, padding: '10px 18px', fontWeight: 700, cursor: 'pointer' }}>
                Go to Home
              </button>
              <button onClick={() => { this.setState({ error: null }); window.location.reload() }}
                style={{ background: '#fff', color: '#1A1423', border: '1px solid #ddd', borderRadius: 12, padding: '10px 18px', fontWeight: 700, cursor: 'pointer' }}>
                Refresh
              </button>
            </div>
            {this.state.error && (
              <p style={{ marginTop: 16, fontSize: 11, color: '#b00', background: '#ffe', padding: 8, borderRadius: 8, wordBreak: 'break-word' }}>
                {String(this.state.error.message || this.state.error)}
              </p>
            )}
          </div>
        </div>
      )
    }
    return this.props.children
  }
}