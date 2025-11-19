export default function AfterLoginLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex flex-col min-h-[100svh]">
            <main className="flex-1">{children}</main>
        </div>
    );
}
