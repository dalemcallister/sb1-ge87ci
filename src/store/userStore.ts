import { create } from 'zustand';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { User } from 'firebase/auth';

interface UserState {
  role: string | null;
  loading: boolean;
  error: string | null;
  fetchUserRole: (user: User) => Promise<void>;
  createUserProfile: (user: User, role?: string) => Promise<void>;
}

export const useUserStore = create<UserState>((set) => ({
  role: null,
  loading: false,
  error: null,

  fetchUserRole: async (user) => {
    try {
      set({ loading: true, error: null });
      const userDoc = await getDoc(doc(db, 'users', user.uid));
      if (userDoc.exists()) {
        set({ role: userDoc.data().role });
      } else {
        // If user document doesn't exist, create it with default role
        await setDoc(doc(db, 'users', user.uid), {
          email: user.email,
          role: 'user',
          createdAt: new Date(),
        });
        set({ role: 'user' });
      }
    } catch (error: any) {
      set({ error: error.message });
    } finally {
      set({ loading: false });
    }
  },

  createUserProfile: async (user, role = 'user') => {
    try {
      set({ loading: true, error: null });
      await setDoc(doc(db, 'users', user.uid), {
        email: user.email,
        role,
        createdAt: new Date(),
      });
      set({ role });
    } catch (error: any) {
      set({ error: error.message });
    } finally {
      set({ loading: false });
    }
  },
}));