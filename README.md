# NexChair — static prototype

Plain HTML/CSS/JS. There's no build step and nothing to install.

## Pages
- `index.html`: Home
- `range.html`: Product Range. The category, back type, armrest and feature filters, sorting and compare all work.
- `specifications.html`: Product specs, dimensions and comparison. Use `?model=nx-p2` to pick the model.
- `about.html`: About
- `contact.html`: Quote / enquiry form. It's a prototype, so nothing is sent.

## Deploy to Vercel
**Option A (no terminal):** go to vercel.com → Add New → Project. Import this folder from a GitHub repo, set
Framework Preset to **Other** and leave the build command empty. Then deploy.

**Option B (CLI):**
```
npm i -g vercel
cd nexchair-site
vercel          # preview URL
vercel --prod   # production URL
```

## Before sending to the client
- WhatsApp: set `WHATSAPP_NUMBER` at the top of `assets/main.js`, e.g. `"919876543210"`.
- Placeholders in square brackets (`[₹ PRICE]`, `[–] kg`, `[X] yrs`, `[Phone number]`…) are waiting for client data.
- Product photos: replace `assets/chair.svg` in the relevant `<img>` tags with real images.
- `<meta name="robots" content="noindex">` keeps the prototype out of search engines. Remove it at launch.
