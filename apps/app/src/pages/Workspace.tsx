import AppLayout from '@/components/AppLayout';

export default function Workspace() {
    return (
        <AppLayout
            breadcrumbs={[{ label: 'Workspace', href: '/' }, { label: 'Settings' }]}
        >
            <div>workspace</div>;
        </AppLayout>
    );
}
