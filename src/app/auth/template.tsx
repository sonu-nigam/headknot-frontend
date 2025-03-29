import { Paper } from "@mantine/core";
import React, { ReactNode } from "react";

type Props = {
    children: ReactNode;
};

function AuthTemplate({ children }: Props) {
    return <Paper>{children}</Paper>;
}

export default AuthTemplate;
