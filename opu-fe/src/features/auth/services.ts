// 이메일 검증
export function validateEmail(value: string): string {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!value.trim()) return "";
  if (!emailRegex.test(value)) return "이메일 형식에 맞게 입력해주세요.";
  return "";
}

const API_BASE = process.env.NEXT_PUBLIC_API_BASE?.replace(/\/$/, "");

export async function requestEmailSignup(payload: {
  email: string;
  password: string;
  nickname: string;
}) {
  await new Promise((r) => setTimeout(r, 500));

  /*
  const url = `${API_BASE}/auth/signup/email`;
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
s
  if (!res.ok) {
    const msg = await res.text().catch(() => "회원가입 실패");
    throw new Error(msg);
  }
  */

  return { ok: true };
}

// 이메일 인증 메일 재전송
export async function resendVerificationEmail() {
  await new Promise((r) => setTimeout(r, 1000));

  /*
  const url = `${API_BASE}/auth/signup/resend-email`;

  const res = await fetch(url, { method: "POST" });

  if (!res.ok) {
    const msg = await res.text().catch(() => "재전송 실패");
    throw new Error(msg);
  }
  */

  return { ok: true };
}

// 로그인 API (현재 Mock)
export async function login(payload: { email: string; password: string }) {
  await new Promise((r) => setTimeout(r, 500)); // Mock

  /*
  const url = `${API_BASE}/auth/login`;
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const msg = await res.text().catch(() => "로그인 실패");
    throw new Error(msg);
  }
  */

  return { ok: true };
}

// 비밀번호 찾기: 이메일로 재설정 링크 전송 
export async function requestPasswordReset(email: string) {
  await new Promise((r) => setTimeout(r, 600)); // Mock

  /*
  const url = `${API_BASE}/auth/password/reset-request`;
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email }),
  });

  if (!res.ok) {
    const msg = await res.text().catch(() => "이메일 전송 실패");
    throw new Error(msg);
  }
  */

  return { ok: true };
}

// 비밀번호 찾기 이메일 재전송
export async function resendPasswordEmail() {
  await new Promise((r) => setTimeout(r, 800)); // mock

  /*
  const url = `${API_BASE}/auth/password/reset-resend`;
  const res = await fetch(url, { method: "POST" });

  if (!res.ok) {
    const msg = await res.text().catch(() => "재전송 실패");
    throw new Error(msg);
  }
  */

  return { ok: true };
}
