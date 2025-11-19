export const selectUserWithAddressByIdTemplate = `
SELECT
    u.*,
    a.id AS address_id,
    a.street AS address_street,
    a.city AS address_city,
    a.state AS address_state,
    a.zipcode AS address_zipcode
FROM users u
LEFT JOIN addresses a ON u.id = a.user_id
WHERE u.id = ?
LIMIT 1
`;
export const selectUsersTemplate = `
SELECT *
FROM users
ORDER BY name
LIMIT ?, ?
`;

export const selectCountOfUsersTemplate = `
SELECT COUNT(*) as count
FROM users
`;

export const selectUsersWithAddressLeftJoinTemplate = `
SELECT
    u.*,
    a.id AS address_id,
    a.street AS address_street,
    a.city AS address_city,
    a.state AS address_state,
    a.zipcode AS address_zipcode
FROM users u
LEFT JOIN addresses a ON u.id = a.user_id
ORDER BY u.name
LIMIT ?, ?
`;
