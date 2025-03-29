"use client";

import axios from "axios";
import { SessionProvider } from "next-auth/react";
import React, { ReactNode } from "react";

type Props = {
    children: ReactNode;
    session: any;
};

function ClientSession({ children, session }: Props) {
    axios.defaults.headers.common["Authorization"] =
        "Bearer " + session?.tokens?.accessToken;
    return <SessionProvider session={session}>{children}</SessionProvider>;
}

export default ClientSession;
