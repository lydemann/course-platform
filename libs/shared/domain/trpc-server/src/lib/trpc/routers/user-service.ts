import { authClient } from '../context';
import { supbaseAdmin } from '../supabase-admin';

export interface CreateUserResponseDTO {
  email: string;
  idToken: string;
  localId: string;
  expiresIn: string;
  refreshToken: string;
}

// get active campaign users who are students
export const getACUsers = (): Promise<{
  contacts: { email: string; firstName: string; lastName: string }[];
}> => {
  const options = {
    method: 'GET',
    headers: {
      'Api-Token': import.meta.env.AC_API_TOKEN,
      'Content-Type': 'application/json',
    },
  };

  const studenListId = 11;

  return fetch(
    `${
      import.meta.env.AC_ORIGIN
    }/api/3/contacts?listid=${studenListId}&limit=0`,
    options
  ).then(async (response) => await response.json());
};

// create firebase auth user
export const createUser = async (email: string, password: string) => {
  console.log('Creating user', email, password);
  return supbaseAdmin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
  });
};
