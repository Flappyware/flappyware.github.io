# flappyware.com

The Flappyware LLC company website — a plain static HTML/CSS site hosted on
Cloudflare Pages at [flappyware.com](https://flappyware.com).

## Structure

| File | Purpose |
| --- | --- |
| `index.html` | The single-page site. |
| `styles.css` | All styling. Theme colors are the `:root` variables at the top. |
| `CNAME`, `.nojekyll` | Legacy GitHub Pages configuration. |

## Editing and deployment

Open `index.html` in a browser to preview changes, then commit and push to
`main`. Cloudflare Pages automatically deploys that branch without a build
command; the repository root is the output directory. The Cloudflare Pages
project is `flappyware-website`, with `flappyware.com` and
`www.flappyware.com` configured as custom domains. DNS and HTTPS are managed
by Cloudflare.
