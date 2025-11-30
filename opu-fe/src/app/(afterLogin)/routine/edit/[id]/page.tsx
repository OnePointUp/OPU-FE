import RoutineEditPage from "@/features/routine/pages/RoutineEditPage";
import { notFound } from "next/navigation";

type PageProps = {
    params: Promise<{ id: string }>;
};

export default async function Page({ params }: PageProps) {
    const { id } = await params;
    const idNum = Number(id);

    console.log("Routine page params.id =", id, "idNum =", idNum);

    if (Number.isNaN(idNum)) {
        notFound();
    }

    return <RoutineEditPage id={idNum} />;
}
