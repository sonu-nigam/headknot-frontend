import AppLayout from '@/components/AppLayout';
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from '@workspace/ui/components/tabs';
import { Profile } from './Profile';
import { Workspace } from './Workspace';
import { Settings } from './Settings';

export function AccountPage() {
    return (
        <AppLayout>
            <div className="flex flex-col items-center h-full">
                <Tabs defaultValue="profile" className="w-[600px]">
                    <TabsList className="grid w-full grid-cols-3">
                        <TabsTrigger value="profile">Profile</TabsTrigger>
                        <TabsTrigger value="workspace">Workspace</TabsTrigger>
                        <TabsTrigger value="settings">Settings</TabsTrigger>
                    </TabsList>
                    <TabsContent value="profile">
                        <Profile />
                    </TabsContent>
                    <TabsContent value="workspace">
                        <Workspace />
                    </TabsContent>
                    <TabsContent value="settings">
                        <Settings />
                    </TabsContent>
                </Tabs>
            </div>
        </AppLayout>
    );
}
