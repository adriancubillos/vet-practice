export const environment = {
  production: false,
  apiUrl: 'http://localhost:3000',
  authUrl: 'http://localhost:3000/auth',
  tokenKey: 'vet_practice_token',
  snackbarDuration: 3000,
  passwordRequirements: {
    minLength: 8,
    maxLength: 32,
    requireUppercase: true,
    requireLowercase: true,
    requireNumber: true,
    requireSpecialChar: true
  },
  routes: {
    auth: {
      register: '/register',
      login: '/login',
      logout: '/logout'
    },
    dashboard: '/dashboard',
    pet: '/pet',
  }
};
