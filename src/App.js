import React, { useEffect, useState } from 'react';
import logo from './logo.svg';
import './App.css';

function App() {
  const [data, setData] = useState({
    'name_gurmukhi': null,
  });

  useEffect(() => {
    window.api.getScripture().then((data) => {
        setData(data);
    });
  }, []);

  return (
    <div className="App">
      { data.name_gurmukhi }
    </div>
  );
}

export default App;
