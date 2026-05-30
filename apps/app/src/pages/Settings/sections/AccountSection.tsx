import { $api } from '@workspace/api-client';
import { ProfileForm } from '@/forms/Account/ProfileForm';
import { SettingsSection } from '../components/SettingsSection';
import {
    SectionError,
    SectionSkeleton,
} from '../components/SectionStates';

export function AccountSection() {
    const {
        data: profile,
        isLoading,
        isError,
        refetch,
    } = $api.useQuery('get', '/profile/me');

    if (isLoading) return <SectionSkeleton rows={5} />;
    if (isError || !profile) {
        return (
            <SectionError
                message="Couldn't load your profile."
                onRetry={() => refetch()}
            />
        );
    }

    return (
        <SettingsSection
            title="Profile"
            description="Update your personal information."
        >
            <ProfileForm profile={profile} />
        </SettingsSection>
    );
}
