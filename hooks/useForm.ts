'use client';

import { useState, useCallback } from 'react';

export interface FormField {
  value: string;
  error: string;
  touched: boolean;
}

export interface UseFormReturn<T> {
  fields: Record<keyof T, FormField>;
  setField: (name: keyof T, value: string) => void;
  setFieldError: (name: keyof T, error: string) => void;
  setFieldTouched: (name: keyof T, touched: boolean) => void;
  getFieldValue: (name: keyof T) => string;
  getFieldError: (name: keyof T) => string;
  isFieldTouched: (name: keyof T) => boolean;
  hasErrors: boolean;
  isValid: boolean;
  resetForm: () => void;
  validateField: (name: keyof T, validators: ((value: string) => string | null)[]) => boolean;
  validateForm: (validationRules: Record<keyof T, ((value: string) => string | null)[]>) => boolean;
}

export function useForm<T extends Record<string, any>>(
  initialValues: T
): UseFormReturn<T> {
  const [fields, setFields] = useState<Record<keyof T, FormField>>(() => {
    const initialFields: Record<keyof T, FormField> = {} as any;
    Object.keys(initialValues).forEach((key) => {
      initialFields[key as keyof T] = {
        value: initialValues[key] || '',
        error: '',
        touched: false,
      };
    });
    return initialFields;
  });

  const setField = useCallback((name: keyof T, value: string) => {
    setFields(prev => ({
      ...prev,
      [name]: {
        ...prev[name],
        value,
        error: prev[name].touched ? prev[name].error : '',
      }
    }));
  }, []);

  const setFieldError = useCallback((name: keyof T, error: string) => {
    setFields(prev => ({
      ...prev,
      [name]: {
        ...prev[name],
        error,
      }
    }));
  }, []);

  const setFieldTouched = useCallback((name: keyof T, touched: boolean) => {
    setFields(prev => ({
      ...prev,
      [name]: {
        ...prev[name],
        touched,
      }
    }));
  }, []);

  const getFieldValue = useCallback((name: keyof T): string => {
    return fields[name]?.value || '';
  }, [fields]);

  const getFieldError = useCallback((name: keyof T): string => {
    return fields[name]?.error || '';
  }, [fields]);

  const isFieldTouched = useCallback((name: keyof T): boolean => {
    return fields[name]?.touched || false;
  }, [fields]);

  const hasErrors = Object.values(fields).some(field => field.error);
  const isValid = !hasErrors && Object.values(fields).every(field => field.touched);

  const resetForm = useCallback(() => {
    setFields(() => {
      const resetFields: Record<keyof T, FormField> = {} as any;
      Object.keys(initialValues).forEach((key) => {
        resetFields[key as keyof T] = {
          value: initialValues[key] || '',
          error: '',
          touched: false,
        };
      });
      return resetFields;
    });
  }, [initialValues]);

  const validateField = useCallback((
    name: keyof T, 
    validators: ((value: string) => string | null)[]
  ): boolean => {
    const value = fields[name]?.value || '';
    
    for (const validator of validators) {
      const error = validator(value);
      if (error) {
        setFieldError(name, error);
        return false;
      }
    }
    
    setFieldError(name, '');
    return true;
  }, [fields, setFieldError]);

  const validateForm = useCallback((
    validationRules: Record<keyof T, ((value: string) => string | null)[]>
  ): boolean => {
    let isFormValid = true;
    
    Object.keys(validationRules).forEach((key) => {
      const fieldName = key as keyof T;
      const validators = validationRules[fieldName];
      const isFieldValid = validateField(fieldName, validators);
      
      if (!isFieldValid) {
        isFormValid = false;
      }
      
      // Mark field as touched for validation display
      setFieldTouched(fieldName, true);
    });
    
    return isFormValid;
  }, [validateField, setFieldTouched]);

  return {
    fields,
    setField,
    setFieldError,
    setFieldTouched,
    getFieldValue,
    getFieldError,
    isFieldTouched,
    hasErrors,
    isValid,
    resetForm,
    validateField,
    validateForm,
  };
}