export function convertMemoryIdToSlug(memoryId: string): string {
    const slug = memoryId.split('-').join('');
    return slug;
}

export function extractMemoryIdFromSlug(slug: string | null): string {
    if (!slug) throw Error('Invalid memory ID');

    if (!/^[0-9a-fA-F]{32}$/.test(slug)) {
        throw Error('Invalid memory ID');
    }
    return [
        slug.slice(0, 8),
        slug.slice(8, 12),
        slug.slice(12, 16),
        slug.slice(16, 20),
        slug.slice(20, 32),
    ].join('-');
}
