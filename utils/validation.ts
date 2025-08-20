export const validateEmail = (email: string): string | undefined => {
    if (!email) {
      return 'Email is required.';
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return 'Please enter a valid email address.';
    }
  };
  
  export const validatePassword = (password: string): string | undefined => {
    if (!password) {
      return 'Password is required.';
    }
    if (password.length < 8) {
      return 'Password must be at least 8 characters long.';
    }
  };