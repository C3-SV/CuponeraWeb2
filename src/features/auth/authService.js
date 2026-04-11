import { supabase } from "../../lib/supabaseClient";

// registro
export const registerUser = async (email, password, name, lastname, phone, dui, address) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        name: name,
        first_names: name,
        lastname: lastname,
        last_names: lastname,
        phone: phone,
        dui: dui,
        address: address,
        role: "customer",
        is_active: true,
      },
    },
  });

  if (error) throw new Error(error.message);
  return data;
};

//login
export const loginUser = async (email, password) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) throw new Error(error.message);
  return data;
};

//logout
export const logoutUser = async () => {
  const { error } = await supabase.auth.signOut();
  if (error) throw new Error(error.message);
};
