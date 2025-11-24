export default function AfterLoginLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="app-page flex flex-col overflow-hidden">
            <main className="app-container px-6 pt-22 overflow-hidden overscroll-none">
                {children}
            </main>
        </div>
    );
}
