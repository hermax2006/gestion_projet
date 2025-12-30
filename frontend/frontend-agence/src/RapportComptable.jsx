import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

const RapportComptable = ({ stats }) => {
  const genererPDF = () => {
    const doc = new jsPDF();
    
    doc.setFontSize(18);
    doc.text("RAPPORT FINANCIER DES PROJETS", 14, 22);

    const rows = stats.map(p => [
      p.nom, 
      `${Number(p.budget_total).toLocaleString()} €`, 
      `${Number(p.budget_consomme || 0).toLocaleString()} €`,
      `${p.budget_total > 0 ? ((p.budget_consomme || 0) / p.budget_total * 100).toFixed(1) : 0}%`
    ]);

    autoTable(doc, {
      head: [['Projet', 'Budget Total', 'Consommé', 'Utilisation']],
      body: rows,
      startY: 30,
      theme: 'grid',
      headStyles: { fillColor: [231, 76, 60] } 
    });

    doc.save("rapport_financier.pdf");
  };

  const btnPdfStyle = { 
    backgroundColor: '#e74c3c', 
    color: 'white', 
    padding: '10px', 
    border: 'none', 
    borderRadius: '4px', 
    cursor: 'pointer',
    fontWeight: 'bold'
  };

  return (
    <button onClick={genererPDF} style={btnPdfStyle}>
      📥 Télécharger le Rapport PDF
    </button>
  );
};

export default RapportComptable;