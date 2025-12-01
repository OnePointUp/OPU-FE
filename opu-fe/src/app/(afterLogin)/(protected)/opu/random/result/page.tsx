import RandomResultPage from "@/features/opu/pages/RandomResultPage";

type PageProps = {
    searchParams: {
        scope?: string;
        time?: string;
    };
};

export default function Page({ searchParams }: PageProps) {
    return <RandomResultPage searchParams={searchParams} />;
}
