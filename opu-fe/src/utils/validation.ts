export function validateEmail(value: string): string {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!value.trim()) return "";
    if (!emailRegex.test(value)) return "이메일 형식에 맞게 입력해주세요.";
    return "";
}
