# Chinmay Kadam — Portfolio Website

A responsive static portfolio built with HTML5, CSS3, Bootstrap 5 utilities and vanilla JavaScript. There is no build step or backend.

## Preview locally

Open `index.html` in a browser, or serve this folder with any static web server (for example, PHP's built-in server or the Apache instance in XAMPP). Bootstrap and Google Fonts load from their public CDNs, so those visual resources require an internet connection. The layout remains usable if the external fonts are unavailable.

## Pages

- `index.html` — homepage and overview
- `about.html` — profile, education and career timeline
- `expertise.html` — capability areas
- `projects.html` — filterable assignment grid
- `project-thane.html`, `project-mp.html`, `project-procurement.html`, `project-transport.html` — individual assignment details
- `contact.html` — contact details and validated email-draft form
- `404.html` — helpful not-found page

Shared navigation, footer and interactive behavior are in `assets/js/site.js`; site styles are in `assets/css/site.css`. The hero and assignment graphics are CSS illustrations, not project photography.

## Editing content

- Update contact methods in `assets/js/site.js` and `contact.html` together. The optional second phone appears only on the contact page.
- Edit assignment summaries in `index.html`, `projects.html` and the related `project-*.html` pages. Keep scope figures qualified as programme or analysis scope.
- Career dates, role titles and MBA status appear in `about.html` and `index.html`; confirm reported current statuses before launch.
- Replace the CSS illustrations only with approved imagery. Label illustrative visuals if adding them to assignment pages, and use descriptive alt text.
- No CV download is provided. Add one only after a public-safe CV PDF is separately prepared.
- The contact form uses browser validation and opens an addressed email draft. It does not send, store or transmit submissions itself. Configure a secure form service/backend before representing it as an online submission form.

## Deployment

Upload the site files and `assets` directory to any static host or GitHub Pages. The pages use relative paths and need no server-side runtime. Before launch, set the final canonical domain in the Person structured data in `index.html`, then add a matching `sitemap.xml` and `robots.txt`. Do not publish an empty or placeholder sitemap while the domain is unknown.

## Pre-launch checklist

- Confirm current KPMG employment status and current assignment dates, including the June 2026 onward entry.
- Confirm that MBA in Finance is still in progress.
- Confirm whether both phone numbers should be public and whether the secondary number should remain displayed.
- Confirm the project descriptions and employer/authority names are approved for public portfolio use.
- Provide the final domain before adding canonical URLs, sitemap and robots configuration.
- Supply a separately prepared public-safe CV PDF only if a download is desired.
- Configure a form backend only if direct website submission is required.
