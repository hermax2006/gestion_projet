import { useState, useEffect } from 'react';
import Organismes from './Organismes';
import Phases from './Phases';
import Dashboard from './Dashboard';
import Login from './Login';

function App() {
  const [user, setUser] = useState(null);
  const [vueActuelle, setVueActuelle] = useState('');

  // Vérifier si un utilisateur est déjà connecté au chargement
  useEffect(() => {
    const loggedUser = localStorage.getItem('user');
    if (loggedUser) {
      const u = JSON.parse(loggedUser);
      setUser(u);
      setVueActuelle(u.role === 'comptable' ? 'dashboard' : 'secretaire');
    }
  }, []);

  if (!user) return <Login onLogin={(u) => { setUser(u); setVueActuelle(u.role === 'comptable' ? 'dashboard' : 'secretaire'); }} />;

  return (
    <div className="App">
      <header style={{ backgroundColor: '#282c34', padding: '15px', color: 'white' }}>
        <span>Connecté en tant que : <strong>{user.username} ({user.role})</strong></span>
        <button onClick={() => { localStorage.removeItem('user'); setUser(null); }} style={{ marginLeft: '20px' }}>Déconnexion</button>
        
        <nav style={{ marginTop: '10px' }}>
          {/* Menu filtré par rôle */}
          {(user.role === 'secretaire' || user.role === 'admin') && 
            <button onClick={() => setVueActuelle('secretaire')}>Projets</button>}
          
          {(user.role === 'chef' || user.role === 'admin') && 
            <button onClick={() => setVueActuelle('chef')}>Phases</button>}
          
          {(user.role === 'comptable' || user.role === 'admin') && 
            <button onClick={() => setVueActuelle('dashboard')}>Dashboard</button>}
        </nav>
      </header>

      <main style={{ padding: '20px' }}>
        {vueActuelle === 'secretaire' && <Organismes />}
        {vueActuelle === 'chef' && <Phases />}
        {vueActuelle === 'dashboard' && <Dashboard />}
      </main>
    </div>
  );
}

export default App;