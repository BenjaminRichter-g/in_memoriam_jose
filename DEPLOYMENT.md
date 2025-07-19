# Deployment Guide - In Memoriam Website

## 🚀 Deploy to Vercel (Recommended)

### Prerequisites
- GitHub account
- Vercel account (free at vercel.com)

### Steps

1. **Push to GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit - Memorial website"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/in-memoriam.git
   git push -u origin main
   ```

2. **Deploy to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Sign in with GitHub
   - Click "New Project"
   - Import your repository
   - Vercel will automatically detect Next.js
   - Click "Deploy"

3. **Custom Domain (Optional)**
   - In Vercel dashboard, go to your project
   - Click "Settings" → "Domains"
   - Add your custom domain

## 📁 File Structure for Deployment

```
in_memoriam/
├── app/                    # Next.js app directory
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Main page (with your data)
├── components/            # React components
│   ├── HeroSection.tsx    # Hero section
│   ├── ImageGrid.tsx      # Image grid
│   └── RandomSlideshow.tsx # Slideshow
├── public/                # Static assets
│   └── images/            # Your images
├── types/                 # TypeScript types
├── scripts/               # CSV conversion tools
└── package.json           # Dependencies
```

## 🖼️ Adding Your Images

1. **Replace placeholder images** in `public/images/` with your actual photos
2. **Update image references** in your CSV file to match your image filenames
3. **Run the converter** to update the website data:
   ```bash
   node scripts/convert-csv.js your-memories.csv
   ```

## 📊 Adding Your Data

1. **Create your CSV file** with columns: `name,image,text,date,type`
2. **Run the converter**:
   ```bash
   node scripts/convert-csv.js your-memories.csv
   ```
3. **Copy the generated data** from `your-memories.ts` to `app/page.tsx`

## 🔧 Environment Variables

No environment variables needed for this project.

## 📱 Performance Optimization

- Images are automatically optimized by Next.js
- Lazy loading is enabled for images
- Animations use Framer Motion for smooth performance

## 🎨 Customization

- **Colors**: Edit `tailwind.config.js`
- **Text**: Update content in components
- **Layout**: Modify component structure
- **Animations**: Adjust Framer Motion settings

## 🚨 Troubleshooting

### Build Errors
- Ensure all dependencies are installed: `npm install`
- Check TypeScript errors: `npm run lint`
- Verify image paths are correct

### Image Issues
- Make sure images are in `public/images/`
- Check file extensions match CSV references
- Verify image files are valid

### Deployment Issues
- Check Vercel build logs
- Ensure all files are committed to Git
- Verify package.json scripts are correct

## 📞 Support

For deployment issues:
1. Check Vercel documentation
2. Review build logs in Vercel dashboard
3. Ensure all files are properly committed

---

**Your memorial website will be live at: `https://your-project-name.vercel.app`** 