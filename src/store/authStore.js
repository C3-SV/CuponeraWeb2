import { create } from "zustand";
import { supabase } from "../lib/supabaseClient";
import { fetchCurrentSessionProfile } from "../features/auth/sessionService";

let initializePromise = null;
let authSubscription = null;

export const useAuthStore = create((set) => ({
  session: null,
  profile: null,
  loading: true,
  profileLoading: false,

  setSession: (session) => set({ session }),

  applySession: async (session) => {
    if (!session) {
      set({
        session: null,
        profile: null,
        loading: false,
        profileLoading: false,
      });
      return;
    }

    set({
      session,
      profileLoading: true,
      loading: true,
    });

    try {
      const data = await fetchCurrentSessionProfile(session.access_token);
      const profile = data?.profile ?? null;

      if (profile?.is_active === false || profile?.deleted_at) {
        await supabase.auth.signOut();
        set({
          session: null,
          profile: null,
          loading: false,
          profileLoading: false,
        });
        return;
      }

      set({
        session,
        profile,
        loading: false,
        profileLoading: false,
      });
    } catch (error) {
      console.error("No se pudo cargar el perfil autenticado:", error);
      set({
        session,
        profile: null,
        loading: false,
        profileLoading: false,
      });
    }
  },

  initialize: async () => {
    if (initializePromise) {
      return initializePromise;
    }

    initializePromise = (async () => {
      const { data } = await supabase.auth.getSession();
      await useAuthStore.getState().applySession(data.session);

      if (!authSubscription) {
        const { data: listener } = supabase.auth.onAuthStateChange(
          (_event, nextSession) => {
            void useAuthStore.getState().applySession(nextSession);
          },
        );
        authSubscription = listener.subscription;
      }
    })();

    try {
      await initializePromise;
    } finally {
      initializePromise = null;
    }
  },

  refreshProfile: async () => {
    const session = useAuthStore.getState().session;
    if (!session) return null;

    const data = await fetchCurrentSessionProfile(session.access_token);
    const profile = data?.profile ?? null;
    set({ profile });
    return profile;
  },
  
   logout: async () => {
    await supabase.auth.signOut();
    set({ session: null, profile: null, loading: false, profileLoading: false });
  },
}));
