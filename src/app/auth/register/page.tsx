import RegisterForm from "@/forms/register/register";
import {
    Anchor,
    Box,
    Button,
    Divider,
    Text,
    ThemeIcon,
    Title,
} from "@mantine/core";
import { IconBrandGoogleFilled } from "@tabler/icons-react";
import Link from "next/link";
import React from "react";

type Props = {};

function LoginPage({}: Props) {
    return (
        <Box mx="auto" maw={400} mt={50}>
            <Title component="div" mb="sm">
                Create your account
            </Title>
            <Text mb="xl">Enter the fields below to get started</Text>
            <Button
                variant="default"
                fullWidth
                mb="md"
                leftSection={
                    <ThemeIcon variant="transparent">
                        <IconBrandGoogleFilled />
                    </ThemeIcon>
                }
            >
                Continue with Google
            </Button>
            <Divider label="OR" />
            <RegisterForm />
            <Text ta="center" mt="xl">
                Already a member?&nbsp;
                <Anchor component={Link} href="/auth/signin">
                    Log in
                </Anchor>
            </Text>
        </Box>
    );
}

export default LoginPage;
