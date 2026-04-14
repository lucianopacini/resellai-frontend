function ResultCard({ risposta, image, resultRef }) {
    return (
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
    );
}

export default ResultCard;