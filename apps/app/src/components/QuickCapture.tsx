import { QuickCaptureForm } from '@/forms/QuickCaptureForm/QuickCaptureForm';
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from '@workspace/ui/components/tabs';

export function QuickCapture() {
    return (
        <div className="min-h-96 mt-20">
            <div className="max-w-4xl mx-auto px-3">
                <h1 className="scroll-m-20 text-center text-4xl font-extrabold tracking-tight text-balance">
                    Quick Capture
                </h1>
                <Tabs defaultValue="note" className="mt-10">
                    <TabsList className="mx-auto">
                        <TabsTrigger value="note">Note</TabsTrigger>
                        <TabsTrigger value="task">Task</TabsTrigger>
                        <TabsTrigger value="decision">Decision</TabsTrigger>
                        <TabsTrigger value="research">Research</TabsTrigger>
                        <TabsTrigger value="canvas">Canvas</TabsTrigger>
                        <TabsTrigger value="timeline">Timeline</TabsTrigger>
                        <TabsTrigger value="artifact">Artifact</TabsTrigger>
                    </TabsList>
                </Tabs>
                <QuickCaptureForm onSubmit={() => {}} />
            </div>
        </div>
    );
}
