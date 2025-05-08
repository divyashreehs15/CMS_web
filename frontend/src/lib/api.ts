import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests if it exists
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Add response interceptor for better error logging
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      console.error('API Error Response:', {
        status: error.response.status,
        data: error.response.data,
        headers: error.response.headers,
        config: {
          url: error.config?.url,
          method: error.config?.method,
          headers: error.config?.headers,
          data: error.config?.data
        }
      });
    } else if (error.request) {
      // The request was made but no response was received
      console.error('API Error Request:', {
        request: error.request,
        message: 'No response received from server'
      });
    } else {
      // Something happened in setting up the request that triggered an Error
      console.error('API Error:', error.message);
    }
    return Promise.reject(error);
  }
);

// Types
export interface User {
  id: number;
  username: string;
  role: 'jailer' | 'family';
}

export interface Prisoner {
  id: number;
  name: string;
  prisoner_id: string;
  age: number;
  gender: string;
  cell_number: string;
  sentence_start: string;
  sentence_end: string;
  crime_type: string;
  security_level: "low" | "medium" | "high";
  created_at?: string;
  updated_at?: string;
}

export interface HealthRecord {
  id: number;
  prisoner_id: number;
  status: string;
  last_checkup: string;
  conditions: string[];
  medications: string[];
  dietary_restrictions: string;
}

export interface WorkAssignment {
  id: number;
  prisoner_id: number;
  work_type: string;
  start_date: string;
  end_date: string;
  status: string;
  performance_rating: number;
}

export interface LegalInfo {
  id: number;
  prisoner_id: number;
  case_number: string;
  case_type: string;
  case_date: string;
  court_name: string;
  status: string;
  sentence_length: number;
  next_hearing_date: string;
}

export interface BehaviorRecord {
  id: number;
  prisoner_id: number;
  behavior_type: string;
  description: string;
  points: number;
  date: string;
}

export interface VisitRequest {
  id: number;
  prisoner_id: number;
  visitor_id: number;
  visit_date: string;
  visit_time: string;
  duration: number;
  type: string;
  status: string;
}

export interface Wage {
  id: number;
  prisoner_id: number;
  amount: number;
  payment_date: string;
  status: string;
}

// Auth API
export const authApi = {
  register: async (username: string, password: string, role: 'jailer' | 'family') => {
    const response = await api.post('/auth/register', { username, password, role });
    return response.data;
  },

  login: async (username: string, password: string) => {
    const response = await api.post('/auth/login', { username, password });
    return response.data;
  },

  getCurrentUser: async () => {
    const response = await api.get('/auth/me');
    return response.data;
  },
};

// Prisoners API
export const prisonersApi = {
  getAll: async () => {
    try {
      const response = await api.get('/prisoners');
      return response.data;
    } catch (error: any) {
      console.error('Error fetching prisoners:', error.response?.data || error.message);
      throw error;
    }
  },

  getById: async (id: number) => {
    try {
      const response = await api.get(`/prisoners/${id}`);
      return response.data;
    } catch (error: any) {
      console.error(`Error fetching prisoner ${id}:`, error.response?.data || error.message);
      throw error;
    }
  },

  create: async (prisoner: Partial<Prisoner>) => {
    try {
      // Log the request data in a readable format
      console.log('Creating prisoner with data:', JSON.stringify(prisoner, null, 2));
      
      // Add headers explicitly
      const config = {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      };
      
      const response = await api.post('/prisoners', prisoner, config);
      return response.data;
    } catch (error: any) {
      // Log detailed error information
      console.error('Error creating prisoner:', {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message,
        requestData: JSON.stringify(prisoner, null, 2),
        headers: error.config?.headers,
        url: error.config?.url
      });
      throw error;
    }
  },

  update: async (id: number, prisoner: Partial<Prisoner>) => {
    try {
      console.log(`Updating prisoner ${id} with data:`, JSON.stringify(prisoner, null, 2));
      
      // Add headers explicitly
      const config = {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      };
      
      const response = await api.put(`/prisoners/${id}`, prisoner, config);
      return response.data;
    } catch (error: any) {
      console.error(`Error updating prisoner ${id}:`, {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message,
        requestData: JSON.stringify(prisoner, null, 2)
      });
      throw error;
    }
  },

  delete: async (id: number) => {
    try {
      const response = await api.delete(`/prisoners/${id}`);
      return response.data;
    } catch (error: any) {
      console.error(`Error deleting prisoner ${id}:`, error.response?.data || error.message);
      throw error;
    }
  },
};

