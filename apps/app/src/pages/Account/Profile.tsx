import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@workspace/ui/components/card';
import { ProfileForm } from '@/forms/Account/ProfileForm';
import { $api } from '@workspace/api-client';

export function Profile() {
    const { data: profile, isLoading } = $api.useQuery("get", "/profile/me");

    return (
        <Card>
            <CardHeader>
                <CardTitle>Profile</CardTitle>
                <CardDescription>
                    Update your profile information.
                </CardDescription>
            </CardHeader>
            <CardContent>
                {isLoading ? (
                    <div>Loading...</div>
                ) : profile ? (
                    <ProfileForm profile={profile} />
                ) : (
                    <div>Failed to load profile</div>
                )}
            </CardContent>
        </Card>
    );
}
