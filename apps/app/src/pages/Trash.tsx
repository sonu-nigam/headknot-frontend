import React, { useState, useMemo } from 'react';
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from '@workspace/ui/components/card';
import { Checkbox } from '@workspace/ui/components/checkbox';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@workspace/ui/components/dropdown-menu';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@workspace/ui/components/table';
import { Badge } from '@workspace/ui/components/badge';
import { Button } from '@workspace/ui/components/button';
import {
    Trash2,
    RefreshCw,
    MoreHorizontal,
    Info,
    ArrowUpDownIcon,
} from 'lucide-react';
import AppLayout from '@/components/AppLayout';
import { spaceQueryOptions } from '@/query/options/space';
import { useQuery } from '@tanstack/react-query';
import { useAppStore } from '@/state/store';
import { Input } from '@workspace/ui/components/input';

export default function TrashPage() {
    const selectedWorkspaceId = useAppStore((s) => s.selectedWorkspaceId);

    const { data: trashedSpaces } = useQuery({
        ...spaceQueryOptions({
            workspaceId: selectedWorkspaceId as string,
            status: 'TRASHED',
        }),
        enabled: !!selectedWorkspaceId,
    });

    return (
        <AppLayout breadcrumbs={[{ label: 'Trash', href: '/trash' }]}>
            <div className="p-6 space-y-4">
                <div className="flex items-center gap-3">
                    <Trash2 className="w-7 h-7" />
                    <div>
                        <h2 className="text-2xl font-semibold">Trash Items</h2>
                        <p className="text-sm text-muted-foreground">
                            Items you deleted — recover or permanently remove
                            them.
                        </p>
                    </div>
                </div>

                <div className="flex gap-3">
                    <Input
                        placeholder="Search Trash Items"
                        className="max-w-80"
                    />
                    <Button>
                        <ArrowUpDownIcon />
                    </Button>
                    <Button variant="outline" className="ml-auto">
                        Empty Trash
                    </Button>
                </div>

                <div className="grid grid-cols-3 gap-3">
                    {trashedSpaces?.map((space) => (
                        <Card key={space.id}>
                            <CardHeader>
                                <CardTitle className="flex justify-between items-center">
                                    {space.name}
                                </CardTitle>
                            </CardHeader>
                        </Card>
                    ))}
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle className="flex justify-between items-center">
                            {/*<span>Trash ({trashItems.length} items)</span>
                            {selectedItems.length > 0 && (
                                <div className="space-x-2">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() =>
                                            selectedItems.forEach(handleRestore)
                                        }
                                    >
                                        <RefreshCw className="mr-2 h-4 w-4" />{' '}
                                        Restore Selected
                                    </Button>
                                    <Button
                                        variant="destructive"
                                        size="sm"
                                        onClick={() =>
                                            selectedItems.forEach(
                                                handlePermanentDelete,
                                            )
                                        }
                                    >
                                        <Trash2 className="mr-2 h-4 w-4" />{' '}
                                        Delete Selected
                                    </Button>
                                </div>
                            )}*/}
                        </CardTitle>
                    </CardHeader>
                    <CardContent>Some data</CardContent>
                </Card>
            </div>

            {/*<div className="p-6 space-y-4">
                <Card>
                    <CardHeader>
                        <CardTitle className="flex justify-between items-center">
                            <span>Trash ({trashItems.length} items)</span>
                            {selectedItems.length > 0 && (
                                <div className="space-x-2">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() =>
                                            selectedItems.forEach(handleRestore)
                                        }
                                    >
                                        <RefreshCw className="mr-2 h-4 w-4" />{' '}
                                        Restore Selected
                                    </Button>
                                    <Button
                                        variant="destructive"
                                        size="sm"
                                        onClick={() =>
                                            selectedItems.forEach(
                                                handlePermanentDelete,
                                            )
                                        }
                                    >
                                        <Trash2 className="mr-2 h-4 w-4" /> Delete
                                        Selected
                                    </Button>
                                </div>
                            )}
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>
                                        <Checkbox
                                            checked={
                                                selectedItems.length ===
                                                    trashItems.length &&
                                                trashItems.length > 0
                                            }
                                            onCheckedChange={(checked) =>
                                                setSelectedItems(
                                                    checked
                                                        ? trashItems.map(
                                                            (item) => item.id,
                                                        )
                                                        : [],
                                                )
                                            }
                                        />
                                    </TableHead>
                                    <TableHead>Name</TableHead>
                                    <TableHead>Type</TableHead>
                                    <TableHead>Deleted At</TableHead>
                                    <TableHead>Days Remaining</TableHead>
                                    <TableHead>Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {sortedTrashItems.map((item) => {
                                    const daysRemaining = calculateDaysRemaining(
                                        item.deletedAt,
                                    );
                                    return (
                                        <TableRow key={item.id}>
                                            <TableCell>
                                                <Checkbox
                                                    checked={selectedItems.includes(
                                                        item.id,
                                                    )}
                                                    onCheckedChange={() =>
                                                        toggleItemSelection(item.id)
                                                    }
                                                />
                                            </TableCell>
                                            <TableCell>{item.name}</TableCell>
                                            <TableCell>
                                                <Badge variant="outline">
                                                    {item.type}
                                                </Badge>
                                            </TableCell>
                                            <TableCell>
                                                {new Date(
                                                    item.deletedAt,
                                                ).toLocaleDateString()}
                                            </TableCell>
                                            <TableCell>
                                                <Badge
                                                    variant={
                                                        daysRemaining > 15
                                                            ? 'default'
                                                            : 'destructive'
                                                    }
                                                >
                                                    {daysRemaining} days
                                                </Badge>
                                            </TableCell>
                                            <TableCell>
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                        >
                                                            <MoreHorizontal className="h-4 w-4" />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent>
                                                        <DropdownMenuItem
                                                            onSelect={() =>
                                                                handleRestore(
                                                                    item.id,
                                                                )
                                                            }
                                                        >
                                                            <RefreshCw className="mr-2 h-4 w-4" />
                                                            Restore
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem
                                                            onSelect={() =>
                                                                handlePermanentDelete(
                                                                    item.id,
                                                                )
                                                            }
                                                            className="text-destructive"
                                                        >
                                                            <Trash2 className="mr-2 h-4 w-4" />
                                                            Permanent Delete
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem>
                                                            <Info className="mr-2 h-4 w-4" />
                                                            View Details
                                                        </DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </TableCell>
                                        </TableRow>
                                    );
                                })}
                            </TableBody>
                        </Table>
                        {trashItems.length === 0 && (
                            <div className="text-center py-10 text-muted-foreground">
                                Your trash is empty
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>*/}
        </AppLayout>
    );
}

/**
 *
 This implementation uses Shadcn/ui components and follows the design patterns I observed in the project:

 1. Uses Shadcn/ui components like `Card`, `Table`, `Badge`, `Button`, etc.
 2. Implements similar functionality to the previous Chakra UI version
 3. Uses Lucide icons for actions
 4. Includes a toast notification system
 5. Provides bulk actions for selected items
 6. Responsive and clean design
 7. Typescript types for type safety

 The implementation assumes the existence of:
 - Shadcn/ui components in `@/components/ui/`
 - A toast hook from `@/components/ui/use-toast`
 - Lucide icons from 'lucide-react'

 You may need to adjust import paths or add necessary dependencies based on your specific project setup.
 */
