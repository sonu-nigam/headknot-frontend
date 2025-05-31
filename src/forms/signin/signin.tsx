"use client";
import {
    Button,
    Group,
    PasswordInput,
    Text,
    TextInput,
    Title,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import React from "react";
import { signIn } from "next-auth/react";

type Props = {};

function SigninForm({}: Props) {
    const form = useForm({
        mode: "uncontrolled",
        initialValues: {
            email: "",
        },
        validate: {
            email: (value) =>
                /^\S+@\S+$/.test(value) ? null : "Invalid email",
        },
    });

    const onSubmit = (values: typeof form.values) => {
        signIn("credentials", {
            redirectTo: "/",
            ...values,
        });
    };

    return (
        <form onSubmit={form.onSubmit(onSubmit)}>
            <TextInput
                label="Email"
                placeholder="your@email.com"
                key={form.key("email")}
                mb="sm"
                autoComplete="off"
                {...form.getInputProps("email")}
            />
            <PasswordInput
                label="Password"
                placeholder="Password"
                mb="md"
                key={form.key("password")}
                {...form.getInputProps("password")}
            />
            <Button type="submit" mt="xl" fullWidth>
                Sign in
            </Button>
        </form>
    );
}

export default SigninForm;
