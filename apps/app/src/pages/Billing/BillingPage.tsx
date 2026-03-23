import AppLayout from '@/components/AppLayout';
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from '@workspace/ui/components/tabs';
import { Plans } from './Plans';
import { Subscription } from './Subscription';
import { Usage } from './Usage';

export function BillingPage() {
    return (
        <AppLayout
            breadcrumbs={[{ label: 'Home', href: '/' }, { label: 'Billing' }]}
        >
            <div className="flex flex-col items-center h-full mt-20">
                <Tabs defaultValue="plans" className="w-[700px]">
                    <TabsList className="grid w-full grid-cols-3">
                        <TabsTrigger value="plans">Plans</TabsTrigger>
                        <TabsTrigger value="subscription">
                            Subscription
                        </TabsTrigger>
                        <TabsTrigger value="usage">Usage & Limits</TabsTrigger>
                    </TabsList>
                    <TabsContent value="plans">
                        <Plans />
                    </TabsContent>
                    <TabsContent value="subscription">
                        <Subscription />
                    </TabsContent>
                    <TabsContent value="usage">
                        <Usage />
                    </TabsContent>
                </Tabs>
            </div>
        </AppLayout>
    );
}
