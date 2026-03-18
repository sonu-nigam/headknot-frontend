import { format } from "date-fns";

interface MemoryVersion {
    id: string;
    version: number;
    timestamp: Date;
    title: string;
    preview: string;
}

export function Timeline() {
    // Sample memory versions - replace with actual data from API
    const versions: MemoryVersion[] = [
        {
            id: "v3",
            version: 3,
            timestamp: new Date(Date.now()),
            title: "Project Planning",
            preview: "Final version with all updates..."
        },
        {
            id: "v2",
            version: 2,
            timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
            title: "Project Planning",
            preview: "Updated with new requirements..."
        },
        {
            id: "v1",
            version: 1,
            timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3), // 3 days ago
            title: "Project Planning",
            preview: "Initial version..."
        },
    ];

    return (
        <div className="flex flex-col gap-4 py-4">
            {versions.map((version, index) => (
                <div key={version.id} className="relative">
                    {/* Timeline line */}
                    {index !== versions.length - 1 && (
                        <div className="absolute left-4 top-10 h-8 w-0.5 bg-border" />
                    )}

                    {/* Version item */}
                    <div className="flex gap-4">
                        {/* Timeline dot */}
                        <div className="flex flex-col items-center">
                            <div className="size-9 rounded-full bg-primary border-4 border-background flex items-center justify-center text-xs font-semibold text-primary-foreground">
                                {version.version}
                            </div>
                        </div>

                        {/* Version content */}
                        <div className="flex-1 pb-4">
                            <button className="w-full text-left hover:opacity-70 transition-opacity">
                                <div className="flex flex-col gap-1">
                                    <time className="text-xs text-muted-foreground">
                                        {format(version.timestamp, "MMM dd, yyyy 'at' HH:mm")}
                                    </time>
                                    <p className="text-sm font-medium">
                                        {version.title}
                                    </p>
                                    <p className="text-xs text-muted-foreground line-clamp-2">
                                        {version.preview}
                                    </p>
                                </div>
                            </button>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}
