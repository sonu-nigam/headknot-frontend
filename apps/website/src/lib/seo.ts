import { useEffect } from 'react';

const SITE_URL = 'https://headknot.com';

type Seo = {
    title: string;
    description?: string;
    /** Path for the canonical URL, e.g. "/terms". Defaults to "/". */
    path?: string;
};

function upsertMeta(name: string, content: string) {
    let tag = document.head.querySelector<HTMLMetaElement>(
        `meta[name="${name}"]`,
    );
    if (!tag) {
        tag = document.createElement('meta');
        tag.setAttribute('name', name);
        document.head.appendChild(tag);
    }
    tag.setAttribute('content', content);
}

function upsertCanonical(href: string) {
    let link = document.head.querySelector<HTMLLinkElement>(
        'link[rel="canonical"]',
    );
    if (!link) {
        link = document.createElement('link');
        link.setAttribute('rel', 'canonical');
        document.head.appendChild(link);
    }
    link.setAttribute('href', href);
}

/**
 * Sets the document title, meta description and canonical URL for the current
 * route. The static index.html already carries the landing-page defaults; this
 * keeps sub-pages (e.g. /terms, /support) accurate for crawlers that render JS.
 */
export function useSeo({ title, description, path = '/' }: Seo) {
    useEffect(() => {
        document.title = title;
        if (description) upsertMeta('description', description);
        upsertCanonical(`${SITE_URL}${path}`);
    }, [title, description, path]);
}
