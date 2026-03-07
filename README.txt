╔══════════════════════════════════════════════════════╗
║         2026_Portfolio_CRTOS95 — Quick Guide         ║
╚══════════════════════════════════════════════════════╝

FOLDER STRUCTURE
────────────────
2026_Portfolio_CRTOS95/
├── index.html          ← open this in your browser
├── style.css           ← all visual styling
├── script.js           ← all logic + image registry
├── README.txt          ← this file
└── assets/
    ├── profile/        ← your Welcome screen photo
    ├── projects/       ← project screenshot images
    └── certs/          ← certificate images


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

WELCOME SCREEN PROFILE PHOTO
──────────────────────────────
1. Drop your photo into:
       assets/profile/photo.jpg   (or .png / .webp)

2. Open index.html and find this comment:
       <!-- SWAP THIS ENTIRE DIV for your <img> tag -->

3. Replace the entire placeholder <div>...</div> with:
       <img src="assets/profile/photo.jpg"
            style="width:100%;height:100%;object-fit:cover;">


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

CERTIFICATES  (shown in My Briefcase → Certificates)
──────────────────────────────────────────────────────
1. Drop images into:   assets/certs/

2. Open script.js and find the FS object (~line 220).
   Uncomment and fill in the cert entries:

       cert1: { label:'AWS Cloud',  type:'image', src:'assets/certs/aws.png'   },
       cert2: { label:'React Dev',  type:'image', src:'assets/certs/react.jpg' },

3. Add the keys to certs.children:

       certs: { label:'Certificates', type:'folder', children:['cert1','cert2'] },

4. Save. Double-click Certificates in My Briefcase to see them.
   Double-click any image to open it in Photo Viewer.


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

PROJECT SCREENSHOTS  (shown in My Briefcase → Projects)
────────────────────────────────────────────────────────
Same pattern as certificates:

1. Drop images into:   assets/projects/

2. In script.js FS object, uncomment and fill in:

       proj1: { label:'My App',     type:'image', src:'assets/projects/myapp.png'   },
       proj2: { label:'My Website', type:'image', src:'assets/projects/website.jpg' },

3. Add keys to projects.children:

       projects: { label:'Projects', type:'folder', children:['proj1','proj2'] },


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

SOCIAL MEDIA LINKS
────────────────────
Open index.html and search for "TODO" (there are 4):
  • GitHub:    replace  https://github.com/YOUR_USERNAME
  • LinkedIn:  replace  https://linkedin.com/in/YOUR_USERNAME
  • X:         replace  https://x.com/YOUR_USERNAME
  • Instagram: replace  https://instagram.com/YOUR_USERNAME

Also update the "Email Me" mailto link in the Welcome dialog:
       onclick="location.href='mailto:hello@joshuadesigns.com'"


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

SUPPORTED IMAGE FORMATS
─────────────────────────
.jpg  .jpeg  .png  .webp  .gif  .svg

Recommended sizes:
  Profile photo:      400×400 px minimum (square crops best)
  Project images:     1280×720 px or 800×600 px
  Certificate images: any size, landscape works best in viewer
