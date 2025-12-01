export function validateEmail(value: string): string {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!value.trim()) return "";
    if (!emailRegex.test(value)) return "이메일 형식에 맞게 입력해주세요.";
    return "";
}

export async function checkNicknameDup(
    nickname: string,
    currentNickname?: string
): Promise<boolean> {
    const q = encodeURIComponent(nickname.trim());
    const cur = encodeURIComponent(currentNickname?.trim() ?? "");
    const url = `/api/nickname/check?nickname=${q}&current=${cur}`;
    const res = await fetch(url);
    const data = await res.json();
    return data.exists;
}
