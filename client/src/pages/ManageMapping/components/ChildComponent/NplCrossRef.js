import React, { useState } from "react";
import axios from "axios";

const NplCrossRef = () => {
    const [doi, setDoi] = useState("");
    const [result, setResult] = useState(null);
    const [error, setError] = useState("");

    const fetchCrossref = async () => {

        const doiNumber = doi.trim();
        if (!doiNumber) return;
        try {
            setError("");
            const response = await axios.get(`http://localhost:8080/live/projectname/nplcorssref/${encodeURIComponent(doiNumber)}`);
            console.log('response', response)
            setResult(response.data.data);
        } catch (err) {
            setError("Failed to fetch data. Please check DOI.");
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === "Enter") {
            fetchCrossref();
        }
    };

    return (
        <div className="p-4">
            <h2 className="text-lg font-bold mb-2">Fetch NPL by DOI</h2>
            <input
                type="text"
                value={doi}
                onChange={(e) => setDoi(e.target.value)}
                onKeyDown={handleKeyDown} // 👈 trigger API on Enter
                placeholder="Enter DOI (e.g., 10.1109/ICSENS.2008.4716517)"
                className="border px-2 py-1 rounded w-96"
            />
            <button
                onClick={fetchCrossref}
                className="ml-2 px-4 py-1 bg-blue-500 text-white rounded"
            >
                Fetch
            </button>

            {error && <p className="text-red-500 mt-2">{error}</p>}

            {result && (
                <div className="mt-4 border p-3 rounded shadow">
                    <h3 className="font-bold">{result.title}</h3>
                    <p><strong>DOI:</strong> {result.doi}</p>
                    <p><strong>Authors:</strong> {result.authors.join(", ")}</p>
                    <p><strong>Publisher:</strong> {result.publisher}</p>
                    <p><strong>Published:</strong> {result.publishedDate}</p>
                    <p><strong>References:</strong> {result.referenceCount}</p>
                    <p><strong>Citations:</strong> {result.citationCount}</p>
                    <p><a href={result.url} target="_blank" rel="noreferrer">View Full Text</a></p>
                </div>
            )}
        </div>
    );
};

export default NplCrossRef;
