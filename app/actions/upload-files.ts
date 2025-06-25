'use server';

import { revalidatePath } from 'next/cache';

export async function uploadFiles(formData: FormData) {
  const files = formData.getAll('files') as File[];

  const uploadForm = new FormData();
  files.forEach((file) => {
    uploadForm.append('files', file); // 'files' matches Express field name
  });

  const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/image/multiple`, {
    method: 'POST',
    body: uploadForm,
    credentials: 'include',
    cache: 'no-store',
  });

  
  console.log("result", res);
  if (!res.ok) {
      const error = await res.json();
      throw new Error(error.message || 'Upload failed');
    }
    
    const result = await res.json();
  revalidatePath('/'); // optional
  return result;
}
