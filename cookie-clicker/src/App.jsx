import { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [cookies, setCookies] = useState(0);
  const [items, setItems] = useState({
    tree: { level: 1, baseCost: 5, increment: 2, count: 0, durability: 100 },
    pets: { level: 1, baseCost: 10, increment: 5, count: 0, durability: 100 },
    pill: { level: 1, baseCost: 15, increment: 7, count: 0, durability: 100 },
    school: { levmyel: 1, baseCost: 20, increment: 10, count: 0, durability: 100 },
    music: { level: 1, baseCost: 25, increment: 12, count: 0, durability: 100 },
  });
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [placedIcons, setPlacedIcons] = useState([]);
  const [categories, setCategories] = useState({
    Environment: 100,
    "Animal Welfare": 100,
    Health: 100,
    Education: 100,
    Culture: 100,
  });
  const [hearts, setHearts] = useState([]);
  const [draggingItem, setDraggingItem] = useState(null);
  const [people, setPeople] = useState(
    Array.from({ length: 10 }, () => ({
      id: Date.now() + Math.random(),
      x: Math.random() * 1000, // within landscape width
      y: Math.random() * 400,  // within landscape height
      direction: Math.random() < 0.5 ? 1 : -1, // left or right
    }))
  );
  const placedImageMap = {
    tree: "/tree(1).png",
    pets: "/dog.png",
    pill: "/hospital.png", // show a different image when placed
    school: "/education.png",
  };

  useEffect(() => {
    const containerWidth = 1100;
    const containerHeight = 420;
    const personSize = 48; // approximate height/width of stick person
  
    const interval = setInterval(() => {
      setPeople((prev) =>
        prev.map((p) => {
          let newX = p.x + p.direction * 1;
          let newY = p.y + (p.directionY || 1) * 0.5; // vertical speed slower than horizontal
          let newDirectionX = p.direction;
          let newDirectionY = p.directionY || 1;
  
          // Bounce horizontally
          if (newX <= 0) {
            newX = 0;
            newDirectionX = 1;
          } else if (newX >= containerWidth - personSize) {
            newX = containerWidth - personSize;
            newDirectionX = -1;
          }
  
          // Bounce vertically
          if (newY <= 0) {
            newY = 0;
            newDirectionY = 1;
          } else if (newY >= containerHeight - personSize) {
            newY = containerHeight - personSize;
            newDirectionY = -1;
          }
  
          return { ...p, x: newX, y: newY, direction: newDirectionX, directionY: newDirectionY };
        })
      );
    }, 100);
  
    return () => clearInterval(interval);
  }, []);
  
  
  
  
  // Click to earn cookies
  const handleClick = () => {
    setCookies(cookies + 1);
  
    const id = Date.now(); // unique id for each heart
    setHearts((prev) => [
      ...prev,
      { id, x: Math.random() * 50 - 25, y: 0 } // random horizontal offset
    ]);
  
    // Remove the heart after 1 second
    setTimeout(() => {
      setHearts((prev) => prev.filter((heart) => heart.id !== id));
    }, 1000);
  };
  

  const buyUpgrade = (itemName) => {
    const itemCategoryMap = {
      tree: "Environment",
      pets: "Animal Welfare",
      pill: "Health",
      school: "Education",
      music: "Culture",
    };
    const item = items[itemName];
    if (cookies >= item.baseCost) {
      setCookies(cookies - item.baseCost);
      setItems({
        ...items,
        [itemName]: {
          ...item,
          count: item.count + 1,
          baseCost: item.baseCost + item.increment,
          durability: 100,
        },
      });
      // Increase related category
      setCategories((prev) => {
        const category = itemCategoryMap[itemName];
        const newValue = Math.min((prev[category] || 0) + 10, 100);
        return { ...prev, [category]: newValue };
      });
  
      setSnackbarOpen(true);
      setTimeout(() => setSnackbarOpen(false), 3000);
    }
  };
  

  // Deplete categories over time
useEffect(() => {
  const interval = setInterval(() => {
    setCategories((prev) => {
      const newCategories = {};
      for (let key in prev) {
        newCategories[key] = Math.max(prev[key] - 1, 0); // decrease 1% per second
      }
      return newCategories;
    });
  }, 1000);

  return () => clearInterval(interval);
}, []);


  // Place icon on background
  const handleBackgroundClick = (e) => {
    const iconName = e.target.dataset.iconName;
    if (iconName && items[iconName] && items[iconName].count > 0) {
      const rect = e.target.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      setItems((prev) => ({
        ...prev,
        [iconName]: {
          ...prev[iconName],
          count: prev[iconName].count - 1,
        },
      }));

      setPlacedIcons((prev) => [
        ...prev,
        {
          x,
          y,
          name: iconName,
          image: placedImageMap[iconName] || `/${iconName}.png`,
        },
      ]);
      
    }
  };

  // Decrease durability over time
  useEffect(() => {
    const interval = setInterval(() => {
      setItems((prev) => {
        const newItems = {};
        for (let key in prev) {
          const item = prev[key];
          const newDurability = item.count > 0 ? Math.max(item.durability - 1, 0) : 0;
          newItems[key] = { ...item, durability: newDurability };
        }
        return newItems;
      });
    }, 1000); // decrease every 1 second

    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '50px', alignItems: 'center', marginTop: '20px', marginLeft: '300px' }}>
      {/* Top donation bar */}
      <div className="donation_bar" style={{ display: 'flex', gap: '50px' }}>
        {Object.entries(items).map(([name, item]) => (
          <div key={name} className="tree" style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}>
            
            {/* Progress bar */}
            {item.count > 0 && (
              <div style={{ width: '80px', height: '5px', backgroundColor: '#ccc', borderRadius: '2px', overflow: 'hidden', marginBottom: '5px' }}>
                <div
                  style={{
                    width: `${item.durability}%`,
                    height: '100%',
                    backgroundColor: item.durability > 50 ? 'green' : item.durability > 20 ? 'orange' : 'red',
                    transition: 'width 5.0s linear',
                  }}
                ></div>
              </div>
            )}

            {/* Count label */}
            <div style={{ position: 'absolute', top: '5px', left: '5px', padding: '2px 5px', borderRadius: '5px', fontSize: '20px', color: 'black' }}>
              {item.count}
            </div>

            {/* Icon */}
            <img
              src={`/${name}.png`}
              alt={name}
              width="80"
              style={{ borderRadius: '50%' }}
              data-icon-name={name}
              onClick={(e) => {
                e.stopPropagation();
                handleBackgroundClick(e);
              }}
            />

            {/* Donate button */}
            <button className="upgrade-button" onClick={() => buyUpgrade(name)} disabled={cookies < item.baseCost}>
              Donate (Cost: ${item.baseCost})
            </button>
          </div>
        ))}
      </div>
      {/* Welfare / category progress bars */}
      <div className="category-bars" style={{ display: 'flex', gap: '30px', marginTop: '-200px' }}>
  {Object.entries(categories).map(([category, value]) => (
    <div key={category} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '5px' }}>
      <span style={{ fontWeight: 'bold', fontSize: '14px' }}>{category}</span>
      <div style={{ width: '80px', height: '10px', backgroundColor: '#ccc', borderRadius: '5px', overflow: 'hidden' }}>
        <div
          style={{
            width: `${value}%`,
            height: '100%',
            backgroundColor: value > 50 ? '#4caf50' : value > 20 ? '#ff9800' : '#f44336',
            transition: 'width 0.5s ease',
          }}
        ></div>
      </div>
    </div>
  ))}
