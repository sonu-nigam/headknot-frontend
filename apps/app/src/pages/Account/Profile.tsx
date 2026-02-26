import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@workspace/ui/components/card';
import { ProfileForm } from '@/forms/Account/ProfileForm';
import { useQuery } from '@tanstack/react-query';
import { profileQueryOptions } from '@/query/options/profile';

export function Profile() {
    const { data: profile, isLoading } = useQuery(profileQueryOptions);

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
