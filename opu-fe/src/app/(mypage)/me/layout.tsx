export default function MyPageLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <section className="min-h-screen bg-white px-5">{children}</section>;
}
