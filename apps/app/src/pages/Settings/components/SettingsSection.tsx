import { AlertTriangle } from 'lucide-react';
import type { ReactNode } from 'react';
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@workspace/ui/components/card';
import { cn } from '@workspace/ui/lib/utils';

interface SettingsSectionProps {
    title: string;
    description?: string;
    footer?: ReactNode;
    children?: ReactNode;
    tone?: 'default' | 'destructive';
    className?: string;
}

export function SettingsSection({
    title,
    description,
    footer,
    children,
    tone = 'default',
    className,
}: SettingsSectionProps) {
    const isDestructive = tone === 'destructive';
    return (
        <Card
            className={cn(
                isDestructive && 'border-destructive/30',
                className,
            )}
        >
            <CardHeader>
                <CardTitle
                    className={cn(
                        'text-lg',
                        isDestructive &&
                            'flex items-center gap-2 text-destructive',
                    )}
                >
                    {isDestructive && (
                        <AlertTriangle className="size-5" aria-hidden />
                    )}
                    {title}
                </CardTitle>
                {description && (
                    <CardDescription>{description}</CardDescription>
                )}
            </CardHeader>
            {children !== undefined && <CardContent>{children}</CardContent>}
            {footer && <CardFooter>{footer}</CardFooter>}
        </Card>
    );
}