</div>
      {/* Main game area */}
      <div className="container" style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginLeft: '50px' }}>
        <h1>Charity clicker</h1>
        <button className="cookie-button" onClick={handleClick}>
        <div style={{ position: 'relative', display: 'inline-block' }}>
  <img
    src="/planet-earth.png"
    alt="earth"
    width="200"
    style={{ borderRadius: '50%' }}
  />
  {hearts.map((heart) => (
    <div
      key={heart.id}
      style={{
        position: 'absolute',
        left: `calc(50% + ${heart.x}px)`,
        top: `${heart.y}px`,
        fontSize: '24px',
        color: 'red',
        animation: 'rise 1s forwards',
        pointerEvents: 'none',
      }}
    >
      ❤️
    </div>
  ))}
</div>

        </button>
        <h2>Donation $: {cookies}</h2>
        {snackbarOpen && <div className="snackbar">Upgrade Purchased!</div>}
      </div>

      <div
  className="landscape"
  style={{ display: 'flex', marginRight: '0px', marginBottom: '-500px', position: 'relative' }}
  onClick={handleBackgroundClick}
>
  <div style={{ width: '1100px', height: '420px', backgroundColor: '#D3C09D', position: 'relative' }}>
    {/* Place items here */}
    {placedIcons.map((icon, index) => (
      <img
        key={index}
        src={icon.image} // use the new image if defined
        alt={icon.name}
        width="50"
        style={{ position: 'absolute', left: `${icon.x}px`, top: `${icon.y}px` }}
      />
))}


    {people.map((p) => (
      <div
        key={p.id}
        style={{
          position: 'absolute',
          left: `${p.x}px`,
          top: `${p.y}px`,
          fontSize: '50px',
          pointerEvents: 'none', // so they don’t block dragging
        }}
      >
        🧍‍♂️
      </div>
    ))}
  </div>
</div>

    </div>
  );
}

export default App;
