// Dummy users data
export const dummyUsers = [
    {
      id: '1',
      email: 'user@example.com',
      password: 'password123', // Not used in dummy, but good to have for reference
      name: 'Test User'
    },
    {
      id: '2',
      email: 'admin@example.com',
      password: 'admin123',
      name: 'Admin User'
    }
  ];
  
  // Get user by ID
  export const getUserById = (id: string) => {
    return dummyUsers.find(user => user.id === id);
  };
  
  // Get user by email
  export const getUserByEmail = (email: string) => {
    return dummyUsers.find(user => user.email === email);
  };
  
  // Get all users
  export const getAllUsers = () => {
    return dummyUsers;
  };