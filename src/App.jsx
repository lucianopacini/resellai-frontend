import { useState } from "react";

function App() {
  const [categoria, setCategoria] = useState("");
  const [brand, setBrand] = useState("");
  const [stato, setStato] = useState("");
  const [risposta, setRisposta] = useState(null);

  const handleSubmit = async () => {
    const res = await fetch("http://localhost:3000/valuta", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ categoria, brand, stato }),
    });

    const data = await res.json();
    setRisposta(data);
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>LookBook AI 💸</h1>

      <input
        placeholder="Categoria"
        value={categoria}
        onChange={(e) => setCategoria(e.target.value)}
      />
      <br />

      <input
        placeholder="Brand"
        value={brand}
        onChange={(e) => setBrand(e.target.value)}
      />
      <br />

      <input
        placeholder="Stato"
        value={stato}
        onChange={(e) => setStato(e.target.value)}
      />
      <br />

      <button onClick={handleSubmit}>Valuta</button>

      {risposta && (
        <div style={{ marginTop: "20px" }}>
          <h3>Risultato:</h3>

          <p><strong>Prezzo suggerito:</strong> €{risposta.suggested_price}</p>

          <p>
            <strong>Range:</strong> €{risposta.range.min} - €{risposta.range.max}
          </p>

          <p><strong>Motivazione:</strong> {risposta.motivation}</p>

          <p><strong>Consigli:</strong></p>
          <ul>
            {risposta?.selling_tips?.map((tip, index) => (
              <li key={index}>{tip}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default App;
