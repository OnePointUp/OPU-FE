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
