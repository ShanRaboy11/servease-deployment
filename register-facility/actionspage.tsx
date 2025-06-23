'use server';

import { redirect } from 'next/navigation';
import { type SignUpWithPasswordCredentials } from '@supabase/supabase-js';
import { createClient } from '../utils/supabase/server';

interface facilityProfileData {
  user_id: string;
  owner_name: string;
  facility_name: string;
  location: string;
  category: string;
  specific_category: string;
  working_days: string[]; 
  start_time: string;    
  end_time: string;      
}

export async function loginCredentials(formData: FormData): Promise<void> {
  console.log("--- SIGNUP SERVER ACTION RUNNING ---");
  
  const supabase = await createClient();

  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  if (!email || !password) {
    return redirect('/your-signup-page-url?message=Email and password are required.');
  }
  if (password.length < 8) {
    return redirect('/your-signup-page-url?message=Password must be at least 8 characters.');
  }

  const credentials: SignUpWithPasswordCredentials = {
    email,
    password,
  };

  const { data, error } = await supabase.auth.signUp(credentials);

  if (error) {
    console.error('--- SUPABASE SIGNUP ERROR ---', error.message);
    return redirect(`/your-signup-page-url?message=Could not create account. ${encodeURIComponent(error.message)}`);
  }

  if (data.user) {
    console.log('User created. User ID: ', data.user.id);
    const { data: { user: sessionUser }} = await supabase.auth.getUser();
    console.log("Session user id: ", sessionUser?.id);
  }

  console.log("SUCCESS! User account created. Redirecting to profile setup.");
}


function convertTo24HourFormat(time12h: string): string {
  if (!time12h) return '';

  const [time, modifier] = time12h.split(' ');
  let [hours, minutes] = time.split(':');

  if (hours === '12') {
    hours = modifier === 'AM' ? '00' : '12';
  } else if (modifier === 'PM') {
    hours = String(parseInt(hours, 10) + 12);
  }

  // Ensure hours are two digits (e.g., '09')
  const formattedHours = hours.padStart(2, '0');

  return `${formattedHours}:${minutes}:00`;
}

export async function facilityProfile(formData: FormData): Promise<void> {
  console.log("--- PROFILE SERVER ACTION RUNNING ---");

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    console.error("User is not authenticated. Cannot create profile.");
    const { data: { user: sessionUser } } = await supabase.auth.getUser();
    console.error("Session user: ", sessionUser?.id);
  }
  
  console.log("Authenticated user found:", user.id);

  const ownerName = formData.get('owner_name') as string;
  const facilityName = formData.get('facility_name') as string;
  const fac_location = formData.get('facility_location') as string;
  const selectedCategory = formData.get('category') as string;
  const specificCategory = formData.get('specific_category') as string;
  const workingDaysJSON = formData.get('working_days') as string; 
  const startTime12h = formData.get('start_time') as string;     
  const endTime12h = formData.get('end_time') as string;        

  if (!ownerName?.trim() || !facilityName?.trim() || !fac_location.trim() || 
      !selectedCategory.trim() || !specificCategory.trim() || !workingDaysJSON ||
      !startTime12h || !endTime12h) {
    console.log("VALIDATION FAILED: Required profile fields missing.");
    return redirect('/register-client?error=missing_fields');
  }

  const parsedWorkingDays = JSON.parse(workingDaysJSON);

  const formattedStartTime = convertTo24HourFormat(startTime12h);
  const formattedEndTime = convertTo24HourFormat(endTime12h);

  const profileData: facilityProfileData = {
    user_id: user.id,
    owner_name: ownerName.trim(),
    facility_name: facilityName.trim(),
    location: fac_location,
    category: selectedCategory,
    specific_category: specificCategory,
    working_days: parsedWorkingDays, 
    start_time: formattedStartTime, 
    end_time: formattedEndTime      
  };
  
  console.log("Data to insert:", profileData);

  const { error } = await supabase
    .from('facility_initial_profile')
    .insert(profileData);

  if (error) {
    console.error('--- SUPABASE PROFILE INSERT ERROR ---', error);
    return redirect(`/register-facility?error=database_error&message=${encodeURIComponent(error.message)}`);
  }

  console.log("SUCCESS! Profile created for user:", user.id);
}

type FormResult = {
  success?: string;
  error?: string;
};

export async function uploadDocument(formData: FormData): Promise<FormResult> {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return { error: 'You must be logged in to upload documents.' };
  }

  const file = formData.get('document') as File;
  const documentType = formData.get('documentType') as string;

  if (!file || file.size === 0) {
    return { error: 'No file was provided.' };
  }
  if (!documentType) {
    return { error: 'Document type is missing.' };
  }
  

  const fileExtension = file.name.split('.').pop();
  const fileName = `${crypto.randomUUID()}.${fileExtension}`;
  const filePath = `${user.id}/${fileName}`;

  const { error: storageError } = await supabase.storage
    .from('documents') 
    .upload(filePath, file);

  if (storageError) {
    console.error('Storage Error:', storageError);
    return { error: `Failed to upload file: ${storageError.message}` };
  }

  const { error: dbError } = await supabase
    .from('facility_documents')
    .insert({
      user_id: user.id,
      document_type: documentType,
      file_path: filePath,
      file_name: file.name, 
    });

  if (dbError) {
    console.error('Database Error:', dbError);
    await supabase.storage.from('documents').remove([filePath]);
    return { error: `Failed to save document record: ${dbError.message}` };
  }
  
  return { success: `Successfully uploaded ${file.name}!` };
}

export async function facilityContact(formData: FormData): Promise<void> {
  console.log("--- ADD CONTACT & COMPLETE PROFILE ACTION ---");

  const supabase = await createClient();

  const { data, error: authError } = await supabase.auth.getUser();

  if (authError || !data?.user) {
    console.error("User is not authenticated or there was an auth error:", authError);
    return redirect('/login?error=You must be logged in to complete your profile.');
  }

  const user = data.user;
  console.log("Authenticated user found:", user.id);

  const contactNumber = formData.get('contact_number') as string;

  if (!contactNumber?.trim()) {
    console.error("Validation FAILED: Contact number is missing.");
    return redirect('/register-contact?error=missing_contact_number');
  }

  console.log(`Fetching initial profile for user_id: ${user.id}`);
  const { data: initialProfile, error: fetchError } = await supabase
    .from('facility_initial_profile') 
    .select('*')
    .eq('user_id', user.id) 
    .single(); 

  if (fetchError || !initialProfile) {
    console.error('Could not find initial profile for user or fetch error:', fetchError);
    return redirect('/register-client?error=initial_profile_not_found'); 
  }

  console.log("Found initial profile data:", initialProfile);

  const completeProfileData = {
    ...initialProfile, 
    contact: contactNumber.trim(), 
    user_id: user.id 
  };
  
  delete completeProfileData.id; 
  delete completeProfileData.created_at; 

  console.log("Data to insert into final table:", completeProfileData);

  const { error: insertError } = await supabase
    .from('service_providers') 
    .insert(completeProfileData);

  if (insertError) {
    console.error('--- SUPABASE FINAL INSERT ERROR ---', insertError);
    return redirect(`/register-contact?error=database_insert_error&code=${insertError.code}`);
  }

  const { error: deleteError } = await supabase
    .from('facility_initial_profile')
    .delete()
    .eq('user_id', user.id);

  if (deleteError) {
    console.error('--- SUPABASE DELETE ERROR ---', deleteError);
  } else {
    console.log(`Successfully deleted initial profile for user_id: ${user.id}`);
  }

  console.log("SUCCESS! User registration fully completed for:", user.id);
  redirect('/login'); 
}