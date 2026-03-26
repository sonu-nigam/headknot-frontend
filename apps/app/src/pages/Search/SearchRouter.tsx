import { SearchResultsPage } from './SearchResultsPage';

/**
 * SearchRouter is the entry point for the /search route.
 * It delegates to SearchResultsPage which handles:
 * - Fetching search API data
 * - Reading answer.responseType to render the correct content component inline
 * - Showing alternatives view when ?view=alternatives is set
 * - Loading and empty states
 */
export function SearchRouter() {
    return <SearchResultsPage />;
}
