// import { API_CONFIG } from '@/config/api';

// interface ApiResponse<T = any> {
//   status: boolean;
//   message: string;
//   token?: string;
//   role?: number;
//   data?: T;
//   errors?: Record<string, string[]>;
// }

// class ApiService {
//   private static getHeaders(includeAuth: boolean = false): HeadersInit {
//     const headers: HeadersInit = {
//       'Accept': 'application/json',
//     };

//     if (includeAuth) {
//       const token = localStorage.getItem('token');
//       if (token) {
//         headers['Authorization'] = `Bearer ${token}`;
//       }
//     }

//     return headers;
//   }

//   static async post<T>(
//     endpoint: string, 
//     data: any, 
//     requiresAuth: boolean = false
//   ): Promise<ApiResponse<T>> {
//     try {
//       const response = await fetch(`${API_CONFIG.BASE_URL}${endpoint}`, {
//         method: 'POST',
//         headers: this.getHeaders(requiresAuth),
//         body: data instanceof FormData ? data : JSON.stringify(data),
//       });

//       if (response.status === 401) {
//         // Handle unauthorized (redirect to login)
//         window.location.href = '/login';
//         throw new Error('Unauthorized');
//       }

//       const result = await response.json();

//       if (!response.ok) {
//         throw result;
//       }

//       return result;
//     } catch (error: any) {
//       throw {
//         status: false,
//         message: error.message || 'Something went wrong',
//         errors: error.errors
//       };
//     }
//   }

//   // Add other methods (GET, PUT, DELETE) as needed
// }

// export default ApiService; 