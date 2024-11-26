export const environment = {
  production: true,
  apiUrl: 'https://api.vetpractice.com/auth', // Replace with your production API URL
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
    dashboard: '/dashboard'
  }
};
