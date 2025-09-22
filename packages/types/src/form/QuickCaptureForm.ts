import { MemoryType } from '../common/Memory';

export type Block =
    | { kind: 'text'; data: { md: string } }
    | { kind: 'code'; data: { language: string; text: string } }
    | {
          kind: 'link-card';
          data: {
              url: string;
              title?: string;
              description?: string;
              site?: string;
          };
      }
    | { kind: 'quote'; data: { md: string; source_url?: string } }
    | {
          kind: 'checklist';
          data: { items: { id: string; text: string; done: boolean }[] };
      }
    | {
          kind: 'image';
          data: { asset_id: string; alt?: string; caption_md?: string };
      }
    | { kind: 'file'; data: { asset_id: string; name: string; mime: string } }
    | { kind: 'audio'; data: { asset_id: string; duration_ms?: number } }
    | { kind: 'divider'; data: {} };

export type Content = Block[];

export type ContentPolicyType = Record<
    MemoryType,
    { allowed: Block['kind'][]; requiredOneOf?: Block['kind'][] }
>;

export type CaptureForm = {
    title: string;
    type: MemoryType;
    cluster?: string;
    privacy: 'private' | 'shared';
    provenance: {
        mode: 'parent' | 'url' | 'import' | 'origin'; // UI only; backend derives `origin` if empty
        parent_id?: string;
        provenance_url?: string; // not persisted; content-derived instead
        import_ref?: string;
    };
    content: Content;
    type_extra?: {
        task?: {
            status: 'todo' | 'doing' | 'done';
            priority: 'low' | 'med' | 'high';
            due_at?: string;
            assignees?: string;
        };
        event?: {
            starts_at: string;
            ends_at: string;
            location?: string;
            attendees?: string;
        };
    };
    relationships?: { part_of?: string; references?: string };
    metadata?: { tags?: string; sensitivity?: 'low' | 'med' | 'high' };
    options?: { pin?: boolean; share?: boolean };
};