// Health API
export const healthApi = {
  getAll: async () => {
    const response = await api.get('/health');
    return response.data;
  },

  getByPrisonerId: async (prisonerId: number) => {
    const response = await api.get(`/health/prisoner/${prisonerId}`);
    return response.data;
  },

  create: async (record: Partial<HealthRecord>) => {
    const response = await api.post('/health', record);
    return response.data;
  },

  update: async (id: number, record: Partial<HealthRecord>) => {
    const response = await api.put(`/health/${id}`, record);
    return response.data;
  },

  getStats: async () => {
    const response = await api.get('/health/stats');
    return response.data;
  },
};

// Work API
export const workApi = {
  getAll: async () => {
    const response = await api.get('/work');
    return response.data;
  },

  getByPrisonerId: async (prisonerId: number) => {
    const response = await api.get(`/work/prisoner/${prisonerId}`);
    return response.data;
  },

  create: async (assignment: Partial<WorkAssignment>) => {
    const response = await api.post('/work', assignment);
    return response.data;
  },

  update: async (id: number, assignment: Partial<WorkAssignment>) => {
    const response = await api.put(`/work/${id}`, assignment);
    return response.data;
  },

  getStats: async () => {
    const response = await api.get('/work/stats');
    return response.data;
  },
};

// Legal API
export const legalApi = {
  getAll: async () => {
    const response = await api.get('/legal');
    return response.data;
  },

  getByPrisonerId: async (prisonerId: number) => {
    const response = await api.get(`/legal/prisoner/${prisonerId}`);
    return response.data;
  },

  create: async (info: Partial<LegalInfo>) => {
    const response = await api.post('/legal', info);
    return response.data;
  },

  update: async (id: number, info: Partial<LegalInfo>) => {
    const response = await api.put(`/legal/${id}`, info);
    return response.data;
  },

  getStats: async () => {
    const response = await api.get('/legal/stats');
    return response.data;
  },
};

// Behavior API
export const behaviorApi = {
  getAll: async () => {
    const response = await api.get('/behavior');
    return response.data;
  },

  getByPrisonerId: async (prisonerId: number) => {
    const response = await api.get(`/behavior/prisoner/${prisonerId}`);
    return response.data;
  },

  create: async (record: Partial<BehaviorRecord>) => {
    const response = await api.post('/behavior', record);
    return response.data;
  },

  update: async (id: number, record: Partial<BehaviorRecord>) => {
    const response = await api.put(`/behavior/${id}`, record);
    return response.data;
  },

  getStats: async () => {
    const response = await api.get('/behavior/stats');
    return response.data;
  },
};

// Visits API
export const visitsApi = {
  getAll: async () => {
    const response = await api.get('/visits');
    return response.data;
  },

  getByPrisonerId: async (prisonerId: number) => {
    const response = await api.get(`/visits/prisoner/${prisonerId}`);
    return response.data;
  },

  create: async (visit: Partial<VisitRequest>) => {
    const response = await api.post('/visits', visit);
    return response.data;
  },

  update: async (id: number, status: string) => {
    const response = await api.put(`/visits/${id}`, { status });
    return response.data;
  },

  getStats: async () => {
    const response = await api.get('/visits/stats');
    return response.data;
  },
};

// Wages API
export const wagesApi = {
  getAll: async () => {
    const response = await api.get('/wages');
    return response.data;
  },

  getByPrisonerId: async (prisonerId: number) => {
    const response = await api.get(`/wages/prisoner/${prisonerId}`);
    return response.data;
  },

  create: async (wage: Partial<Wage>) => {
    const response = await api.post('/wages', wage);
    return response.data;
  },

  update: async (id: number, status: string) => {
    const response = await api.put(`/wages/${id}`, { status });
    return response.data;
  },

  getStats: async () => {
    const response = await api.get('/wages/stats');
    return response.data;
  },
};

// Export all APIs
export const apiService = {
  auth: authApi,
  prisoners: prisonersApi,
  health: healthApi,
  work: workApi,
  legal: legalApi,
  behavior: behaviorApi,
  visits: visitsApi,
  wages: wagesApi,
};

export default apiService; 