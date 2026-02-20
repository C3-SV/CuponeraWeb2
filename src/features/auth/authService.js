import { supabase } from "../../lib/supabaseClient";

// registro
export const registerUser = async (email, password, name, lastname, phone, dui, address) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        name: name,
        lastname: lastname,
        phone: phone,
        dui: dui,
        address: address,
      },
    },
  });

  if (error) throw error;
  return data;
};

//login
export const loginUser = async (email, password) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) throw error;
  return data;
};

//logout
export const logoutUser = async () => {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
};
