// Form validation utilities

export const validators = {
  required: (fieldName: string) => (value: string): string | null => {
    if (!value || value.trim().length === 0) {
      return `${fieldName} is required`;
    }
    return null;
  },

  email: (value: string): string | null => {
    if (!value) return null;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value)) {
      return 'Please enter a valid email address';
    }
    return null;
  },

  minLength: (min: number) => (value: string): string | null => {
    if (!value) return null;
    if (value.length < min) {
      return `Must be at least ${min} characters long`;
    }
    return null;
  },

  maxLength: (max: number) => (value: string): string | null => {
    if (!value) return null;
    if (value.length > max) {
      return `Must be no more than ${max} characters long`;
    }
    return null;
  },

  password: (value: string): string | null => {
    if (!value) return null;
    
    if (value.length < 8) {
      return 'Password must be at least 8 characters long';
    }
    
    if (!/(?=.*[a-z])/.test(value)) {
      return 'Password must contain at least one lowercase letter';
    }
    
    if (!/(?=.*[A-Z])/.test(value)) {
      return 'Password must contain at least one uppercase letter';
    }
    
    if (!/(?=.*\d)/.test(value)) {
      return 'Password must contain at least one number';
    }
    
    if (!/(?=.*[!@#$%^&*(),.?":{}|<>])/.test(value)) {
      return 'Password must contain at least one special character';
    }
    
    return null;
  },

  confirmPassword: (originalPassword: string) => (value: string): string | null => {
    if (!value) return null;
    if (value !== originalPassword) {
      return 'Passwords do not match';
    }
    return null;
  },

  name: (value: string): string | null => {
    if (!value) return null;
    
    if (value.length < 2) {
      return 'Name must be at least 2 characters long';
    }
    
    if (!/^[a-zA-Z\s]+$/.test(value)) {
      return 'Name can only contain letters and spaces';
    }
    
    return null;
  },
};

// Validation rule sets for common forms
export const validationRules = {
  register: {
    name: [validators.required('Name'), validators.name],
    email: [validators.required('Email'), validators.email],
    password: [validators.required('Password'), validators.password],
    confirmPassword: [] // Will be set dynamically with the password value
  },
  
  login: {
    email: [validators.required('Email'), validators.email],
    password: [validators.required('Password')]
  },
  
  forgotPassword: {
    email: [validators.required('Email'), validators.email]
  },
  
  resetPassword: {
    otp: [validators.required('OTP'), validators.minLength(6)],
    newPassword: [validators.required('New Password'), validators.password],
    confirmPassword: [] // Will be set dynamically with the newPassword value
  }
};