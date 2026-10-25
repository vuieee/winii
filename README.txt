<div align="center">

# 2026_Portfolio_CRTOS95

A personal portfolio styled as a retro CRT desktop operating system.

</div>

## About

This is my personal portfolio, presented as a Windows 95-style desktop running on a CRT monitor. Visitors land on a Welcome screen and can browse my certificates and projects through a file-browser-style window called My Briefcase. It runs entirely in the browser with no backend, and all content is loaded from local files.

## Features

- **Welcome screen:** a profile photo, social media links (GitHub, LinkedIn, X, Instagram), and an "Email Me" button.
- **My Briefcase:** a file-browser window with **Certificates** and **Projects** folders. Contents are defined in a single file registry in `script.js`.
- **Photo Viewer:** double-click any image in My Briefcase to open it in a viewer window.
- **Supported images:** `.jpg`, `.jpeg`, `.png`, `.webp`, `.gif`, `.svg`.

## Tech Stack

| Component | Technology |
| :--- | :--- |
| Core | HTML5, CSS3, vanilla JavaScript |
| Content | Local image files registered in `script.js` |

There is no framework, bundler, or build step.

## Getting Started

No installation is required.

```bash
git clone https://github.com/<your-username>/<repo-name>.git
cd <repo-name>
```

Open `index.html` in a browser, or serve the folder locally:

```bash
npx serve .
# or
python3 -m http.server
```

## Project Structure

```
├── index.html         # Page markup (open this in your browser)
├── style.css          # All visual styling
├── script.js          # Window logic and image registry
└── assets/
    ├── profile/       # Welcome screen photo
    ├── projects/      # Project screenshots
    └── certs/         # Certificate images
```

## Customization

**Profile photo:** place your photo at `assets/profile/photo.jpg` (`.png` and `.webp` also work). In `index.html`, find the comment `<!-- SWAP THIS ENTIRE DIV for your <img> tag -->` and replace the placeholder `<div>` with:

```html
<img src="assets/profile/photo.jpg"
     style="width:100%;height:100%;object-fit:cover;">
```

**Certificates and projects:** place images in `assets/certs/` or `assets/projects/`, then add entries to the `FS` object in `script.js` (around line 220) and list their keys in the parent folder's `children`:

```js
cert1: { label: 'AWS Cloud', type: 'image', src: 'assets/certs/aws.png' },
certs: { label: 'Certificates', type: 'folder', children: ['cert1'] },

proj1: { label: 'My App', type: 'image', src: 'assets/projects/myapp.png' },
projects: { label: 'Projects', type: 'folder', children: ['proj1'] },
```

**Social links and email:** search `index.html` for `TODO` (4 places) and replace the placeholder usernames. Update the "Email Me" button in the Welcome dialog:

```html
onclick="location.href='mailto:hello@joshuadesigns.com'"
```

**Recommended image sizes:**

| Image | Size |
| :--- | :--- |
| Profile photo | 400×400 px minimum, square crops work best |
| Project images | 1280×720 px or 800×600 px |
| Certificates | Any size, landscape works best |

## Data and Privacy

The site is fully static. It stores nothing in the browser and sends no data to a server. The only external actions are the social links and the `mailto:` button, which open when clicked.

## Known Limitations

- Certificates and projects must be registered by hand in the `FS` object in `script.js`. Dropping an image into `assets/` is not enough.
- The site shows images only, so there is no PDF or video viewer.

## License

Released under the [MIT License](LICENSE).
