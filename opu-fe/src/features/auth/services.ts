// auth/services.ts

// --- 회원가입용 인증 이메일 전송 ---
export async function requestSignupEmail(payload: {
  email: string;
  password: string;
  nickname: string;
}) {
  const res = await fetch("/api/signup/request-email", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const msg = await res.text().catch(() => "");
    throw new Error(msg || "요청 실패");
  }

  return { ok: true };
}

// 이메일 검증
export function validateEmail(value: string): string {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!value.trim()) return "";
  if (!emailRegex.test(value)) return "이메일 형식에 맞게 입력해주세요.";
  return "";
}
