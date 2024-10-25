export async function verifyCode(userId, code) {
  const response = await fetch("/api/verify-code", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ userId, code }),
  });
  const data = await response.json();
  return data;
}
