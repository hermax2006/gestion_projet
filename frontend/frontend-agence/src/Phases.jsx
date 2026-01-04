import { useState, useEffect } from 'react';
import axios from 'axios';

function Phases() {
  const [projets, setProjets] = useState([]);
  const [phases, setPhases] = useState([]);
  const [idProjetSelectionne, setIdProjetSelectionne] = useState("");
  const [error, setError] = useState("");

  const [nouvellePhase, setNouvellePhase] = useState({
    dateFin: '',
    montant: '',
    etatFacturation: 'En attente',
    etatRealisation: 'Pas commencé',
    etatPayement: 'Non payé',
    id_projet: ''
  });

  useEffect(() => {
    fetchProjets();
  }, []);

  const fetchProjets = async () => {
    try {
      const res = await axios.get('http://localhost/PHP/gestion_projet/backend/api_projets.php');
      if (Array.isArray(res.data)) setProjets(res.data);
    } catch (err) { console.error("Erreur projets:", err); }
  };

  const chargerPhases = async (id) => {
    if (!id) return;
    setIdProjetSelectionne(id);
    setError("");
    // Mise à jour de l'ID numérique pour le futur POST
    setNouvellePhase(prev => ({ ...prev, id_projet: id }));
    
    try {
      const res = await axios.get(`http://localhost/PHP/gestion_projet/backend/api_phases.php?id_projet=${id}`);
      if (Array.isArray(res.data)) setPhases(res.data);
    } catch (err) { console.error("Erreur phases:", err); }
  };

  const ajouterPhase = async (e) => {
    e.preventDefault();
    setError("");

    try {
      // On envoie l'objet qui contient maintenant le bon id_projet numérique
      await axios.post('http://localhost/PHP/gestion_projet/backend/api_phases.php', nouvellePhase);
      chargerPhases(idProjetSelectionne);
      setNouvellePhase(prev => ({ ...prev, dateFin: '', montant: '' }));
      alert("La phase a été ajoutée avec succès !");
    } catch (err) {
      // On affiche l'erreur si la base de données rejette encore (ex: violation de contrainte)
      const msg = err.response?.data?.error || "Erreur lors de l'ajout";
      setError(msg);
    }
  };

  return (
    <div className="h-full w-screen bg-slate-100">
      <div className="w-full space-y-10 animate-in fade-in duration-700 py-8 px-4">
        
        {/* SECTION SÉLECTION DE PROJET */}
        <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100">
          <div className="flex items-center gap-3 mb-6">
            <div className="h-10 w-2 bg-emerald-600 rounded-full"></div>
            <h2 className="text-2xl font-black text-slate-800 tracking-tight">Gestion des Phases</h2>
          </div>
          
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2">
              Sélectionner un Projet
            </label>
            <select 
              onChange={(e) => chargerPhases(e.target.value)} 
              value={idProjetSelectionne}
              className="w-full px-6 py-4 rounded-2xl border-2 border-slate-50 focus:border-emerald-500 focus:bg-white transition-all outline-none bg-slate-50 text-slate-700 font-semibold appearance-none cursor-pointer"
            >
              <option value="">-- Sélectionner un projet --</option>
              {projets.map(p => (
                <option key={p.id_projet} value={p.id_projet}>
                  {p.nom} (Budget: {p.montant} €)
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* SECTION AJOUT DE PHASE */}
        {idProjetSelectionne && (
          <>
            {error && (
              <div className="bg-red-50 text-red-700 p-6 rounded-2xl border border-red-100 font-medium flex items-center gap-3 shadow-sm">
                <span className="flex-shrink-0 bg-red-100 p-2 rounded-full text-lg">⚠️</span>
                <span>{error}</span>
              </div>
            )}

            <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100">
              <div className="flex items-center gap-3 mb-6">
                <div className="h-10 w-2 bg-purple-600 rounded-full"></div>
                <h2 className="text-2xl font-black text-slate-800 tracking-tight">Nouvelle Phase</h2>
              </div>
              
              <form onSubmit={ajouterPhase} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2">
                      Date d'Échéance
                    </label>
                    <input 
                      type="date" 
                      required 
                      value={nouvellePhase.dateFin} 
                      onChange={e => setNouvellePhase({...nouvellePhase, dateFin: e.target.value})}
                      className="w-full px-6 py-4 rounded-2xl border-2 border-slate-50 focus:border-purple-500 focus:bg-white transition-all outline-none bg-slate-50 text-slate-700 font-semibold"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2">
                      Montant (€)
                    </label>
                    <input 
                      type="number" 
                      placeholder="Montant" 
                      required 
                      value={nouvellePhase.montant} 
                      onChange={e => setNouvellePhase({...nouvellePhase, montant: e.target.value})}
                      className="w-full px-6 py-4 rounded-2xl border-2 border-slate-50 focus:border-purple-500 focus:bg-white transition-all outline-none bg-slate-50 text-slate-700 font-semibold"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2">
                      État de Réalisation
                    </label>
                    <select 
                      value={nouvellePhase.etatRealisation} 
                      onChange={e => setNouvellePhase({...nouvellePhase, etatRealisation: e.target.value})}
                      className="w-full px-6 py-4 rounded-2xl border-2 border-slate-50 focus:border-purple-500 focus:bg-white transition-all outline-none bg-slate-50 text-slate-700 font-semibold appearance-none cursor-pointer"
                    >
                      <option value="Pas commencé">Pas commencé</option>
                      <option value="En cours">En cours</option>
                      <option value="Terminé">Terminé</option>
                    </select>
                  </div>

                  <div className="flex items-end">
                    <button 
                      type="submit" 
                      className="w-full bg-purple-600 hover:bg-purple-700 text-white font-black py-4 rounded-2xl shadow-xl shadow-purple-100 transition-all active:scale-95 uppercase tracking-widest text-sm"
                    >
                      Ajouter
                    </button>
                  </div>
                </div>
              </form>
            </div>

            {/* SECTION TABLEAU DES PHASES */}
            <div className="bg-white p-10 rounded-[3rem] shadow-sm border border-slate-100">
              <div className="flex justify-between items-center mb-10">
                <h2 className="text-2xl font-black text-slate-800 tracking-tight">Phases du Projet</h2>
                <div className="px-4 py-2 bg-slate-50 rounded-xl text-xs font-black text-slate-400 border border-slate-100 uppercase tracking-widest">
                  {phases.length} Phase{phases.length > 1 ? 's' : ''}
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-separate border-spacing-y-3">
                  <thead>
                    <tr className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em]">
                      <th className="px-8 py-4">Échéance</th>
                      <th className="px-8 py-4">Montant</th>
                      <th className="px-8 py-4">Réalisation</th>
                      <th className="px-8 py-4">Facturation</th>
                      <th className="px-8 py-4">Paiement</th>
                    </tr>
                  </thead>
                  <tbody>
                    {phases.length > 0 ? phases.map(ph => (
                      <tr key={ph.id_phase} className="group transition-all hover:scale-[1.01]">
                        <td className="px-8 py-6 bg-slate-50 group-hover:bg-white group-hover:shadow-xl group-hover:shadow-slate-200/50 rounded-l-[1.5rem] border-y border-l border-slate-50 font-bold text-slate-700">
                          {ph.dateFin}
                        </td>
                        <td className="px-8 py-6 bg-slate-50 group-hover:bg-white group-hover:shadow-xl group-hover:shadow-slate-200/50 border-y border-slate-50">
                          <span className="text-purple-600 font-black tracking-tight">{ph.montant} €</span>
                        </td>
                        <td className="px-8 py-6 bg-slate-50 group-hover:bg-white group-hover:shadow-xl group-hover:shadow-slate-200/50 border-y border-slate-50">
                          <span className={`px-3 py-1.5 rounded-lg text-xs font-bold ${
                            ph.etatRealisation === 'Terminé' ? 'bg-green-100 text-green-700' :
                            ph.etatRealisation === 'En cours' ? 'bg-yellow-100 text-yellow-700' :
                            'bg-slate-100 text-slate-500'
                          }`}>
                            {ph.etatRealisation}
                          </span>
                        </td>
                        <td className="px-8 py-6 bg-slate-50 group-hover:bg-white group-hover:shadow-xl group-hover:shadow-slate-200/50 border-y border-slate-50">
                          <span className={`px-3 py-1.5 rounded-lg text-xs font-bold ${
                            ph.etatFacturation === 'Facturé' ? 'bg-blue-100 text-blue-700' :
                            ph.etatFacturation === 'En cours' ? 'bg-orange-100 text-orange-700' :
                            'bg-slate-100 text-slate-500'
                          }`}>
                            {ph.etatFacturation}
                          </span>
                        </td>
                        <td className="px-8 py-6 bg-slate-50 group-hover:bg-white group-hover:shadow-xl group-hover:shadow-slate-200/50 rounded-r-[1.5rem] border-y border-r border-slate-50">
                          <span className={`px-3 py-1.5 rounded-lg text-xs font-bold ${
                            ph.etatPayement === 'Payé' ? 'bg-emerald-100 text-emerald-700' :
                            ph.etatPayement === 'Partiel' ? 'bg-amber-100 text-amber-700' :
                            'bg-slate-100 text-slate-500'
                          }`}>
                            {ph.etatPayement}
                          </span>
                        </td>
                      </tr>
                    )) : (
                      <tr>
                        <td colSpan="5" className="px-8 py-20 text-center text-slate-300 font-bold italic border-2 border-dashed border-slate-50 rounded-[2rem]">
                          Aucune phase enregistrée pour ce projet.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default Phases;