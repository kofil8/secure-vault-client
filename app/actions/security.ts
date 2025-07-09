export async function fetchSecurityStatus() {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/security-status`,
      {
        method: "GET",
        credentials: "include",
      }
    );

    const data = await res.json();

    if (!res.ok) {
      return {
        success: false,
        message: data.message || "Failed to fetch security status",
        data: null,
      };
    }

    return {
      success: true,
      message: data.message,
      data: data.data,
    };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return {
      success: false,
      message,
      data: null,
    };
  }
}

export async function updateSecurityAnswers(
  questions: string[],
  answers: string[]
) {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/set-security`,
      {
        method: "POST",
        credentials: "include", // 👈 important for cookie-based auth
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ questions, answers }),
      }
    );

    const data = await res.json();

    if (!res.ok) {
      return {
        success: false,
        message: data.message || "Failed to update security questions",
      };
    }

    return {
      success: true,
      message: data.message,
    };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return {
      success: false,
      message,
    };
  }
}
