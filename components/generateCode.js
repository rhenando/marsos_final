export async function generateCode(userId) {
  const response = await fetch("/api/generate-code", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ userId }),
  });
  const data = await response.json();
  return data;
}
