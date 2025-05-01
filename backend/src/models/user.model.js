const getUsers = async () => {
    const [users] = await db.query("SELECT * FROM users");
    return users;
};

export { getUsers };