export const evaluateItem = async (data) => {
    const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/valuta`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
    });

    if (!res.ok) throw new Error("Errore backend");

    return res.json();
};