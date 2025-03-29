import { auth } from "@/auth";
import { Paper } from "@mantine/core";

export default async function Home() {
    const session = await auth();
    return (
        <Paper p="sm" pt="xl" radius="md" flex={1}>
            {/* {JSON.stringify(session, null, 2)} */}
        </Paper>
    );
}
