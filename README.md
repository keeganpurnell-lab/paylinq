# Dairee — website

Static site for **Dairee**, a student-led startup from Saint Mary's University in Halifax, Nova Scotia. Dairee is developing a dry powder fertilizer for houseplants and home gardens, made from milk, eggshells and potato peels that would otherwise be wasted. It is in development and not for sale, and the site makes no performance claims.

Founding team: Poojan Pitolwala (Founder & CEO), Sophie Wells (COO), Keegan Purnell (CMO).

## Files
- `index.html` — the page: hero (milk-drop-to-sprout animation), the idea, ingredients, process, product idea, team, stay in touch (Instagram + email), suppliers, FAQ
- `styles.css` — design tokens, layout, motion (all motion is switched off for visitors who prefer reduced motion)
- `script.js` — header, menu, scroll effects, process stepper, copy-email buttons
- `404.html` — "page not found" page
- `llms.txt` — plain-language summary of Dairee for AI assistants (ChatGPT, Claude, Perplexity)
- `robots.txt`, `sitemap.xml` — tell search engines and AI crawlers what to read
- `vercel.json` — caching and security headers on Vercel
- `assets/` — photos (JPG + WebP), share card `og.jpg`, home-screen icon

## Live site
**https://dairee.ca** — hosted on Netlify.

To update: download/zip this folder (or the files `index.html`, `404.html`, `styles.css`, `script.js`, `robots.txt`, `sitemap.xml`, `assets/`) and drag it into the site's **Deploys** tab on Netlify. Or connect this GitHub repository to Netlify so every push deploys automatically.

## Still to do
2. **Contact:** email getdairee@gmail.com, Instagram @getdairee (already on the site). Add LinkedIn links if wanted.
3. **Progress log:** remove `hidden` from `<section id="learned">` and fill in real results.
4. **Photos:** replace the soil and cactus photos (cropped from the first draft) with originals or your own prototype photos.
