import { create } from "zustand";
import { supabase } from "../lib/supabaseClient";

export const useAuthStore = create((set) => ({
  session: null,
  loading: true,

  setSession: (session) => set({ session }),

  initialize: async () => {
    const { data } = await supabase.auth.getSession();
    set({ session: data.session, loading: false });

    supabase.auth.onAuthStateChange((_event, session) => {
      set({ session });
    });
  },
  
   logout: async () => {
    await supabase.auth.signOut();
    set({ session: null });
  },
}));
