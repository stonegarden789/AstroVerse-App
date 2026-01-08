import React from 'react';

function App() {
  return (
    <div style={{ 
      backgroundColor: '#1a0b2e', 
      color: 'white', 
      height: '100vh', 
      display: 'flex', 
      flexDirection: 'column', 
      justifyContent: 'center', 
      alignItems: 'center', 
      textAlign: 'center', 
      fontFamily: 'sans-serif',
      backgroundImage: 'radial-gradient(circle, #2d1b4e 0%, #1a0b2e 100%)'
    }}>
      <h1 style={{ fontSize: '3rem', marginBottom: '20px' }}>🌌 AstroVerse</h1>
      <h2 style={{ fontSize: '1.5rem', color: '#a855f7' }}>Revenim imediat!</h2>
      <p style={{ maxWidth: '500px', lineHeight: '1.6', padding: '0 20px' }}>
        Momentan îmbunătățim sistemul de plăți pentru a vă oferi cea mai sigură experiență. 
        Lansăm varianta completă în câteva ore.
      </p>
      <div style={{ marginTop: '30px', padding: '10px 20px', border: '1px solid #a855f7', borderRadius: '20px' }}>
        🚀 Pregătim stelele...
      </div>
    </div>
  );
}

export default App;
