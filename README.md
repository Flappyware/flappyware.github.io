# flappyware.com

The Flappyware LLC company website — a plain static HTML/CSS site hosted on
GitHub Pages at [flappyware.com](https://flappyware.com).

## Structure

| File          | Purpose                                              |
| ------------- | ---------------------------------------------------- |
| `index.html`  | The single-page site. Placeholder copy is marked with `<!-- EDIT -->` comments. |
| `styles.css`  | All styling. Theme colors are the `:root` variables at the top. |
| `CNAME`       | Tells GitHub Pages to serve the site at `flappyware.com`. |
| `.nojekyll`   | Disables Jekyll processing so the files are served as-is. |

## Editing

It's a static site — open `index.html` in a browser to preview, edit the HTML
and CSS, then commit and push. GitHub Pages redeploys automatically on push to
the default branch.

## Deployment

Hosted via GitHub Pages from the default branch. See the repository
**Settings → Pages** to review the source branch and custom domain.
