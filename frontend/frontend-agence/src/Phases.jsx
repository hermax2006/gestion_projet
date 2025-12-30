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
      setProjets(res.data);
    } catch (err) { console.error("Erreur projets:", err); }
  };

  const chargerPhases = async (id) => {
    setIdProjetSelectionne(id);
    setError("");
    setNouvellePhase(prev => ({ ...prev, id_projet: id }));
    try {
      const res = await axios.get(`http://localhost/PHP/gestion_projet/backend/api_phases.php?id_projet=${id}`);
      setPhases(res.data);
    } catch (err) { console.error("Erreur phases:", err); }
  };

  const ajouterPhase = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await axios.post('http://localhost/PHP/gestion_projet/backend/api_phases.php', nouvellePhase);
      chargerPhases(idProjetSelectionne);
      setNouvellePhase({ ...nouvellePhase, dateFin: '', montant: '' });
    } catch (err) {
      const msg = err.response?.data?.error || "Erreur lors de l'ajout";
      setError(msg);
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '900px', margin: '0 auto' }}>
      <h2>Gestion des Phases</h2>

      {/* Sélection du Projet */}
      <div style={{ marginBottom: '20px' }}>
        <select onChange={(e) => chargerPhases(e.target.value)} value={idProjetSelectionne}>
          <option value="">-- Sélectionner un projet --</option>
          {projets.map(p => <option key={p.id_proj} value={p.id_proj}>{p.nom}</option>)}
        </select>
      </div>

      {idProjetSelectionne && (
        <>
          {error && <div style={{ color: 'white', background: '#e74c3c', padding: '10px', borderRadius: '4px' }}>{error}</div>}

          {/* Formulaire */}
          <form onSubmit={ajouterPhase} style={{ margin: '20px 0', padding: '15px', border: '1px solid #ddd' }}>
            <input type="date" required value={nouvellePhase.dateFin} onChange={e => setNouvellePhase({...nouvellePhase, dateFin: e.target.value})} />
            <input type="number" placeholder="Montant" required value={nouvellePhase.montant} onChange={e => setNouvellePhase({...nouvellePhase, montant: e.target.value})} />
            <select value={nouvellePhase.etatRealisation} onChange={e => setNouvellePhase({...nouvellePhase, etatRealisation: e.target.value})}>
              <option value="Pas commencé">Pas commencé</option>
              <option value="En cours">En cours</option>
              <option value="Terminé">Terminé</option>
            </select>
            <button type="submit">Ajouter la phase</button>
          </form>

          {/* Liste des phases */}
          <table border="1" width="100%" style={{ borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ background: '#f4f4f4' }}>
                <th>Échéance</th>
                <th>Montant</th>
                <th>Réalisation</th>
                <th>Facturation</th>
              </tr>
            </thead>
            <tbody>
              {phases.map(ph => (
                <tr key={ph.id_phase}>
                  <td>{ph.dateFin}</td>
                  <td>{ph.montant} €</td>
                  <td>{ph.etatRealisation}</td>
                  <td>{ph.etatFacturation}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}
    </div>
  );
}

export default Phases;