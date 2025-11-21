export default function AfterLoginLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="app-page flex flex-col">
            <main className="app-container pt-app-header pb-40 px-6 mt-8">
                {children}
            </main>
        </div>
    );
}
