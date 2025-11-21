import OpuEditPage from "@/features/opu/pages/OpuEditPage";

type Props = {
    params: Promise<{ id: string }>;
};

export default async function Page({ params }: Props) {
    const { id } = await params;
    const numericId = Number(id);

    return <OpuEditPage id={numericId} />;
}
