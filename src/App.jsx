import { useState, useRef, useEffect } from "react";
import ResultCard from "./components/ResultCard";
import { evaluateItem } from "./services/api";
import './App.css';

function App() {

  // -----------------------------
  // 🔹 STATI PRINCIPALI FORM
  // -----------------------------
  const [categoria, setCategoria] = useState("");
  const [brand, setBrand] = useState("");
  const [stato, setStato] = useState("");
  const [taglia, setTaglia] = useState("");
  const [genere, setGenere] = useState("");

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
  const fileRef = useRef(null);
  // -----------------------------
  // 🔹 AUTOCOMPLETE BRAND
  // -----------------------------
  const brandsList = [
    "Adidas",
    "Armani",
    "Diesel",
    "Guess",
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
  const historyRef = useRef(null);

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

  // STORICO
  const [showHistory, setShowHistory] = useState(false);
  const [history, setHistory] = useState([]);

  // -----------------------------
  // 🔹 RESET FORM
  // -----------------------------
  const handleSubmit = async () => {
    if (!categoria.trim() || !brand.trim() || !stato || !taglia || !genere) {
      setErroreInput("Compila tutti i campi");
      return;
    }

    setErroreInput("");
    setLoading(true);

    try {
      const data = await evaluateItem({
        categoria,
        brand,
        stato,
        taglia,
      });

      setRisposta(data);

      // 👉 SPOSTATO QUI DENTRO
      setHistory((prev) => [
        {
          categoria,
          brand,
          prezzo: data.suggested_price,
        },
        ...prev
      ]);

    } catch (err) {
      setRisposta({ error: "Errore con il backend" });
    } finally {
      setLoading(false);
    }

    setTimeout(() => {
      resultRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  const handleReset = () => {
    setCategoria("");
    setBrand("");
    setStato("");
    setTaglia("");
    setRisposta(null);
    setErroreInput("");
    setFilteredBrands([]);
    setImage(null);
    setGenere("");
    if (fileRef.current) {
      fileRef.current.value = "";
    }
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  };

  // -----------------------------
  // 🔹 UI
  // -----------------------------
  return (
    <div style={{ padding: "20px" }}>
      <h1>👖ResellAI👕</h1>
      {/* ERRORI */}
      {erroreInput && <p className="error">{erroreInput}</p>}
      <p className="subtitle">
        Smarter resale pricing powered by AI
      </p>

      {/* UPLOAD IMMAGINE */}
      <input
        ref={fileRef}
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

      {/* GENERE */}
      <select className={erroreInput && !genere ? "input-error" : ""}
        value={genere}
        onChange={(e) => setGenere(e.target.value)}
      >
        <option value="">Seleziona genere</option>
        <option value="uomo">👨 Uomo</option>
        <option value="donna">👩 Donna</option>
      </select>

      {/* TAGLIA */}
      <select
        className={erroreInput && !taglia ? "input-error" : ""}
        value={taglia}
        onChange={(e) => setTaglia(e.target.value)}
      >
        <option value="">Seleziona taglia</option>
        <option value="XS">📏 XS</option>
        <option value="S">📏 S</option>
        <option value="M">📏 M</option>
        <option value="L">📏 L</option>
        <option value="XL">📏 XL</option>
        <option value="XXL">📏 XXL</option>
      </select>

      {/* STATO */}
      <select className={erroreInput && !stato ? "input-error" : ""}
        value={stato}
        onChange={(e) => setStato(e.target.value)}
      >
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

      <div className="history-toggle">
        <button
          onClick={() => setShowHistory(!showHistory)}
          className="reset-btn"
        >
          📜 {showHistory ? "Nascondi storico" : "Mostra storico"}

          {showHistory && history.length === 0 && (
            <p className="empty-history">
              📭 Nessuna valutazione ancora
            </p>
          )}
        </button>
      </div>

      {/* <div className="history-toggle">
        <button
          onClick={() => {
            const newState = !showHistory;
            setShowHistory(newState);

            if (!showHistory) {
              setTimeout(() => {
                historyRef.current?.scrollIntoView({ behavior: "smooth" });
              }, 100);
            }
          }}
          className="reset-btn"
        >
          📜 {showHistory ? "Nascondi storico" : "Mostra storico"}
        </button>
      </div> */}

      {/* LOADING */}
      {loading && (
        <div className="overlay">
          <div className="overlay-content">
            <div className="spinner"></div>
            <p>Analisi in corso...</p>
          </div>
        </div>
      )}

      {
        showHistory && history.length > 0 && (
          <div ref={historyRef} className="history-container">
            <h3>📦 Storico valutazioni</h3>

            {history.map((item, index) => (
              <div key={index} className="history-item">
                🧾 {item.brand} / {item.categoria} → €{item.prezzo}
              </div>
            ))}

            <button
              onClick={() => setHistory([])}
              className="reset-btn"
              style={{ marginTop: "10px" }}
            >
              🗑️ Svuota storico
            </button>
          </div>
        )
      }

      {/* RISULTATO AI */}
      {
        risposta && !loading && (
          <ResultCard
            risposta={risposta}
            image={image}
            resultRef={resultRef}
          />
        )
      }

    </div >
  );
}

export default App;