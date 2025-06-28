export async function getSecurityQuestions(email: string) {
  const url = `${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/forgot-password`;

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });

    const data = await res.json();

    if (!res.ok) {
      return {
        success: false,
        message:
          data.message ||
          data.errorMessages?.[0]?.message ||
          "Failed to fetch security questions",
      };
    }

    return data;
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "An unknown error occurred";
    console.error("getSecurityQuestions error:", message);
    return { success: false, message };
  }
}

export async function verifyAnswers(email: string, answers: string[]) {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/verify-answers`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, answers }),
      }
    );

    const data = await res.json();

    if (!res.ok) {
      console.log("verifyAnswers error response:", data);
      return {
        success: false,
        message:
          data.message ||
          data.errorMessages?.[0]?.message ||
          "Verification failed",
      };
    }

    return data;
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "An unexpected error occurred";
    console.error("verifyAnswers fetch error:", message);
    return {
      success: false,
      message,
    };
  }
}

export async function resetPassword(token: string, newPassword: string) {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/reset-password`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ newPassword }),
      }
    );

    const data = await res.json();

    if (!res.ok) {
      return {
        success: false,
        message:
          data.message ||
          data.errorMessages?.[0]?.message ||
          "Failed to reset password",
      };
    }

    return data;
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "An unexpected error occurred";
    console.error("resetPassword error:", message);
    return { success: false, message };
  }
}
