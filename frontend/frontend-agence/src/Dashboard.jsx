import { useState, useEffect } from 'react';
import axios from 'axios';
import RapportComptable from './RapportComptable'; 

function Dashboard() {
  const [stats, setStats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const savedUser = JSON.parse(localStorage.getItem('user'));
    setUser(savedUser);

    const fetchStats = async () => {
      try {
        const res = await axios.get('http://localhost/PHP/gestion_projet/backend/api_dashboard.php');
        if (Array.isArray(res.data)) {
          setStats(res.data);
        }
      } catch (err) {
        console.error("Erreur technique sur le Dashboard:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const getBarColor = (pct) => {
    if (pct >= 100) return '#e74c3c'; 
    if (pct >= 75) return '#f39c12';  
    return '#2ecc71';                 
  };

  if (loading) return <p style={{ padding: '20px' }}>Chargement des finances en cours...</p>;

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '2px solid #34495e', marginBottom: '20px', paddingBottom: '10px' }}>
        <h2 style={{ margin: 0 }}>Tableau de Bord Financier</h2>
        
        {/* Le bouton PDF s'affiche pour le rôle comptable ou admin */}
        {user && (user.role === 'comptable' || user.role === 'admin') && stats.length > 0 && (
          <RapportComptable stats={stats} />
        )}
      </div>
      
      {stats.length === 0 ? (
        <p>Aucune donnée financière disponible.</p>
      ) : (
        stats.map(proj => {
          const total = Number(proj.budget_total); 
          const consomme = Number(proj.budget_consomme) || 0; 
          const pourcentage = total > 0 ? (consomme / total) * 100 : 0;

          return (
            <div key={proj.id_proj} style={{ marginBottom: '25px', padding: '15px', background: '#f9f9f9', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <strong style={{ fontSize: '1.1em' }}>{proj.nom}</strong>
                <span style={{ fontWeight: 'bold' }}>
                  {consomme.toLocaleString()} € / {total.toLocaleString()} €
                </span>
              </div>
              
              {/* Visualisation de la barre de progression */}
              <div style={{ backgroundColor: '#ecf0f1', borderRadius: '10px', height: '15px', marginTop: '10px', overflow: 'hidden', border: '1px solid #ddd' }}>
                <div style={{ 
                  width: `${Math.min(pourcentage, 100)}%`, 
                  backgroundColor: getBarColor(pourcentage), 
                  height: '100%',
                  transition: 'width 0.8s ease-in-out'
                }}></div>
              </div>
              
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '5px' }}>
                <small style={{ color: '#7f8c8d' }}>{pourcentage.toFixed(1)}% utilisé</small>
                {pourcentage > 100 && <small style={{ color: '#e74c3c', fontWeight: 'bold' }}>Dépassement !</small>}
              </div>
            </div>
          );
        })
      )}
    </div>
  );
}

export default Dashboard;