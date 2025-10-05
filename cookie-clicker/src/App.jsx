import { useState } from 'react';
import './App.css';

function App() {
  const [cookies, setCookies] = useState(0);
  const [items, setItems] = useState({
    tree: { level: 1, baseCost: 5, increment: 2, count: 0 },      
    pets: { level: 1, baseCost: 10, increment: 5, count: 0},
    pill: { level: 1, baseCost: 15, increment: 7, count: 0 },
    school: { level: 1, baseCost: 20, increment: 10, count: 0 },
    music: { level: 1, baseCost: 25, increment: 12, count: 0 },  
  });
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  const handleClick = () => {
    setCookies(cookies + 1); 
  };

  const buyUpgrade = (itemName) => {
    const item = items[itemName];
    if (cookies >= item.baseCost) {
      setCookies(cookies - item.baseCost);
      setItems({
        ...items,
        [itemName]: {
          ...item,
          count: item.count +1,
          baseCost: item.baseCost + item.increment, 
        },
      });
      setSnackbarOpen(true);
      setTimeout(() => setSnackbarOpen(false), 3000);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '50px', alignItems: 'center', marginTop: '20px', marginLeft: '110px'}}>
      <div className="donation_bar" style={{ display: 'flex', gap: '50px' }}>
        {Object.entries(items).map(([name, item]) => (
          <div key={name} className="tree" style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}>
            <div style={{ position: 'absolute', top: '5px', left: '5px', padding: '2px 5px', borderRadius: '5px', fontSize: '20px', color: 'black' }}>
              {item.count}
            </div>
            <img
              src={`/${name}.png`}
              alt={name}
              width="80"
              style={{ borderRadius: '50%' }}
            />
            <button
              className="upgrade-button"
              onClick={() => buyUpgrade(name)}
              disabled={cookies < item.baseCost}
            >
              Donate (Cost: $ {item.baseCost})
            </button>
          </div>
        ))}
      </div>

      <div className="container" style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <h1>Charity clicker</h1>

        <button className="cookie-button" onClick={handleClick}>
          <img
            src="/planet-earth.png"
            alt="earth"
            width="200"
            style={{ borderRadius: '50%' }}
          />
        </button>

        <h2>Donation $: {cookies}</h2>

        {snackbarOpen && <div className="snackbar">Upgrade Purchased!</div>}
      </div>
      <div className="landscape" style={{ display:'flex', marginRight: '-300px', marginBottom: '-500px' }}>
        <div style={{ width: '1100px', height: '420px', backgroundColor: '#D3C09D' }}></div>
      </div>
    </div>
  );
}

export default App;
