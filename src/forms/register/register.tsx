"use client";

import { Button, Group, PasswordInput, Text, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import React from "react";
import { signIn } from "next-auth/react";
import { registerUser } from "@/services/auth";

type Props = {};

function RegisterForm({}: Props) {
    const form = useForm({
        mode: "uncontrolled",
        initialValues: {
            fullName: "",
            email: "",
            password: "",
        },
        validate: {
            fullName: (value) =>
                /^[A-Za-z]+([ '-][A-Za-z]+)*$/.test(value)
                    ? null
                    : "Invalid name",
            email: (value) =>
                /^\S+@\S+$/.test(value) ? null : "Invalid email",
        },
    });

    const onSubmit = async (values: typeof form.values) => {
        try {
            const { data, status } = await registerUser({
                fullName: values.fullName,
                email: values.email,
                password: values.password,
            });
            if (status === 200) {
                signIn("credentials", {
                    redirectTo: "/",
                    email: values.email,
                    password: values.password,
                });
            }
        } catch (e) {
            console.error(e);
        }
    };

    return (
        <form onSubmit={form.onSubmit(onSubmit)}>
            <TextInput
                label="Full Name"
                placeholder="Enter Full Name"
                key={form.key("fullName")}
                mb="sm"
                {...form.getInputProps("fullName")}
            />
            <TextInput
                label="Email"
                placeholder="your@email.com"
                key={form.key("email")}
                mb="sm"
                {...form.getInputProps("email")}
            />
            <PasswordInput
                label="Password"
                placeholder="Password"
                key={form.key("password")}
                mb="xl"
                {...form.getInputProps("password")}
            />
            <Button type="submit" fullWidth>
                Submit
            </Button>
        </form>
    );
}

export default RegisterForm;
