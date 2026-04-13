import { useState, useRef, useEffect } from "react";
import './App.css';

function App() {

  // -----------------------------
  // 🔹 STATI PRINCIPALI FORM
  // -----------------------------
  const [categoria, setCategoria] = useState("");
  const [brand, setBrand] = useState("");
  const [stato, setStato] = useState("");
  const [taglia, setTaglia] = useState("");

  // -----------------------------
  // 🔹 RISPOSTA AI + UI STATE
  // -----------------------------
  const [risposta, setRisposta] = useState(null);
  const [loading, setLoading] = useState(false);
  const [erroreInput, setErroreInput] = useState("");

  // -----------------------------
  // 🔹 IMMAGINE UPLOAD
  // -----------------------------
  const [image, setImage] = useState(null);

  // -----------------------------
  // 🔹 AUTOCOMPLETE BRAND
  // -----------------------------
  const brandsList = [
    "Adidas",
    "Nike",
    "Puma",
    "Zara",
    "H&M",
    "Gucci",
    "Prada",
    "Louis Vuitton",
    "Balenciaga",
    "Versace",
    "Dolce & Gabbana",
    "Valentino"
  ];

  const [filteredBrands, setFilteredBrands] = useState([]);

  // -----------------------------
  // 🔹 REF UI (scroll + click outside)
  // -----------------------------
  const resultRef = useRef(null);
  const brandRef = useRef(null);
  const listRef = useRef(null);

  // -----------------------------
  // 🔹 CHIUDI AUTOCOMPLETE SE CLICCHI FUORI
  // -----------------------------
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        brandRef.current &&
        !brandRef.current.contains(e.target) &&
        listRef.current &&
        !listRef.current.contains(e.target)
      ) {
        setFilteredBrands([]);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // -----------------------------
  // 🔹 RESET FORM
  // -----------------------------
  const handleReset = () => {
    setCategoria("");
    setBrand("");
    setStato("");
    setTaglia("");
    setRisposta(null);
    setErroreInput("");
    setFilteredBrands([]);
    setImage(null);
  };

  // -----------------------------
  // 🔹 INVIO DATI AL BACKEND
  // -----------------------------
  const handleSubmit = async () => {

    // validazione base
    if (!categoria.trim() || !brand.trim() || !stato || !taglia) {
      setErroreInput("Compila tutti i campi");
      return;
    }

    setErroreInput("");
    setLoading(true);

    try {
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/valuta`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ categoria, brand, stato, taglia }),
      });

      if (!res.ok) throw new Error("Errore backend");

      const data = await res.json();
      setRisposta(data);

    } catch (err) {
      console.error(err);
      setRisposta({ error: "Errore con il backend" });

    } finally {
      setLoading(false);
    }

    // scroll automatico risultato
    setTimeout(() => {
      resultRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  // -----------------------------
  // 🔹 UI
  // -----------------------------
  return (
    <div style={{ padding: "20px" }}>
      <h1>Sono il grande Luciano</h1>

      {/* UPLOAD IMMAGINE */}
      <input
        type="file"
        accept="image/*"
        onChange={(e) => {
          const file = e.target.files[0];
          if (file) setImage(URL.createObjectURL(file));
        }}
      />

      {/* CATEGORIA */}
      <input
        className={erroreInput && !categoria.trim() ? "input-error" : ""}
        placeholder="Categoria"
        value={categoria}
        onChange={(e) => {
          setCategoria(e.target.value);
          setErroreInput("");
        }}
      />

      <br />

      {/* BRAND + AUTOCOMPLETE */}
      <input
        ref={brandRef}
        className={erroreInput && !brand.trim() ? "input-error" : ""}
        placeholder="Brand"
        value={brand}
        onChange={(e) => {
          const value = e.target.value;
          setBrand(value);
          setErroreInput("");

          if (value.length > 0) {
            const filtered = brandsList.filter((b) =>
              b.toLowerCase().startsWith(value.toLowerCase())
            );
            setFilteredBrands(filtered);
          } else {
            setFilteredBrands([]);
          }
        }}
      />

      {/* LISTA AUTOCOMPLETE */}

      {filteredBrands.length > 0 && (
        <ul ref={listRef} className="autocomplete-list">
          {filteredBrands.map((b, index) => (
            <li
              key={index}
              onClick={() => {
                setBrand(b);
                setFilteredBrands([]);
              }}
            >
              {b}
            </li>
          ))}
        </ul>
      )}

      {/* TAGLIA */}
      <select value={taglia} onChange={(e) => setTaglia(e.target.value)}>
        <option value="">Seleziona taglia</option>
        <option value="XS">📏 XS</option>
        <option value="S">📏 S</option>
        <option value="M">📏 M</option>
        <option value="L">📏 L</option>
        <option value="XL">📏 XL</option>
        <option value="XXL">📏 XXL</option>
      </select>

      {/* STATO */}
      <select value={stato} onChange={(e) => setStato(e.target.value)}>
        <option value="">Seleziona stato</option>
        <option value="come_nuovo">🆕 Come Nuovo</option>
        <option value="ottimo">✨ Ottimo</option>
        <option value="buono">👍 Buono</option>
        <option value="discreto">♻️ Discreto</option>
      </select>

      <br />

      {/* BOTTONI */}
      <div className="buttons-container">
        <button className="btn-primary" onClick={handleSubmit} disabled={loading}>
          {loading ? "⏳ Attendi..." : "Valuta"}
        </button>

        <button onClick={handleReset} className="reset-btn">
          🔄 Reset
        </button>
      </div>

      {/* ERRORI */}
      {erroreInput && <p className="error">{erroreInput}</p>}

      {/* LOADING */}
      {loading && <p className="loader">⏳ Sto valutando...</p>}

      {/* RISULTATO AI */}
      {risposta && !loading && (
        <div className="results-container">

          {risposta.error ? (
            <p className="error">{risposta.error}</p>
          ) : (
            <div ref={resultRef} className="result-card fade-in">

              {/* IMMAGINE */}
              {image && (
                <div className="image-preview">
                  <img src={image} alt="Preview" />
                </div>
              )}

              {/* PREZZO */}
              <p className="prezzo">
                💰 <strong>Prezzo:</strong> €{risposta.suggested_price}
              </p>

              {/* RANGE */}
              <p className="range">
                📊 <strong>Range:</strong> €{risposta.range.min} - €{risposta.range.max}
              </p>

              {/* MOTIVAZIONE */}
              <div className="motivazione">
                <strong>📝 Motivazione:</strong>
                <p>{risposta.motivation}</p>
              </div>

              {/* CONSIGLI */}
              <div className="consigli">
                <strong>💡 Consigli:</strong>
                <ul>
                  {risposta?.selling_tips?.map((tip, index) => (
                    <li key={index}>{tip}</li>
                  ))}
                </ul>
              </div>

            </div>
          )}

        </div>
      )}
    </div>
  );
}

export default App;