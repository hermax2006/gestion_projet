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
    <div style={{ padding: '20px', maxWidth: '900px', margin: '0 auto', color: 'white' }}>
      <h2>Gestion des Phases</h2>

      <div style={{ marginBottom: '20px' }}>
        <label>Choisir un projet :</label>
        <select 
            onChange={(e) => chargerPhases(e.target.value)} 
            value={idProjetSelectionne}
            style={{ width: '100%', padding: '10px', marginTop: '10px', background: '#333', color: 'white' }}
        >
          <option value="">-- Sélectionner un projet --</option>
          {projets.map(p => (
            /* FIX CRITIQUE : la value doit être l'ID (le chiffre), pas le texte ! */
            <option key={p.id_projet} value={p.id_projet}>
                {p.nom} (Budget: {p.montant} €)
            </option>
          ))}
        </select>
      </div>

      {idProjetSelectionne && (
        <>
          {error && (
            <div style={{ background: '#e74c3c', padding: '15px', borderRadius: '4px', marginBottom: '15px' }}>
                {error}
            </div>
          )}

          <form onSubmit={ajouterPhase} style={{ border: '1px solid #444', padding: '20px', marginBottom: '20px' }}>
            <div style={{ display: 'flex', gap: '10px' }}>
                <input 
                    type="date" required 
                    value={nouvellePhase.dateFin} 
                    onChange={e => setNouvellePhase({...nouvellePhase, dateFin: e.target.value})} 
                />
                <input 
                    type="number" placeholder="Montant" required 
                    value={nouvellePhase.montant} 
                    onChange={e => setNouvellePhase({...nouvellePhase, montant: e.target.value})} 
                />
                <select 
                    value={nouvellePhase.etatRealisation} 
                    onChange={e => setNouvellePhase({...nouvellePhase, etatRealisation: e.target.value})}
                >
                    <option value="Pas commencé">Pas commencé</option>
                    <option value="En cours">En cours</option>
                    <option value="Terminé">Terminé</option>
                </select>
                <button type="submit" style={{ background: '#27ae60', color: 'white', padding: '10px', cursor: 'pointer', border: 'none', borderRadius: '4px' }}>
                    AJOUTER LA PHASE
                </button>
            </div>
          </form>

          <table width="100%" border="1" style={{ borderCollapse: 'collapse', borderColor: '#444' }}>
            <thead>
              <tr style={{ background: '#2c3e50' }}>
                <th style={{ padding: '10px' }}>Échéance</th>
                <th style={{ padding: '10px' }}>Montant</th>
                <th style={{ padding: '10px' }}>Réalisation</th>
                <th style={{ padding: '10px' }}>Facturation</th>
              </tr>
            </thead>
            <tbody>
              {phases.length > 0 ? phases.map(ph => (
                <tr key={ph.id_phase}>
                  <td style={{ padding: '10px', textAlign: 'center' }}>{ph.dateFin}</td>
                  <td style={{ padding: '10px', textAlign: 'center' }}>{ph.montant} €</td>
                  <td style={{ padding: '10px', textAlign: 'center' }}>{ph.etatRealisation}</td>
                  <td style={{ padding: '10px', textAlign: 'center' }}>{ph.etatFacturation}</td>
                </tr>
              )) : (
                <tr><td colSpan="4" style={{ padding: '20px', textAlign: 'center' }}>Aucune phase enregistrée pour ce projet.</td></tr>
              )}
            </tbody>
          </table>
        </>
      )}
    </div>
  );
}

export default Phases;