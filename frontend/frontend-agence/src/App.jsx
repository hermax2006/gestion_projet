import React, { useState, useEffect } from 'react';
import Organismes from './Organismes'; // Import du composant Organismes existant

/**
 * Composant de Connexion - Design Responsive avec Tailwind CSS
 * LOGIQUE ORIGINALE CONSERVÉE (FUSIONNÉE DANS LE FICHIER UNIQUE)
 */
function Login({ onLogin }) {
  const [credentials, setCredentials] = useState({ login: '', password: '' });
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await fetch('http://localhost/PHP/gestion_projet/backend/api_login.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('user', JSON.stringify(data));
        onLogin(data);
      } else {
        setError(data.error || "Identifiants incorrects");
      }
    } catch (err) {
      setError("Erreur de connexion au serveur.");
      console.error("Détails de l'erreur:", err);
    }
  };

  return (
    <div className="h-screen w-screen flex items-center justify-center bg-slate-100 font-sans p-4 overflow-hidden">
      <div className="flex w-full max-w-5xl bg-white rounded-[2rem] overflow-hidden shadow-2xl min-h-[600px]">
        
        {/* Section Image Gauche */}
        <div className="hidden lg:flex lg:w-1/2 relative">
          <img 
            src="https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=1200" 
            alt="Bureau moderne" 
            className="absolute inset-0 object-cover w-full h-full"
          />
          <div className="absolute inset-0 bg-gradient-to-tr from-slate-900 via-slate-900/40 to-transparent"></div>
          <div className="relative z-10 flex flex-col justify-end p-12 text-white">
            <div className="bg-blue-600 w-12 h-1 mb-6"></div>
            <h2 className="text-4xl font-bold mb-4 leading-tight">Pilotez vos projets avec précision.</h2>
            <p className="text-slate-200 text-lg max-w-md">Une plateforme intégrée pour le suivi opérationnel et la gestion financière de vos organismes.</p>
          </div>
        </div>

        {/* Section Formulaire Droite */}
        <div className="w-full lg:w-1/2 p-8 md:p-16 flex flex-col justify-center bg-white">
          <div className="mb-12 text-center lg:text-left">
            <h1 className="text-4xl font-black text-slate-900 tracking-tighter mb-2">
              Gestion<span className="text-blue-600">Pro</span>
            </h1>
            <div className="h-1 w-12 bg-blue-600 rounded-full mb-6 mx-auto lg:mx-0"></div>
            <h2 className="text-xl font-semibold text-slate-700">Connexion</h2>
            <p className="text-slate-400 text-sm">Entrez vos accès pour continuer</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="bg-red-50 text-red-700 p-4 rounded-2xl border border-red-100 text-sm font-medium flex items-center gap-3">
                <span className="flex-shrink-0 bg-red-100 p-1 rounded-full text-xs">⚠️</span>
                {error}
              </div>
            )}
            
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Identifiant</label>
              <input 
                type="text" 
                placeholder="Identifiant" 
                className="w-full px-5 py-4 rounded-2xl border-2 border-slate-50 focus:border-blue-500 focus:bg-white transition-all outline-none bg-slate-50 text-slate-800 placeholder:text-slate-300"
                required
                value={credentials.login}
                onChange={e => setCredentials({...credentials, login: e.target.value})} 
              />
            </div>
            
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Mot de passe</label>
              <input 
                type="password" 
                placeholder="Mot de passe" 
                className="w-full px-5 py-4 rounded-2xl border-2 border-slate-50 focus:border-blue-500 focus:bg-white transition-all outline-none bg-slate-50 text-slate-800 placeholder:text-slate-300"
                required
                value={credentials.password}
                onChange={e => setCredentials({...credentials, password: e.target.value})} 
              />
            </div>
            
            <button 
              type="submit" 
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-2xl shadow-xl shadow-blue-200 transition-all active:scale-[0.98] mt-4 flex justify-center items-center gap-2"
            >
              SE CONNECTER
            </button>
          </form>
          
          <div className="mt-12 text-center lg:text-left">
            <p className="text-xs text-slate-400 font-medium">
              Système de gestion interne sécurisé • © 2026 GestionPro
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

// Mockup des autres composants pour éviter les erreurs d'importation
const Phases = () => <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-200"><h2>Gestion des Phases</h2><p>Interface Chef de Projet...</p></div>;
const Dashboard = () => <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-200"><h2>Tableau de Bord Financier</h2><p>Interface Comptabilité...</p></div>;

/**
 * Composant Principal App
 */
export default function App() {
  const [user, setUser] = useState(null);
  const [vueActuelle, setVueActuelle] = useState('');

  useEffect(() => {
    const loggedUser = localStorage.getItem('user');
    if (loggedUser) {
      const u = JSON.parse(loggedUser);
      setUser(u);
      // Logique de redirection basée sur le rôle
      setVueActuelle(u.role === 'comptable' ? 'dashboard' : 'secretaire');
    }
  }, []);

  if (!user) {
    return <Login onLogin={(u) => { 
      setUser(u); 
      setVueActuelle(u.role === 'comptable' ? 'dashboard' : 'secretaire'); 
    }} />;
  }

  return (
    <div className="min-h-screen bg-slate-100 font-sans">
      <header className="bg-slate-900 text-white px-8 py-4 flex flex-col md:flex-row justify-between items-center shadow-lg gap-4">
        <div className="flex items-center gap-4">
          <div className="h-11 w-11 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center font-black text-xl">
            {(user.nom || user.login || "U").charAt(0).toUpperCase()}
          </div>
          <div>
            <div className="text-sm font-semibold">Bienvenue, <span className="text-blue-400">{user.nom || user.login}</span></div>
            <div className="text-[10px] uppercase font-bold tracking-widest opacity-60">Rôle: {user.role || 'Utilisateur'}</div>
          </div>
        </div>
        
        <nav className="flex items-center gap-2 bg-white/5 p-1.5 rounded-2xl">
          {(user.role === 'secretaire' || user.role === 'admin') && 
            <button 
              className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all ${vueActuelle === 'secretaire' ? 'bg-white text-slate-900' : 'text-slate-400'}`}
              onClick={() => setVueActuelle('secretaire')}
            >
              Projets
            </button>
          }
          
          {(user.role === 'chef' || user.role === 'admin') && 
            <button 
              className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all ${vueActuelle === 'chef' ? 'bg-white text-slate-900' : 'text-slate-400'}`}
              onClick={() => setVueActuelle('chef')}
            >
              Phases
            </button>
          }
          
          {(user.role === 'comptable' || user.role === 'admin') && 
            <button 
              className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all ${vueActuelle === 'dashboard' ? 'bg-white text-slate-900' : 'text-slate-400'}`}
              onClick={() => setVueActuelle('dashboard')}
            >
              Dashboard
            </button>
          }
            
          <button 
            onClick={() => { localStorage.removeItem('user'); setUser(null); }} 
            className="ml-4 px-5 py-2.5 bg-red-600 text-white text-xs font-bold rounded-xl transition-all"
          >
            Déconnexion
          </button>
        </nav>
      </header>

      <main className="p-8 max-w-7xl mx-auto">
        <div className="mb-8">
            <h1 className="text-3xl font-bold text-slate-800 tracking-tight capitalize">{vueActuelle}</h1>
        </div>
        {vueActuelle === 'secretaire' && <Organismes />}
        {vueActuelle === 'chef' && <Phases />}
        {vueActuelle === 'dashboard' && <Dashboard />}
      </main>
    </div>
  );
}