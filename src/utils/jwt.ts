export const decodeToken = (token: string) => {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    
    // Handle both server and client environments
    const jsonPayload = typeof window !== 'undefined' 
      ? window.atob(base64)
      : Buffer.from(base64, 'base64').toString();
    
    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error('Error decoding token:', error);
    return null;
  }
}; 