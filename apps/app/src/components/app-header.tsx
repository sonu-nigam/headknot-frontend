import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from '@workspace/ui/components/breadcrumb';
import { Button } from '@workspace/ui/components/button';
import { Separator } from '@workspace/ui/components/separator';
import { SidebarTrigger } from '@workspace/ui/components/sidebar';
import { BellIcon, Moon, Search, Sun } from 'lucide-react';
import { useTheme } from './theme-provider';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@workspace/ui/components/dropdown-menu';
import { Fragment } from 'react/jsx-runtime';

type BreadcrumbItem = {
    label: string;
    href?: string;
};

type AppHeaderProps = {
    breadcrumbs?: BreadcrumbItem[];
};

export function AppHeader({ breadcrumbs }: AppHeaderProps) {
    const { theme, setTheme, toggleTheme } = useTheme();

    return (
        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 sticky top-0 bg-background z-[1]">
            <div className="flex w-full items-center gap-2 px-4">
                <SidebarTrigger className="-ml-1" />
                <Separator
                    orientation="vertical"
                    className="mr-2 data-[orientation=vertical]:h-4"
                />
                {breadcrumbs && breadcrumbs.length > 0 && (
                    <Breadcrumb>
                        <BreadcrumbList className="max-w-full overflow-x-auto">
                            {breadcrumbs.map((item, index) => (
                                <Fragment key={item.label}>
                                    <BreadcrumbItem>
                                        {item.href ? (
                                            <BreadcrumbLink href={item.href}>
                                                {item.label}
                                            </BreadcrumbLink>
                                        ) : (
                                            <BreadcrumbPage>
                                                {item.label}
                                            </BreadcrumbPage>
                                        )}
                                    </BreadcrumbItem>
                                    {index < breadcrumbs.length - 1 && (
                                        <BreadcrumbSeparator />
                                    )}
                                </Fragment>
                            ))}
                        </BreadcrumbList>
                    </Breadcrumb>
                )}
                <div className="ml-auto flex items-center gap-2">
                    {/*<Button
                        variant="ghost"
                        type="button"
                        className="hidden sm:flex"
                    >
                        <Search />
                        <a
                            href="https://github.com/shadcn-ui/ui/tree/main/apps/v4/app/(examples)/dashboard"
                            rel="noopener noreferrer"
                            target="_blank"
                            className="dark:text-foreground"
                        >
                            Search
                        </a>
                    </Button>*/}
                    <Button variant="ghost">
                        <BellIcon />
                    </Button>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline" size="icon">
                                <Sun className="h-[1.2rem] w-[1.2rem] scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90" />
                                <Moon className="absolute h-[1.2rem] w-[1.2rem] scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0" />
                                <span className="sr-only">Toggle theme</span>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => setTheme('light')}>
                                Light
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => setTheme('dark')}>
                                Dark
                            </DropdownMenuItem>
                            <DropdownMenuItem
                                onClick={() => setTheme('system')}
                            >
                                System
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>
        </header>
    );
}
