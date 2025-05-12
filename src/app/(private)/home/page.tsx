import { auth } from "@/auth";
import { Paper } from "@mantine/core";

export default async function Home() {
    const session = await auth();
    return <Paper radius={0}>kdjkd</Paper>;
    /* {JSON.stringify(session, null, 2)} */
}
