import { useState } from 'react';
import './App.css';

function App() {
  const ACCESS_KEY = import.meta.env.VITE_APP_ACCESS_KEY;
  const [artData, setArtData] = useState(null);
  const [banList, setBanList] = useState([]);
  const [warning, setWarning] = useState('');

  const isBanned = (record) => {
    const attributes = [record.title, record.dated, record.objectnumber];
    return attributes.some(attr => banList.includes(attr));
  };

  const fetchRandomArt = async () => {
    setWarning('');
    for (let i = 0; i < 10; i++) {
      const url = `https://api.harvardartmuseums.org/object?apikey=${ACCESS_KEY}&sort=random&size=1&hasimage=1&fields=objectnumber,title,dated,primaryimageurl,people`;
      try {
        const response = await fetch(url);
        const data = await response.json();
        if (data.records && data.records.length > 0) {
          const record = data.records[0];
          if (!isBanned(record)) {
            setArtData(record);
            return;
          }
        }
      } catch (error) {
        console.error("Error fetching art data:", error);
      }
    }
    setArtData(null);
    setWarning('No valid record found after several attempts.');
  };

  const toggleBan = (value) => {
    if (!value) return;
    setBanList(prev =>
      prev.includes(value)
        ? prev.filter(item => item !== value)  // Remove if exists
        : [...prev, value]                     // Add if not present
    );
  };

  return (
    <div className="wrapper">
      {/* Main Content Area */}
      <div className="main-content">
        <div className="center-box">
          <h1>Veni Vici!</h1>
          <p>Discover art from your wildest dreams!</p>
          <button onClick={fetchRandomArt}>Discover</button>

          {warning && <p className="warning">{warning}</p>}

          {artData && (
            <div className="art-container">
              {artData.primaryimageurl && (
                <img 
                  src={artData.primaryimageurl} 
                  alt={artData.title} 
                  className="art-image"
                />
              )}
              <div className="art-attributes">
                <p onClick={() => toggleBan(artData.title)}>
                  <strong>Title:</strong> {artData.title}
                </p>
                <p onClick={() => toggleBan(artData.dated)}>
                  <strong>Date:</strong> {artData.dated}
                </p>
                <p onClick={() => toggleBan(artData.objectnumber)}>
                  <strong>Object Number:</strong> {artData.objectnumber}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Ban List Sidebar */}
      <div className="ban-list-container">
        <h2>Ban List</h2>
        {banList.length === 0 ? (
          <p>Select an attribute to ban it.</p>
        ) : (
          <ul>
            {banList.map((item, index) => (
              <li key={index} onClick={() => toggleBan(item)}>
                {item}
              </li>
            ))}
          </ul>
        )}
        <p className="ban-list-instructions">
          Click a banned item to remove it from the list.
        </p>
      </div>
    </div>
  );
}

export default App;
