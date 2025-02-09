export interface PasswordComplexityOption {
  id: 'uppercase' | 'lowercase' | 'numbers' | 'symbols';
  label: string;
  value: boolean;
}