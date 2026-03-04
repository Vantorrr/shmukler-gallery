# Shmukler Gallery Website

This is a Next.js project with Sanity CMS for content management.

## Getting Started

1.  **Install Dependencies:**

    ```bash
    cd art-gallery
    npm install
    ```

2.  **Set up Sanity:**

    -   Create a project at [sanity.io](https://www.sanity.io).
    -   Get your Project ID and Dataset (usually "production").
    -   Update `.env.local` with your credentials:

    ```env
    NEXT_PUBLIC_SANITY_PROJECT_ID=your_project_id
    NEXT_PUBLIC_SANITY_DATASET=production
    ```

    -   Add `http://localhost:3000` to your CORS origins in Sanity management dashboard.

3.  **Run the Development Server:**

    ```bash
    npm run dev
    ```

    Open [http://localhost:3000](http://localhost:3000) to view the site.
    Open [http://localhost:3000/studio](http://localhost:3000/studio) to access the CMS.

## Project Structure

-   `src/app/(site)`: Main website pages (Home, Artwork, etc.)
-   `src/app/studio`: Sanity Studio embedded route.
-   `src/components`: React components (Navigation, ArtworkCard, etc.)
-   `sanity/schemaTypes`: Content schemas (Artwork, Artist, Exhibition).
-   `sanity/lib`: Sanity client and utilities.

## Features

-   **Ultra-Minimal Design:** Focus on artwork with clean typography.
-   **Sanity CMS:** Manage Artworks, Artists, and Exhibitions.
-   **E-commerce:** Mock checkout flow for LifePay and Dolyame integration.
-   **Responsive:** Works on mobile and desktop.

## Deployment

To deploy on Vercel:

1.  Push to GitHub.
2.  Import project in Vercel.
3.  Add Environment Variables (`NEXT_PUBLIC_SANITY_PROJECT_ID`, etc.) in Vercel settings.
