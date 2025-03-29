"use client";

import { NavigationProgress, nprogress } from "@mantine/nprogress";
import { usePathname, useSearchParams } from "next/navigation";
import React, { useEffect } from "react";

type Props = {};

function RoutingTransition({}: Props) {
    const pathname = usePathname();
    const searchParams = useSearchParams();

    useEffect(() => {
        nprogress.complete();
    }, [pathname, searchParams]);

    return <NavigationProgress stepInterval={5} />;
}

export default RoutingTransition;
