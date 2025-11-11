# Project Structure - Updated CSS Organization

## ✅ Completed Reorganization (November 11, 2025)

### Recent Updates:
- ✅ Renamed `tailwind-input-new.*` files to cleaner `tailwind.*` naming
- ✅ Updated build scripts to use new file names
- ✅ Removed unused CSS/SCSS files (~507KB saved)

### New File Structure:
```
lasgo-test/
├── styles/                           # Main CSS directory
│   ├── layer-setup-standalone.css    # Layer cascade order definition
│   ├── main.css                      # Final compiled CSS output
│   ├── tailwind.scss                 # Main SCSS source file
│   ├── tailwind.css                  # Intermediate compiled CSS
│   ├── existing-overrides.css        # Legacy overrides
│   └── preflight-modified.css        # Modified Tailwind preflight
├── index.html                        # Updated to use new CSS structure
├── index-new.html                    # Updated to use new CSS structure
├── product-landing.html              # Updated to use new CSS structure
├── product-listing.html              # Updated to use new CSS structure
└── [other HTML files]               # All updated to new structure
```

### CSS Loading Order (correct layer precedence):
1. `styles/layer-setup-standalone.css` - Establishes layer hierarchy
2. `styles/main.css` - Main compiled CSS with proper layer organization

### Layer Hierarchy (lowest to highest priority):
```css
@layer tw-base, base, site, tw, site-props, existing-overrides;
```

### Updated Build Scripts:
- `npm run build` - Complete build process (tailwind.scss → tailwind.css → main.css)
- `npm run build:sass` - Compile SCSS to intermediate CSS
- `npm run build:tailwind` - Process through Tailwind CSS v4
- `npm run dev` - Watch mode for development

### Key Features Working:
✅ Reset rules properly scoped to `.new` class  
✅ Tailwind utilities take precedence over site styles  
✅ Small-style framework integration with mixin access  
✅ Proper CSS layer order established  
✅ All HTML pages updated to use organized CSS structure  

### Legacy Files (for reference):
- `style.css` - Original CSS compilation (still used by old system)
- `tailwind-output.css` - Original Tailwind output (still used by old system)
- `existing.css` - Legacy existing styles
- `css-dist/` - Modular CSS files (used by legacy style.css)

### Removed/Unused Files (moved to backup/unused-css/):
- `debug.css` & `debug.css.map` - Development debug files
- `layer-order.css` - Temporary layer test file
- `style-final.css` - Old compilation output
- `tailwind-input.css` - Old Tailwind input file
- `tailwind.scss` - Unused SCSS file