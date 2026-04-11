import {
    BadgeCheckIcon,
    BellIcon,
    ChevronsUpDownIcon,
    CreditCardIcon,
    LogOutIcon,
    SparklesIcon,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

import {
    Avatar,
    AvatarFallback,
    AvatarImage,
} from '@workspace/ui/components/avatar';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@workspace/ui/components/dropdown-menu';
import {
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    useSidebar,
} from '@workspace/ui/components/sidebar';
import { $api } from '@workspace/api-client';
import { useLogout } from '@/hooks/auth/useLogout';

export function SidebarUser() {
    const { isMobile } = useSidebar();
    const { data: userProfileData } = $api.useQuery("get", "/profile/me");
    const logout = useLogout();
    const navigate = useNavigate();

    const onLogout = () => {
        logout.mutate(undefined, {
            onSettled: () => {
                window.location.href = '/login';
            },
        });
    };

    return (
        <SidebarMenu>
            <SidebarMenuItem>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <SidebarMenuButton
                            size="lg"
                            className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                        >
                            <Avatar className="h-8 w-8 rounded-lg">
                                <AvatarImage
                                    src={userProfileData?.avatarUrl}
                                    alt={userProfileData?.fullName}
                                />
                                <AvatarFallback className="rounded-lg">
                                    {userProfileData?.firstName?.charAt(0)}
                                    {userProfileData?.lastName?.charAt(0)}
                                </AvatarFallback>
                            </Avatar>
                            <div className="grid flex-1 text-left text-sm leading-tight">
                                <span className="truncate font-medium">
                                    {userProfileData?.fullName}
                                </span>
                                <span className="truncate text-xs">
                                    {userProfileData?.email}
                                </span>
                            </div>
                            <ChevronsUpDownIcon className="ml-auto size-4" />
                        </SidebarMenuButton>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                        className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
                        side={isMobile ? 'bottom' : 'right'}
                        align="end"
                        sideOffset={4}
                    >
                        <DropdownMenuLabel className="p-0 font-normal">
                            <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                                <Avatar className="h-8 w-8 rounded-lg">
                                    <AvatarImage
                                        src={userProfileData?.avatarUrl}
                                        alt={userProfileData?.fullName}
                                    />
                                    <AvatarFallback className="rounded-lg">
                                        {userProfileData?.firstName?.charAt(0)}
                                        {userProfileData?.lastName?.charAt(0)}
                                    </AvatarFallback>
                                </Avatar>
                                <div className="grid flex-1 text-left text-sm leading-tight">
                                    <span className="truncate font-medium">
                                        {userProfileData?.fullName}
                                    </span>
                                    <span className="truncate text-xs">
                                        {userProfileData?.email}
                                    </span>
                                </div>
                            </div>
                        </DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuGroup>
                            <DropdownMenuItem>
                                <SparklesIcon />
                                Upgrade to Pro
                            </DropdownMenuItem>
                        </DropdownMenuGroup>
                        <DropdownMenuSeparator />
                        <DropdownMenuGroup>
                            <DropdownMenuItem onClick={() => navigate('/account')}>
                                <BadgeCheckIcon />
                                Account
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => navigate('/billing')}>
                                <CreditCardIcon />
                                Billing
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => navigate('/notifications')}>
                                <BellIcon />
                                Notifications
                            </DropdownMenuItem>
                        </DropdownMenuGroup>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={onLogout}>
                            <LogOutIcon />
                            Log out
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </SidebarMenuItem>
        </SidebarMenu>
    );
}
