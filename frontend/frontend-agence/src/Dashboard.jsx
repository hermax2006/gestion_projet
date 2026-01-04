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

  if (loading) {
    return (
      <div className="h-full w-screen bg-slate-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto mb-4"></div>
          <p className="text-slate-600 font-semibold">Chargement des finances en cours...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full w-screen bg-slate-100">
      <div className="w-full space-y-10 animate-in fade-in duration-700 py-8 px-4">
        
        {/* EN-TÊTE AVEC BOUTON PDF */}
        <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-2 bg-red-600 rounded-full"></div>
              <h2 className="text-2xl font-black text-slate-800 tracking-tight">Tableau de Bord Financier</h2>
            </div>
            
            {/* Le bouton PDF s'affiche pour le rôle comptable ou admin */}
            {user && (user.role === 'comptable' || user.role === 'admin') && stats.length > 0 && (
              <RapportComptable stats={stats} />
            )}
          </div>
        </div>

        {/* CONTENU PRINCIPAL */}
        {stats.length === 0 ? (
          <div className="bg-white p-20 rounded-[2.5rem] shadow-sm border border-slate-100">
            <div className="text-center">
              <div className="text-6xl mb-4">📊</div>
              <p className="text-slate-400 font-bold text-lg">Aucune donnée financière disponible.</p>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {stats.map(proj => {
              const total = Number(proj.budget_total); 
              const consomme = Number(proj.budget_consomme) || 0; 
              const pourcentage = total > 0 ? (consomme / total) * 100 : 0;

              return (
                <div 
                  key={proj.id_proj} 
                  className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100 hover:shadow-xl transition-all duration-300"
                >
                  {/* En-tête du projet */}
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
                    <h3 className="text-xl font-black text-slate-800 tracking-tight">{proj.nom}</h3>
                    <div className="flex items-center gap-2">
                      <span className="text-2xl font-black text-slate-700">
                        {consomme.toLocaleString()}
                      </span>
                      <span className="text-slate-400 font-bold">/</span>
                      <span className="text-xl font-bold text-slate-500">
                        {total.toLocaleString()} €
                      </span>
                    </div>
                  </div>
                  
                  {/* Barre de progression */}
                  <div className="relative">
                    <div className="h-6 bg-slate-100 rounded-full overflow-hidden border-2 border-slate-50">
                      <div 
                        style={{ 
                          width: `${Math.min(pourcentage, 100)}%`, 
                          backgroundColor: getBarColor(pourcentage),
                          transition: 'width 0.8s ease-in-out'
                        }}
                        className="h-full flex items-center justify-end pr-2"
                      >
                        {pourcentage >= 20 && (
                          <span className="text-white text-xs font-black">
                            {pourcentage.toFixed(1)}%
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  {/* Informations complémentaires */}
                  <div className="flex justify-between items-center mt-4">
                    <div className="flex items-center gap-2">
                      <span className={`px-3 py-1.5 rounded-lg text-xs font-bold ${
                        pourcentage >= 100 ? 'bg-red-100 text-red-700' :
                        pourcentage >= 75 ? 'bg-orange-100 text-orange-700' :
                        'bg-green-100 text-green-700'
                      }`}>
                        {pourcentage.toFixed(1)}% utilisé
                      </span>
                      
                      {pourcentage > 100 && (
                        <span className="px-3 py-1.5 bg-red-600 text-white rounded-lg text-xs font-black animate-pulse">
                          ⚠️ DÉPASSEMENT !
                        </span>
                      )}
                    </div>
                    
                    <span className="text-slate-400 text-sm font-bold">
                      Reste: {(total - consomme).toLocaleString()} €
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* STATISTIQUES GLOBALES */}
        {stats.length > 0 && (
          <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100">
            <div className="flex items-center gap-3 mb-6">
              <div className="h-10 w-2 bg-blue-600 rounded-full"></div>
              <h2 className="text-2xl font-black text-slate-800 tracking-tight">Vue d'ensemble</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center p-6 bg-slate-50 rounded-2xl border border-slate-100">
                <div className="text-3xl font-black text-slate-800 mb-2">
                  {stats.length}
                </div>
                <div className="text-xs font-black text-slate-400 uppercase tracking-widest">
                  Projets Suivis
                </div>
              </div>
              
              <div className="text-center p-6 bg-slate-50 rounded-2xl border border-slate-100">
                <div className="text-3xl font-black text-blue-600 mb-2">
                  {stats.reduce((sum, p) => sum + Number(p.budget_total), 0).toLocaleString()} €
                </div>
                <div className="text-xs font-black text-slate-400 uppercase tracking-widest">
                  Budget Total
                </div>
              </div>
              
              <div className="text-center p-6 bg-slate-50 rounded-2xl border border-slate-100">
                <div className="text-3xl font-black text-red-600 mb-2">
                  {stats.reduce((sum, p) => sum + Number(p.budget_consomme || 0), 0).toLocaleString()} €
                </div>
                <div className="text-xs font-black text-slate-400 uppercase tracking-widest">
                  Budget Consommé
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Dashboard;