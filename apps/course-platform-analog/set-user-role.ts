import { createClient } from '@supabase/supabase-js';

// Replace with your own values
const SUPABASE_URL = process.env['VITE_SUPABASE_URL'] as string;
const SERVICE_ROLE_KEY = process.env['SUPABASE_SERVICE_ROLE_KEY'] as string;

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY);

const userId = process.argv[2];

async function updateUserRole() {
  const { data, error } = await supabase.auth.admin.updateUserById(userId, {
    user_metadata: {
      user_role: 'admin',
    },
  });

  if (error) {
    console.error('Failed to update user:', error);
  } else {
    console.log('User updated successfully:', data);
  }
}

updateUserRole();
