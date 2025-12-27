import { useState, useEffect } from 'react';
import axios from 'axios';

function Organismes() {
  const [organismes, setOrganismes] = useState([]);
  const [projets, setProjets] = useState([]);
  const [nouveauNom, setNouveauNom] = useState("");
  
  // MISE À JOUR : On utilise les vrais noms de ta base SQL
  const [nouveauProjet, setNouveauProjet] = useState({ 
    nom: '', 
    montant: '', 
    date_debut: '', 
    id_organisme: '' 
  });

  useEffect(() => {
    fetchOrganismes();
    fetchProjets();
  }, []);

  const fetchOrganismes = async () => {
    try {
      const res = await axios.get('http://localhost/PHP/gestion_projet/backend/api_organismes.php');
      if (Array.isArray(res.data)) setOrganismes(res.data);
    } catch (err) { console.error("Erreur organismes:", err); }
  };

  const fetchProjets = async () => {
    try {
      const res = await axios.get('http://localhost/PHP/gestion_projet/backend/api_projets.php');
      if (Array.isArray(res.data)) setProjets(res.data);
    } catch (err) { console.error("Erreur projets:", err); }
  };

  const ajouterOrg = async (e) => {
    e.preventDefault();
    if (!nouveauNom) return;
    try {
      await axios.post('http://localhost/PHP/gestion_projet/backend/api_organismes.php', {
        nom: nouveauNom,
        codeOrg: "ORG-" + Math.floor(Math.random() * 1000)
      });
      setNouveauNom("");
      fetchOrganismes();
    } catch (err) { console.error(err); }
  };

  const ajouterProjet = async (e) => {
    e.preventDefault();
    try {
      // On envoie l'objet avec les bons noms au PHP
      await axios.post('http://localhost/PHP/gestion_projet/backend/api_projets.php', nouveauProjet);
      setNouveauProjet({ nom: '', montant: '', date_debut: '', id_organisme: '' }); 
      fetchProjets();
    } catch (err) { console.error(err); }
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial' }}>
      <h1>Tableau de bord Secrétaire</h1>

      <section style={{ marginBottom: '40px', borderBottom: '2px solid #eee', paddingBottom: '20px' }}>
        <h2>1. Gestion des Organismes</h2>
        <form onSubmit={ajouterOrg}>
          <input 
            type="text" placeholder="Nom de l'organisme" value={nouveauNom}
            onChange={(e) => setNouveauNom(e.target.value)} 
            style={{ padding: '8px', marginRight: '10px' }}
          />
          <button type="submit">Ajouter l'organisme</button>
        </form>
        <ul>
          {organismes.map((org) => (
            <li key={org.id_org}><strong>{org.nom}</strong> (ID: {org.id_org})</li>
          ))}
        </ul>
      </section>

      <section>
        <h2>2. Création de Projets</h2>
        <form onSubmit={ajouterProjet} style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxWidth: '400px' }}>
          <input type="text" placeholder="Nom du projet" value={nouveauProjet.nom}
            onChange={(e) => setNouveauProjet({...nouveauProjet, nom: e.target.value})} />
          
          <input type="number" placeholder="Montant (Double)" value={nouveauProjet.montant}
            onChange={(e) => setNouveauProjet({...nouveauProjet, montant: e.target.value})} />
          
          <input type="date" value={nouveauProjet.date_debut}
            onChange={(e) => setNouveauProjet({...nouveauProjet, date_debut: e.target.value})} />
          
          <select value={nouveauProjet.id_organisme} onChange={(e) => setNouveauProjet({...nouveauProjet, id_organisme: e.target.value})}>
            <option value="">-- Choisir le client (Organisme) --</option>
            {organismes.map(org => (
              <option key={org.id_org} value={org.id_org}>{org.nom}</option>
            ))}
          </select>
          
          <button type="submit" style={{ backgroundColor: '#28a745', color: 'white', padding: '10px', cursor: 'pointer' }}>
            Créer le projet lié au client
          </button>
        </form>

        <h3>Liste des Projets en cours</h3>
        <table border="1" cellPadding="10" style={{ width: '100%', borderCollapse: 'collapse', marginTop: '10px' }}>
          <thead>
            <tr style={{ backgroundColor: '#f4f4f4' }}>
              <th>Nom</th>
              <th>Montant</th>
              <th>Date Début</th>
              <th>Client (Organisme)</th>
            </tr>
          </thead>
          <tbody>
            {projets.length > 0 ? projets.map(proj => (
              <tr key={proj.id_proj}>
                <td>{proj.nom}</td>
                <td>{proj.montant} €</td>
                <td>{proj.date_debut}</td>
                <td>{proj.organisme_nom}</td>
              </tr>
            )) : (
              <tr><td colSpan="4" style={{textAlign: 'center'}}>Aucun projet trouvé</td></tr>
            )}
          </tbody>
        </table>
      </section>
    </div>
  );
}

export default Organismes;