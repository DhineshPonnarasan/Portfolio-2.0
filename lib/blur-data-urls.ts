/**
 * Client-safe blur data URLs.
 *
 * Plaiceholder (which uses sharp / detect-libc under the hood) requires
 * Node built-ins like `child_process`, so we keep its runtime helpers in a
 * separate server-only module and only re-export precomputed strings here.
 *
 * The precomputed `ABOUT_ME_BLUR_DATA_URL` was generated once against
 * `/public/projects/images/Dhinesh.jpg` and is small enough to ship inline.
 */

export const ABOUT_ME_BLUR_DATA_URL =
    'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEASABIAAD/2wBDAAYEBAQFBAYFBQYJBgUGCQsIBgYICwwKCgsKCgwQDAwMDAwMEAwODxAPDgwTExQUExMcGxsbHBwcHBwcHBwcHBwcHBz/2wBDAQcHBw0MDRgQEBgaFREVGhwcHBwcHBwcHBwcHBwcHBwcHBwcHBwcHBwcHBwcHBwcHBwcHBwcHBwcHBwcHBwcHBz/wAARCABAAEADAREAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAj/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdAAH//9k=';
