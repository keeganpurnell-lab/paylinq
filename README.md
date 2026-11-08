# Dairee — website

Static site for **Dairee**, a student-led startup from Saint Mary's University in Halifax, Nova Scotia. Dairee is exploring how milk that would otherwise go unused could become a liquid fertilizer for houseplants and home gardens. It is in development and not for sale, and the site makes no performance claims.

- `index.html` — page: hero, the idea, development path, product concept, "honest from the start", team, customer-discovery survey, FAQ, footer
- `styles.css` — design tokens (forest / sage / paper), layout, responsive and reduced-motion rules
- `script.js` — header state, mobile menu, scroll reveals, survey handling
- `assets/team.jpg` — founding team photo

Open `index.html` in a browser, or deploy the folder to any static host (GitHub Pages, Netlify, Vercel).

## Before launch
1. **Survey:** set `FORM_ENDPOINT` in `script.js` (for example a Formspree form URL). Until then, answers open as a pre-filled email to `CONTACT_EMAIL`.
2. **Contact:** confirm the email address and add social links (footer and FAQ).
3. **Team:** add founder names and roles (see the TODO in the team section).
4. **Photos:** swap the illustrated bottle and pot for real prototype photos when you have them.
