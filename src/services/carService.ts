import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

export interface CarData {
  _id?: string;
  make: string;
  modelName: string;
  year: number;
  price: number;
  mileage: number;
  url?: string;
}

// Helper function to get auth headers
const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    headers: {
      Authorization: `Bearer ${token}`
    }
  };
};

export const carService = {
  async createCar(carData: CarData) {
    console.log('Creating car with data:', carData);
    try {
      const response = await axios.post(`${API_URL}/cars`, carData, getAuthHeaders());
      console.log('Create car response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error creating car:', error);
      throw error;
    }
  },

  async getCars() {
    console.log('Fetching cars');
    try {
      const response = await axios.get(`${API_URL}/cars`, getAuthHeaders());
      console.log('Get cars response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error fetching cars:', error);
      throw error;
    }
  },

  async updateCar(id: string, carData: CarData) {
    console.log('Updating car with id:', id, 'data:', carData);
    try {
      const response = await axios.put(`${API_URL}/cars/${id}`, carData, getAuthHeaders());
      console.log('Update car response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error updating car:', error);
      throw error;
    }
  },

  async deleteCar(id: string) {
    console.log('Deleting car with id:', id);
    try {
      const response = await axios.delete(`${API_URL}/cars/${id}`, getAuthHeaders());
      console.log('Delete car response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error deleting car:', error);
      throw error;
    }
  }
}; 