export const mapFamilyMemberData = (data) => {
    const familyMembers = data?.familyData?.["world-patent-data"]?.["patent-family"]?.["family-member"];

    const familyMembersArray = Array.isArray(familyMembers)
        ? familyMembers
        : familyMembers
            ? [familyMembers]
            : [];

    const mappedFamilyData = familyMembersArray.map((familyMember) => {
        let publications = familyMember?.["publication-reference"]?.["document-id"];

        const publicationsArray = Array.isArray(publications)
            ? publications
            : publications
                ? [publications]
                : [];

        const publicationInfo = publicationsArray
            .filter(doc => doc?.["$"]?.["document-id-type"] === "docdb")
            .map(doc => `${doc?.["country"] || ''}${doc?.["doc-number"] || ''}${doc?.["kind"] || ''}`)
            .join(', ');

        return {
            familyId: familyMember?.["$"]?.["family-id"] || '',
            familyPatent: publicationInfo
        };
    });

    return mappedFamilyData;
};