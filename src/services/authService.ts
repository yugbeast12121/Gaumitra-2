import { User, LoginCredentials, RegisterData } from '../types/auth';

// Simulated user database (in production, this would be a real database)
const USERS_KEY = 'gaumitra_users';
const CURRENT_USER_KEY = 'gaumitra_current_user';

// Get users from localStorage
const getUsers = (): User[] => {
  const users = localStorage.getItem(USERS_KEY);
  return users ? JSON.parse(users) : [];
};

// Save users to localStorage
const saveUsers = (users: User[]) => {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
};

// Get current user from localStorage
export const getCurrentUser = (): User | null => {
  const user = localStorage.getItem(CURRENT_USER_KEY);
  return user ? JSON.parse(user) : null;
};

// Save current user to localStorage
const saveCurrentUser = (user: User) => {
  localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
};

// Remove current user from localStorage
export const clearCurrentUser = () => {
  localStorage.removeItem(CURRENT_USER_KEY);
};

// Register new user
export const register = async (userData: RegisterData): Promise<User> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));

  const users = getUsers();
  
  // Check if user already exists
  const existingUser = users.find(user => user.email === userData.email);
  if (existingUser) {
    throw new Error('User with this email already exists');
  }

  // Validate password confirmation
  if (userData.password !== userData.confirmPassword) {
    throw new Error('Passwords do not match');
  }

  // Create new user
  const newUser: User = {
    id: Date.now().toString(),
    email: userData.email,
    name: userData.name,
    phone: userData.phone,
    createdAt: new Date()
  };

  // Save user
  users.push(newUser);
  saveUsers(users);
  saveCurrentUser(newUser);

  return newUser;
};

// Login user
export const login = async (credentials: LoginCredentials): Promise<User> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));

  const users = getUsers();
  
  // Find user by email
  const user = users.find(u => u.email === credentials.email);
  if (!user) {
    throw new Error('Invalid email or password');
  }

  // In a real app, you would verify the password hash
  // For demo purposes, we'll accept any password for existing users
  
  saveCurrentUser(user);
  return user;
};

// Logout user
export const logout = async (): Promise<void> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  clearCurrentUser();
};

// Check if user is authenticated
export const isAuthenticated = (): boolean => {
  return getCurrentUser() !== null;
};