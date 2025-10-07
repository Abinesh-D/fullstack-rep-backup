function extractClassificationTitle(parsedData) {
    if (!parsedData) return null;

    const classificationItem =
        parsedData?.["world-patent-data"]?.["classification-scheme"]?.["cpc"]?.["class-scheme"]?.["classification-item"];

    if (!classificationItem?.["class-title"]?.["title-part"]) return null;

    const titlePart = classificationItem["class-title"]["title-part"];

    if (titlePart?.["comment"]?.["text"]) {
        return titlePart["comment"]["text"];
    }

    if (titlePart?.["text"]) {
        return titlePart["text"];
    }

    if (Array.isArray(titlePart)) {
        return titlePart
            .map(part => part?.text || "")
            .filter(Boolean)
            .join("; ");
    }

    return null;
}

module.exports = { extractClassificationTitle };
