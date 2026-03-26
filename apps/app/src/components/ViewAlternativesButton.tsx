import { useSearchParams, useNavigate } from 'react-router-dom';
import { Button } from '@workspace/ui/components/button';
import { ListFilter } from 'lucide-react';

export function ViewAlternativesButton() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const query = searchParams.get('q') ?? '';

    if (!query) return null;

    return (
        <div className="flex justify-center py-6">
            <Button
                variant="outline"
                className="gap-2 rounded-full"
                onClick={() =>
                    navigate(
                        `/search?q=${encodeURIComponent(query)}&view=alternatives`
                    )
                }
            >
                <ListFilter className="size-4" />
                View Alternative Results
            </Button>
        </div>
    );
}
