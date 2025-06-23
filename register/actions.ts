'use server';

import { createClient } from '../lib/supabase/server';
import { redirect } from 'next/navigation';

export async function signup(formData: FormData) {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;
  const firstName = formData.get('first_name') as string;
  const lastName = formData.get('last_name') as string;

  const supabase = createClient();

  if (password.length < 6) {
    return redirect('/register?message=Password must be at least 6 characters long.');
  }

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        first_name: firstName,
        last_name: lastName,
      },
    },
  });

  if (error) {
    console.error('Sign Up Error:', error);
    
    return redirect('/register?message=Could not create account. User may already exist.');
  }

  return redirect('/confirm-email');
}