export const customDomainQueries = `
    schoolId(customDomain: String): String @cacheControl(maxAge: 600, scope: PRIVATE)
    customDomain: String
`;

export const customDomainMutations = `
    setCustomDomain(customDomain: String!): String
`;
