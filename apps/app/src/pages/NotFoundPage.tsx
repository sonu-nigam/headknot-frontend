import { Button } from '@workspace/ui/components/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@workspace/ui/components/card';
import { useNavigate } from 'react-router-dom';
import { AppHeader } from '@/components/app-header';

export default function NotFoundPage() {
    const navigate = useNavigate();

    return (
        <>
            <AppHeader
                breadcrumbs={[
                    { label: 'Home', href: '/' },
                    { label: '404 Not Found' },
                ]}
            />
            <div className="flex items-center justify-center min-h-screen bg-background px-4">
                <Card className="max-w-md w-full p-6 text-center">
                    <CardHeader>
                        <CardTitle className="text-6xl font-extrabold text-destructive">
                            404
                        </CardTitle>
                        <CardDescription className="mb-4">
                            Oops! The page you are looking for does not exist.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Button variant="outline" onClick={() => navigate('/')}>
                            Go Back Home
                        </Button>
                    </CardContent>
                </Card>
            </div>
        </>
    );
}
