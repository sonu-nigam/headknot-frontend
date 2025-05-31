import React from "react";

type Props = {};

export default function Root({}: Props) {
    return <div>Root Page{process.env.AUTH_SECRET}</div>;
}
