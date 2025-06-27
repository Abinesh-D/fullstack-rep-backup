import React from 'react';

export const mapFamilyMemberData = (data) => {
  const familyMembers = data.familyData?.["world-patent-data"]?.["patent-family"]?.["family-member"];
  if (!familyMembers) return [];

  const familyMembersArray = Array.isArray(familyMembers) ? familyMembers : [familyMembers];

  return familyMembersArray.map((familyMember) => {
    const publications = familyMember["publication-reference"]?.["document-id"] || [];

    const publicationInfo = (Array.isArray(publications) ? publications : [publications])
      .filter((doc) => doc?.["$"]?.["document-id-type"] === "docdb")
      .map((doc) => `${doc["country"]}${doc["doc-number"]}${doc["kind"]}`)
      .join('');

    return {
      familyId: familyMember["$"]["family-id"],
      familyPatent: publicationInfo,
    };
  });
};

const BulkFunction = () => {
  return null;
};

export default BulkFunction;
