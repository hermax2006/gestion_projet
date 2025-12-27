import Organismes from './Organismes';

function App() {
  return (
    <div className="App">
      <header style={{ backgroundColor: '#282c34', padding: '10px', color: 'white', textAlign: 'center' }}>
        <h1>Système de Gestion de Projets</h1>
      </header>
      <main>
        {/* On affiche ici l'interface de la secrétaire */}
        <Organismes />
      </main>
    </div>
  );
}

export default App;