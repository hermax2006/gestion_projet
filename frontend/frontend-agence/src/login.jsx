import { useState } from 'react';

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

      // On vérifie si la réponse est du JSON avant de la lire
      const data = await response.json();

      if (response.ok) {
        // Succès : on enregistre et on connecte
        localStorage.setItem('user', JSON.stringify(data));
        onLogin(data);
      } else {
        // Erreur 401 ou autre renvoyée par PHP
        setError(data.error || "Identifiants incorrects");
      }
    } catch (err) {
      // Erreur de réseau ou serveur injoignable
      setError("Erreur de connexion au serveur.");
      console.error("Détails de l'erreur:", err);
    }
  };

  return (
    <div style={{ height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundColor: '#f0f2f5' }}>
      <form onSubmit={handleSubmit} style={{ background: 'white', padding: '30px', borderRadius: '8px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)', width: '300px' }}>
        <h2 style={{ textAlign: 'center' }}>Connexion</h2>
        
        {error && (
          <p style={{ color: 'red', fontSize: '14px', textAlign: 'center', backgroundColor: '#ffe6e6', padding: '10px', borderRadius: '4px' }}>
            {error}
          </p>
        )}
        
        <input 
          style={inputStyle} 
          type="text" 
          placeholder="Identifiant" 
          required
          value={credentials.login}
          onChange={e => setCredentials({...credentials, login: e.target.value})} 
        />
        
        <input 
          style={inputStyle} 
          type="password" 
          placeholder="Mot de passe" 
          required
          value={credentials.password}
          onChange={e => setCredentials({...credentials, password: e.target.value})} 
        />
        
        <button type="submit" style={btnStyle}>Se connecter</button>
      </form>
    </div>
  );
}

const inputStyle = { width: '100%', padding: '10px', marginBottom: '15px', borderRadius: '4px', border: '1px solid #ddd', boxSizing: 'border-box' };
const btnStyle = { width: '100%', padding: '10px', backgroundColor: '#282c34', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' };

export default Login;