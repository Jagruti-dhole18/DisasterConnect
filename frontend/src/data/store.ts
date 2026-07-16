import api from '../lib/api';
import type {
  User, Volunteer, ReliefCamp, MissingPerson, Donation,
  Notification, DisasterAlert, Message, SOSRequest, FoodRequest, MedicineRequest, BaseRequest,
} from '../types';

interface DB {
  users: User[];
  volunteers: Volunteer[];
  reliefCamps: ReliefCamp[];
  sosRequests: SOSRequest[];
  foodRequests: FoodRequest[];
  medicineRequests: MedicineRequest[];
  missingPersons: MissingPerson[];
  donations: Donation[];
  notifications: Notification[];
  disasterAlerts: DisasterAlert[];
  messages: Message[];
}

type Listener = () => void;
const listeners = new Set<Listener>();

function unwrapList<T>(payload: any): T[] {
  if (Array.isArray(payload)) return payload as T[];
  if (Array.isArray(payload?.data)) return payload.data as T[];
  return [];
}

function unwrapSingle<T>(payload: any): T | null {
  if (payload?.data !== undefined) return (payload.data as T) ?? null;
  return (payload as T) ?? null;
}

function getErrorMessage(payload: any, fallback: string): string {
  if (payload?.message) return payload.message;
  return fallback;
}

export function subscribe(listener: Listener): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function getDB(): DB {
  return {
    users: [],
    volunteers: [],
    reliefCamps: [],
    sosRequests: [],
    foodRequests: [],
    medicineRequests: [],
    missingPersons: [],
    donations: [],
    notifications: [],
    disasterAlerts: [],
    messages: [],
  };
}

export function resetDB() {
  listeners.forEach((listener) => listener());
}

