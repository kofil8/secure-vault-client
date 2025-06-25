// 'use server';

// export const loginUser = async (payload: { email: string; password: string }) => {
//   const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/login`, {
//     method: 'POST',
//     headers: {
//       'Content-Type': 'application/json',
//     },
//     body: JSON.stringify(payload),
//     // optionally include credentials if needed
//     credentials: 'include',
//     cache: 'no-store' // prevent Next.js from caching the response
//   });

//   if (!res.ok) {
//     // Handle HTTP errors
//     const error = await res.json();
//     throw new Error(error.message || 'Login failed');
//   }

//   const data = await res.json();
//   return data;
// };
