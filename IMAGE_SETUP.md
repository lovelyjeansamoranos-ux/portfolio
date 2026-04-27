# HOW TO UPDATE YOUR PROFILE PICTURE

## 📁 Current Image Location
Your picture is currently located at:
```
.vscode/bf0ae86a-dc5e-43fb-97ac-08f63012c2e9-removebg-preview.png
```

**NOTE:** This path is relative to the portfolio folder. The image is inside the `.vscode` folder.

---

## 🖼️ PLACES YOUR PICTURE APPEARS

### 1. Home Section (Hero - Large Circular Avatar)
**HTML Line ~147** in `index.html`
```html
<img src=".vscode/bf0ae86a-dc5e-43fb-97ac-08f63012c2e9-removebg-preview.png"
     alt="Your Name - Operator"
     class="profile-img">
```
- **Shape:** Circular with neon glow
- **Effect:** Holographic frame with rotating scanline
- **Size:** 400x400px (max)

### 2. About Section (Profile - Rectangular with Cyberpunk Frame)
**HTML Line ~184** in `index.html`
```html
<img src=".vscode/bf0ae86a-dc5e-43fb-97ac-08f63012c2e9-removebg-preview.png"
     alt="Lovely Jean - Operator"
     class="about-photo">
```
- **Shape:** Rectangular with glowing border corners
- **Effect:** Scan beam animation, hover zoom
- **Size:** 400x400px (height fixed)

---

## 🔧 HOW TO CHANGE YOUR PICTURE

### **Option 1: Replace the existing image file**
Simply replace the file at `.vscode/bf0ae86a-dc5e-43fb-97ac-08f63012c2e9-removebg-preview.png` with your own image (keep the same filename).

**Recommended image specs:**
- Format: PNG or JPG
- Size: At least 600x600px for best quality
- Background: Transparent PNG recommended for home avatar
- Aspect ratio: 1:1 (square) works best

---

### **Option 2: Update the image path**
If you want to store your picture elsewhere (e.g., `images/profile.jpg`):

1. Move/copy your image to the portfolio folder
2. Update BOTH `<img src="...">` tags in `index.html`:
   - Line ~147: Change `src=".vscode/..."` → `src="images/your-photo.jpg"`
   - Line ~184: Change `src=".vscode/..."` → `src="images/your-photo.jpg"`

---

### **Option 3: Use a URL (hosted online)**
```html
<img src="https://your-website.com/photos/profile.jpg" ...>
```

---

## 🎨 IMAGE STYLING EFFECTS

The CSS applies these effects automatically:

**For `.profile-img` (Home):**
- Circular crop (`border-radius: 50%`)
- Slight grayscale (20%)
- Neon glow on hover
- Holographic frame surrounds it

**For `.about-photo` (About):**
- Rectangular with border-radius
- Corner brackets appear on hover
- Scan beam effect passes over
- Zoom on hover effect

---

## ✨ CUSTOMIZATION

### **Remove grayscale effect** (show full color):
In `style.css`, find:
```css
.profile-img {
    filter: grayscale(20%) contrast(110%);
}
```
Change to:
```css
.profile-img {
    filter: none;
}
```

### **Change border glow color**:
```css
.profile-img:hover {
    box-shadow: 0 0 50px #ff0033; /* Change #ff0033 to your color */
}
```

---

## 📐 LAYOUT FIXES APPLIED

**Before:** Both an `<img>` tag AND an `<svg>` were showing → double profile
**After:** Single clean image with cyberpunk frame
**Text position:** Profile text is now properly on the RIGHT side of the image (was previously overlapping)

---

## 🔄 FILE STRUCTURE
```
portfolio/
├── index.html          ← Edit image paths here (2 locations)
├── style.css           ← Image styling (lines 915-945, 1074-1095)
├── script.js           ← No changes needed
└── .vscode/
    └── bf0ae86a-...png ← Your image file (rename/replace this)
```

---

## ✅ QUICK TEST
After changing your image, open `index.html` in a browser:
1. Home page: Large circular avatar with neon border
2. About page: rectangular photo on LEFT, text on RIGHT
3. Hover over images → glow and zoom effects
4. On mobile: Image stacks above text

Need help? Replace the existing PNG file with your own (keep same filename) and refresh.
