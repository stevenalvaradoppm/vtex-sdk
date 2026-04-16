const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export const EMAIL_INVALID_MESSAGE =
  "Ingresa un email válido (ej. usuario@dominio.com)."

export const isValidEmail = (value: string): boolean =>
  EMAIL_REGEX.test(value.trim())
