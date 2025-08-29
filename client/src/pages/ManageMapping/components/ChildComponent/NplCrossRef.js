import React, { useState } from "react";
import axios from "axios";

const NplCrossRef = ({ onFetchSuccess }) => {
    const [doi, setDoi] = useState("");
    const [error, setError] = useState("");

    const fetchCrossref = async () => {
        const doiNumber = doi.trim();
        if (!doiNumber) return;

        try {
            setError("");
            const response = await axios.get(
                `http://localhost:8080/live/projectname/nplcorssref/${encodeURIComponent(doiNumber)}`
            );
            const data = response.data.data;
            if (onFetchSuccess) onFetchSuccess(data); 
        } catch (err) {
            setError("Failed to fetch data. Please check DOI.");
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === "Enter") fetchCrossref();
    };

    return (
            <div className="flex flex-col sm:flex-row gap-2">
                <input
                    type="text"
                    value={doi}
                    onChange={(e) => setDoi(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Enter DOI (e.g., 10.1109/ICSENS.2008.4716517)"
                    className="border px-2 py-1 rounded w-full sm:w-96"
                />
                <button
                    onClick={fetchCrossref}
                    className="px-4 py-1 btn-primary rounded"
                >
                    Fetch
                </button>

            {error && <p className="text-red-500 mt-2">{error}</p>}
        </div>
    );
};

export default NplCrossRef;
