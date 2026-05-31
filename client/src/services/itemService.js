import api from './api';

export const getItems = async (category = '', search = '') => {
  const { data } = await api.get('/items', { params: { category, search } });
  return data;
};

export const addItem = async (itemData) => {
  const { data } = await api.post('/items', itemData);
  return data;
};

export const updateItem = async (id, itemData) => {
  const { data } = await api.put(`/items/${id}`, itemData);
  return data;
};

export const deleteItem = async (id) => {
  const { data } = await api.delete(`/items/${id}`);
  return data;
};

export const updateQuantity = async (id, change) => {
  const { data } = await api.patch(`/items/${id}/quantity`, { change });
  return data;
};

export const getLowStockAlerts = async () => {
  const { data } = await api.get('/items/alerts/lowstock');
  return data;
};

export const getExpiryAlerts = async () => {
  const { data } = await api.get('/items/alerts/expiry');
  return data;
};

export const getDashboard = async () => {
  const { data } = await api.get('/dashboard');
  return data;
};