export function genId(prefix = 'id'): string {
  return `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
}

export const usersApi = {
  list: async () => {
    const { data } = await api.get('/admin/users');
    return unwrapList<User>(data);
  },
  byId: async (id: string) => {
    const { data } = await api.get('/admin/users', { params: { search: id, limit: 1 } });
    const users = unwrapList<User>(data);
    return users.find((user) => user._id === id) ?? null;
  },
  byEmail: async (email: string) => {
    const { data } = await api.get('/admin/users', { params: { search: email, limit: 5 } });
    const users = unwrapList<User>(data);
    return users.find((user) => user.email.toLowerCase() === email.toLowerCase()) ?? null;
  },
  create: async (data: Partial<User>) => {
    const { data: response } = await api.post('/auth/register', data);
    if (!response?.success) throw new Error(getErrorMessage(response, 'Unable to create user'));
    return response.user as User;
  },
  update: async (id: string, patch: Partial<User>) => {
    const { data } = await api.put('/auth/me', { ...patch, id });
    if (!data?.success) throw new Error(getErrorMessage(data, 'Unable to update user'));
    return data.user as User;
  },
  approveNgo: async (id: string) => {
    const { data } = await api.put(`/admin/ngos/${id}/approve`);
    if (!data?.success) throw new Error(getErrorMessage(data, 'Unable to approve NGO'));
    return unwrapSingle<User>(data);
  },
  remove: async (id: string) => {
    const { data } = await api.delete(`/admin/users/${id}`);
    return Boolean(data?.success);
  },
};

export const requestsApi = {
  list: async (type?: 'sos' | 'food' | 'water' | 'medicine') => {
    const { data } = await api.get('/requests', { params: type ? { type } : {} });
    return unwrapList<BaseRequest>(data);
  },
  byId: async (id: string) => {
    const { data } = await api.get(`/requests/${id}`);
    return unwrapSingle<BaseRequest>(data);
  },
  byCitizen: async (citizenId: string) => {
    const { data } = await api.get('/requests', { params: { citizen: citizenId } });
    return unwrapList<BaseRequest>(data);
  },
  byVolunteer: async (volId: string) => {
    const { data } = await api.get('/requests', { params: { volunteer: volId } });
    return unwrapList<BaseRequest>(data);
  },
  create: async (data: Partial<BaseRequest> & { type: 'sos' | 'food' | 'water' | 'medicine' }) => {
    const { data: response } = await api.post('/requests', data);
    return unwrapSingle<BaseRequest>(response);
  },
  update: async (id: string, patch: Partial<BaseRequest>) => {
    const { data } = await api.put(`/requests/${id}`, patch);
    return unwrapSingle<BaseRequest>(data);
  },
};

// export const volunteersApi = {
//   list: async () => {
//     const { data } = await api.get('/volunteers');
//     return unwrapList<Volunteer>(data);
//   },
//   byUserId: async (userId: string) => {
//     const volunteers = await volunteersApi.list();
//     return volunteers.find((volunteer) => volunteer.user === userId) ?? null;
//   },
//   update: async (id: string, patch: Partial<Volunteer>) => {
//     const { data } = await api.put(`/volunteers/${id}`, patch);
//     return unwrapSingle<Volunteer>(data);
//   },
// };
export const volunteersApi = {
  list: async () => {
    const { data } = await api.get('/volunteers');
    return unwrapList<Volunteer>(data);
  },

  verify: async (id: string) => {
    const { data } = await api.put(`/volunteers/${id}/verify`);
    return unwrapSingle<Volunteer>(data);
  },

  updateProfile: async (patch: Partial<Volunteer>) => {
    const { data } = await api.put('/volunteers/me', patch);
    return unwrapSingle<Volunteer>(data);
  },
};

export const reliefCampsApi = {
  list: async () => {
    const { data } = await api.get('/relief-camps');
    return unwrapList<ReliefCamp>(data);
  },
  byId: async (id: string) => {
    const { data } = await api.get(`/relief-camps/${id}`);
    return unwrapSingle<ReliefCamp>(data);
  },
  byNgo: async (ngoId: string) => {
    const camps = await reliefCampsApi.list();
    return camps.filter((camp) => camp.ngo === ngoId);
  },
  create: async (data: Partial<ReliefCamp>) => {
    const { data: response } = await api.post('/relief-camps', data);
    return unwrapSingle<ReliefCamp>(response);
  },
  update: async (id: string, patch: Partial<ReliefCamp>) => {
    const { data } = await api.put(`/relief-camps/${id}`, patch);
    return unwrapSingle<ReliefCamp>(data);
  },
  remove: async (id: string) => {
    const { data } = await api.delete(`/relief-camps/${id}`);
    return Boolean(data?.success);
  },
};

export const missingPersonsApi = {
  list: async () => {
    const { data } = await api.get('/missing-persons');
    return unwrapList<MissingPerson>(data);
  },
  create: async (data: Partial<MissingPerson>) => {
    const { data: response } = await api.post('/missing-persons', data);
    return unwrapSingle<MissingPerson>(response);
  },
  update: async (id: string, patch: Partial<MissingPerson>) => {
    const { data } = await api.put(`/missing-persons/${id}`, patch);
    return unwrapSingle<MissingPerson>(data);
  },
};

export const donationsApi = {
  list: async () => {
    const { data } = await api.get('/donations');
    return unwrapList<Donation>(data);
  },
  byNgo: async (ngoId: string) => {
    const { data } = await api.get('/donations', { params: { ngo: ngoId } });
    return unwrapList<Donation>(data);
  },
  create: async (data: Partial<Donation>) => {
    const { data: response } = await api.post('/donations', data);
    return unwrapSingle<Donation>(response);
  },
};

export const notificationsApi = {
  byUser: async (userId: string) => {
    const { data } = await api.get('/notifications', { params: { user: userId } });
    return unwrapList<Notification>(data);
  },
  create: async (data: Partial<Notification>) => {
    const { data: response } = await api.post('/notifications', data);
    return unwrapSingle<Notification>(response);
  },
  markRead: async (id: string) => {
    const { data } = await api.put(`/notifications/${id}/read`);
    return Boolean(data?.success);
  },
  markAllRead: async (userId: string) => {
    const { data } = await api.put('/notifications/read-all', { userId });
    return Boolean(data?.success);
  },
};

export const disasterAlertsApi = {
  list: async () => {
    const { data } = await api.get('/alerts');
    return unwrapList<DisasterAlert>(data);
  },
  create: async (data: Partial<DisasterAlert>) => {
    const { data: response } = await api.post('/alerts', data);
    return unwrapSingle<DisasterAlert>(response);
  },
  update: async (id: string, patch: Partial<DisasterAlert>) => {
    const { data } = await api.put(`/alerts/${id}`, patch);
    return unwrapSingle<DisasterAlert>(data);
  },
  remove: async (id: string) => {
    const { data } = await api.delete(`/alerts/${id}`);
    return Boolean(data?.success);
  },
};

export const messagesApi = {
  between: async (userId: string, otherId: string) => {
    const { data } = await api.get('/messages/between', { params: { userId, otherId } });
    return unwrapList<Message>(data);
  },
  create: async (data: Partial<Message>) => {
    const { data: response } = await api.post('/messages', data);
    return unwrapSingle<Message>(response);
  },
  conversations: async () => {
    const { data } = await api.get('/messages/conversations');
    return data?.data || [];
  },
  markRead: async (id: string) => {
    const { data } = await api.put(`/messages/${id}/read`);
    return unwrapSingle<Message>(data);
  },
};
