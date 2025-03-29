import SigninForm from "@/forms/signin/signin";
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

function SigninPage({}: Props) {
    return (
        <Box mx="auto" maw={400} mt={50}>
            <Title component="div" mb="sm">
                Login to your account
            </Title>
            <Text mb="xl">Enter your credentials to access your account</Text>
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
            <SigninForm />
            <Text ta="center" mt="xl">
                Not a member?&nbsp;
                <Anchor component={Link} href="/auth/register">
                    Create Account
                </Anchor>
            </Text>
        </Box>
    );
}

export default SigninPage;
