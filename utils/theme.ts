const colors = {
  primary: '#007bff',
  secondary: '#6c757d',
  success: '#28a745',
  danger: '#dc3545',
  warning: '#ffc107',
  info: '#17a2b8',
};
const theme = {
  colors,
} as const;

export type Theme = typeof theme;

export default theme;
