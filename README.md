# Meng Li — Personal Homepage

Personal academic homepage, served via **GitHub Pages**.

🔗 Live site: https://yhpyclm.github.io/MengLi/

## Files

| File | Purpose |
|------|---------|
| `index.html` | The homepage (all content lives here) |
| `assets/style.css` | Styling / theme |
| `assets/avatar.png` | Profile photo — **replace with your own photo** |

## How to edit

1. **Photo** — overwrite `assets/avatar.png` with your own image (square, e.g. 400×400).
2. **Email** — search for `your-email@buaa.edu.cn` in `index.html` and replace with your real address (appears twice: header button + contact section).
3. **Text** — sections `About`, `Research Interests`, `Publications`, `Contact` are plain HTML.
4. **Colors** — edit the CSS variables at the top of `assets/style.css` (`--accent`, etc.).
5. **Publications** — each entry is a `<div class="pub">` block; copy one to add a paper.

## Deploy

Just commit and push to `main` — GitHub Pages rebuilds automatically.

```bash
git add -A && git commit -m "Update homepage" && git push
```
