import React from "react";

type Props = {};

export default function Root({}: Props) {
    return <div>Root Page {process.env.NEXT_PUBLIC_API_BASE_URL}</div>;
}
