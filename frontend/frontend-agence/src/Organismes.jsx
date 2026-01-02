import React, { useState, useEffect } from 'react';
import axios from 'axios';

/**
 * COMPOSANT : Organismes.jsx
 * Ce composant gère la création des organismes et des projets associés.
 * Il est destiné à être exporté et utilisé dans App.jsx.
 */
function Organismes() {
  const [organismes, setOrganismes] = useState([]);
  const [projets, setProjets] = useState([]);
  const [nouveauNom, setNouveauNom] = useState("");
  
  // État pour le formulaire de nouveau projet (noms de colonnes SQL)
  const [nouveauProjet, setNouveauProjet] = useState({ 
    nom: '', 
    montant: '', 
    date_debut: '', 
    id_organisme: '' 
  });

  // Chargement initial des données
  useEffect(() => {
    fetchOrganismes();
    fetchProjets();
  }, []);

  // Récupération des organismes depuis le backend PHP
  const fetchOrganismes = async () => {
    try {
      const res = await axios.get('http://localhost/PHP/gestion_projet/backend/api_organismes.php');
      if (Array.isArray(res.data)) setOrganismes(res.data);
    } catch (err) { 
      console.error("Erreur lors de la récupération des organismes:", err); 
    }
  };

  // Récupération des projets depuis le backend PHP
  const fetchProjets = async () => {
    try {
      const res = await axios.get('http://localhost/PHP/gestion_projet/backend/api_projets.php');
      if (Array.isArray(res.data)) setProjets(res.data);
    } catch (err) { 
      console.error("Erreur lors de la récupération des projets:", err); 
    }
  };

  // Action : Ajouter un organisme
  const ajouterOrg = async (e) => {
    e.preventDefault();
    if (!nouveauNom) return;
    try {
      await axios.post('http://localhost/PHP/gestion_projet/backend/api_organismes.php', {
        nom: nouveauNom,
        codeOrg: "ORG-" + Math.floor(Math.random() * 1000)
      });
      setNouveauNom("");
      fetchOrganismes(); // Actualiser la liste
    } catch (err) { 
      console.error("Erreur ajout organisme:", err); 
    }
  };

  // Action : Ajouter un projet lié à un organisme
  const ajouterProjet = async (e) => {
    e.preventDefault();
    if (!nouveauProjet.id_organisme) {
      alert("Veuillez sélectionner un organisme client.");
      return;
    }
    try {
      await axios.post('http://localhost/PHP/gestion_projet/backend/api_projets.php', nouveauProjet);
      setNouveauProjet({ nom: '', montant: '', date_debut: '', id_organisme: '' }); 
      fetchProjets(); // Actualiser la liste
    } catch (err) { 
      console.error("Erreur ajout projet:", err); 
    }
  };

  return (
    <div className="h-full w-full bg-slate-100">
      <div className="w-full space-y-10 animate-in fade-in duration-700 py-8 px-8">
        
        {/* SECTION HAUTE : FORMULAIRES DE SAISIE */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
          
          {/* Carte 1 : Ajouter un Organisme */}
          <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="h-10 w-2 bg-blue-600 rounded-full"></div>
                <h2 className="text-2xl font-black text-slate-800 tracking-tight">Organismes</h2>
              </div>
              <p className="text-slate-500 mb-8 font-medium">Enregistrez un nouvel organisme partenaire ou client.</p>
              
              <form onSubmit={ajouterOrg} className="space-y-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2">Nom Officiel</label>
                  <input 
                    type="text" 
                    placeholder="Ex: Ministère de l'Énergie" 
                    className="w-full px-6 py-4 rounded-2xl border-2 border-slate-50 focus:border-blue-500 focus:bg-white transition-all outline-none bg-slate-50 text-slate-700 font-semibold"
                    value={nouveauNom}
                    onChange={(e) => setNouveauNom(e.target.value)} 
                  />
                </div>
                <button type="submit" className="w-full bg-slate-900 hover:bg-black text-white font-bold py-4 rounded-2xl transition-all shadow-xl shadow-slate-200 active:scale-95">
                  Valider l'organisme
                </button>
              </form>
            </div>

            {/* Mini Liste Scrollable des derniers ajouts */}
            <div className="mt-8 pt-6 border-t border-slate-50">
              <h3 className="text-[10px] font-black text-slate-300 uppercase tracking-widest mb-4">Derniers ajouts</h3>
              <div className="flex flex-wrap gap-2">
                {organismes.slice(-5).map(org => (
                  <span key={org.id_org} className="px-3 py-1.5 bg-slate-50 rounded-lg text-xs font-bold text-slate-500 border border-slate-100 italic">
                    {org.nom}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Carte 2 : Créer un Projet */}
          <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100">
            <div className="flex items-center gap-3 mb-6">
              <div className="h-10 w-2 bg-indigo-600 rounded-full"></div>
              <h2 className="text-2xl font-black text-slate-800 tracking-tight">Nouveau Projet</h2>
            </div>
            
            <form onSubmit={ajouterProjet} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2 space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2">Titre du Projet</label>
                  <input type="text" placeholder="Nom du projet" className="w-full px-6 py-4 rounded-2xl border-2 border-slate-50 focus:border-indigo-500 focus:bg-white transition-all outline-none bg-slate-50 text-slate-700 font-semibold"
                    value={nouveauProjet.nom} onChange={(e) => setNouveauProjet({...nouveauProjet, nom: e.target.value})} />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2">Budget (€)</label>
                  <input type="number" placeholder="Montant" className="w-full px-6 py-4 rounded-2xl border-2 border-slate-50 focus:border-indigo-500 focus:bg-white transition-all outline-none bg-slate-50 text-slate-700 font-semibold"
                    value={nouveauProjet.montant} onChange={(e) => setNouveauProjet({...nouveauProjet, montant: e.target.value})} />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2">Date Début</label>
                  <input type="date" className="w-full px-6 py-4 rounded-2xl border-2 border-slate-50 focus:border-indigo-500 focus:bg-white transition-all outline-none bg-slate-50 text-slate-700 font-semibold"
                    value={nouveauProjet.date_debut} onChange={(e) => setNouveauProjet({...nouveauProjet, date_debut: e.target.value})} />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2">Assigner à l'Organisme</label>
                <select className="w-full px-6 py-4 rounded-2xl border-2 border-slate-50 focus:border-indigo-500 focus:bg-white transition-all outline-none bg-slate-50 text-slate-700 font-semibold appearance-none cursor-pointer"
                  value={nouveauProjet.id_organisme} onChange={(e) => setNouveauProjet({...nouveauProjet, id_organisme: e.target.value})}>
                  <option value="">-- Sélectionner le Client --</option>
                  {organismes.map(org => (
                    <option key={org.id_org} value={org.id_org}>{org.nom}</option>
                  ))}
                </select>
              </div>

              <button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-black py-4 rounded-2xl shadow-xl shadow-indigo-100 transition-all active:scale-95 uppercase tracking-widest text-sm pt-5">
                Initialiser le dossier
              </button>
            </form>
          </div>
        </div>

        {/* SECTION BASSE : LISTE DES PROJETS */}
        <div className="bg-white p-10 rounded-[3rem] shadow-sm border border-slate-100">
          <div className="flex justify-between items-center mb-10">
            <h2 className="text-2xl font-black text-slate-800 tracking-tight">Portefeuille de Projets</h2>
            <div className="px-4 py-2 bg-slate-50 rounded-xl text-xs font-black text-slate-400 border border-slate-100 uppercase tracking-widest">
              {projets.length} Projets Actifs
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-separate border-spacing-y-3">
              <thead>
                <tr className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em]">
                  <th className="px-8 py-4">Nom du Projet</th>
                  <th className="px-8 py-4">Client</th>
                  <th className="px-8 py-4">Budget Global</th>
                  <th className="px-8 py-4">Date de début</th>
                </tr>
              </thead>
              <tbody>
                {projets.length > 0 ? projets.map(proj => (
                  <tr key={proj.id_proj} className="group transition-all hover:scale-[1.01]">
                    <td className="px-8 py-6 bg-slate-50 group-hover:bg-white group-hover:shadow-xl group-hover:shadow-slate-200/50 rounded-l-[1.5rem] border-y border-l border-slate-50 font-bold text-slate-700">
                      {proj.nom}
                    </td>
                    <td className="px-8 py-6 bg-slate-50 group-hover:bg-white group-hover:shadow-xl group-hover:shadow-slate-200/50 border-y border-slate-50 text-slate-500 font-medium">
                      {proj.organisme_nom}
                    </td>
                    <td className="px-8 py-6 bg-slate-50 group-hover:bg-white group-hover:shadow-xl group-hover:shadow-slate-200/50 border-y border-slate-50">
                      <span className="text-blue-600 font-black tracking-tight">{proj.montant} €</span>
                    </td>
                    <td className="px-8 py-6 bg-slate-50 group-hover:bg-white group-hover:shadow-xl group-hover:shadow-slate-200/50 rounded-r-[1.5rem] border-y border-r border-slate-50 text-slate-400 font-bold text-sm">
                      {proj.date_debut}
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan="4" className="px-8 py-20 text-center text-slate-300 font-bold italic border-2 border-dashed border-slate-50 rounded-[2rem]">
                      Aucune donnée n'a été récupérée de la base de données.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Organismes;
