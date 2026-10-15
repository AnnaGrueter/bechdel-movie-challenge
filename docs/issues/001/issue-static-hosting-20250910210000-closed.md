# Issue: Running on Client-Friendly CDN/Hosting Without Serverless Functions

**Date:** 2025-09-10 21:00:00 UTC
**Status:** Closed
**Closed Date:** 2025-01-10 00:00:00 UTC
**Resolution:** Completed - Application successfully refactored for static hosting

## Problem Description

The current application architecture relies on Next.js API routes (`app/api/enriched-random-movie/route.ts` and `app/api/test-bechdel/route.ts`) to fetch movie data and, crucially, to securely retrieve movie poster URLs from TMDB using a `TMDB_API_V4_TOKEN`. This token is intended for server-side use.

When deploying to a client-friendly CDN/hosting environment (like free Bolt Hosting or Netlify accounts) that does not support serverless functions, these API routes cannot execute. This results in the inability to fetch movie posters, breaking a core feature of the application. The previous attempt to use `output: 'export'` in `next.config.js` failed because it's incompatible with server-side API routes that use `force-dynamic`.

## Proposed Solution

To enable the application to run on a purely static hosting environment without serverless functions, the logic for fetching movie posters from TMDB must be moved to the client-side. This requires using a TMDB API key that is suitable for client-side exposure (typically a v3 API key, not the v4 token currently in use).

This approach will allow the entire application to be statically exported and served directly from a CDN, making it highly performant and compatible with basic hosting plans.

## The Plan

1.  **Obtain a TMDB v3 API Key**:
    *   You will need to register for a TMDB account (if you don't have one) and generate a **v3 API Key**. This key is designed for client-side use and is generally safe to expose in your frontend code.
    *   Once obtained, you should set this key as a public environment variable in your project, for example, `NEXT_PUBLIC_TMDB_API_KEY`. This variable will be accessible in the browser.

2.  **Modify `lib/api.ts`**:
    *   The `getRandomMovie` function currently calls a server-side API route (`/api/enriched-random-movie`). This call needs to be replaced with direct client-side logic to fetch movie data and posters.
    *   The `getRandomMovie` function will be updated to:
        *   First, fetch all Bechdel movies using the existing `fetchAllMovies` function.
        *   Then, select a random movie from the fetched list.
        *   Finally, make a direct `fetch` request to the TMDB API (using the newly obtained `NEXT_PUBLIC_TMDB_API_KEY`) to get the poster URL for the selected movie. This will involve constructing the TMDB API URL and parsing the response to extract the `poster_path`.
        *   The logic for retrying if a poster is not found will also be integrated here.

3.  **Remove Server-Side API Routes**:
    *   Delete the `app/api/enriched-random-movie/route.ts` file, as its functionality will be absorbed into `lib/api.ts` and executed client-side.
    *   Delete the `app/api/test-bechdel/route.ts` file, as it is also a server-side API route and not needed for static deployment.

4.  **Update `next.config.js`**:
    *   Re-enable the `output: 'export'` configuration to ensure Next.js generates a fully static site.
    *   Ensure `images.unoptimized: true` is set if you want to avoid Next.js Image Optimization (which requires a server).
    *   Verify that `images.domains` includes `image.tmdb.org` to allow Next.js `Image` component to load images from TMDB.

5.  **Update `netlify.toml`**:
    *   Review the `netlify.toml` file to ensure it is configured for static site deployment.
    *   Remove any `[[redirects]]` rules that specifically target `/api/*` paths, as these API routes will no longer exist. The `from = "/*" to = "/index.html"` redirect should remain for single-page application routing.

## Implementation Steps

### Phase 1: Environment Setup
- [x] Obtain TMDB v3 API Key
- [x] Add `NEXT_PUBLIC_TMDB_API_KEY` to environment variables

### Phase 2: Client-Side Migration
- [x] Update `lib/api.ts` to handle TMDB requests client-side
- [x] Test movie poster fetching functionality
- [x] Implement retry logic for movies without posters

### Phase 3: Cleanup
- [x] Remove `app/api/enriched-random-movie/route.ts`
- [x] Remove `app/api/test-bechdel/route.ts`
- [x] Remove `app/api/movies/route.ts`
- [x] Remove `app/api/random-movie/route.ts`
- [x] Remove unused cache utilities (`lib/cache.ts`)

### Phase 4: Configuration Updates
- [x] Update `next.config.js` for static export
- [x] Update `netlify.toml` for static deployment
- [x] Test build process locally

### Phase 5: Deployment
- [x] Deploy to static hosting environment
- [x] Verify all functionality works in production
- [ ] Monitor for any client-side errors

## Resolution Summary

This issue has been successfully resolved. The application has been refactored to work as a fully static site:

### Completed Changes:
- [x] Obtained TMDB v3 API Key and configured as `NEXT_PUBLIC_TMDB_API_KEY`
- [x] Updated `lib/api.ts` to handle TMDB requests client-side
- [x] Implemented retry logic for movies without posters
- [x] Removed all server-side API routes (`app/api/*`)
- [x] Removed unused cache utilities (`lib/cache.ts`)
- [x] Updated `next.config.js` with `output: 'export'` for static generation
- [x] Updated `netlify.toml` for static deployment
- [x] Successfully built and deployed as static site

### Current Status:
The application now runs entirely client-side and is compatible with any static hosting provider including free CDN services. All movie poster functionality works correctly using direct TMDB API calls from the browser.

**Note:** This issue led to the identification of a new challenge with the Bechdel Test API dependency, which is being addressed in issue #002.

## Expected Benefits

By following these steps, your application will be transformed into a purely static site, capable of being hosted on any CDN-based environment without requiring serverless functions, while retaining the movie poster display functionality.

## Risks and Considerations

- **API Key Exposure**: The TMDB v3 API key will be visible in the client-side code. This is generally acceptable for TMDB v3 keys as they are designed for this purpose, but you should monitor usage to ensure it stays within rate limits.
- **CORS Issues**: Direct client-side requests to TMDB API should work, but if CORS issues arise, a simple proxy service might be needed.
- **Rate Limiting**: Client-side requests are subject to TMDB's rate limiting. The current retry logic should help manage this.

## Success Criteria

- [ ] Application builds successfully with `output: 'export'`
- [ ] Movie posters load correctly in the deployed static site
- [ ] No server-side dependencies remain
- [ ] Application functions identically to the current version
- [ ] Deployment works on free static hosting tiers