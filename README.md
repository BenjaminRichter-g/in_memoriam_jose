# In Memoriam - Jose

A beautiful memorial website celebrating the life and memories of Jose, built with Next.js, TypeScript, and Tailwind CSS.

## Features

- **Hero Section**: Prominent display of Jose's main photo with heartfelt tribute text
- **Interactive Image Grid**: Collection of memories with hover effects and expandable details
- **Random Slideshow**: Full-screen slideshow that randomly pairs any image with any text memory
- **Navigation Controls**: Forward/backward navigation with play/pause functionality
- **Keyboard Support**: Arrow keys for navigation, spacebar for play/pause, escape to close
- **Responsive Design**: Beautiful on all devices - desktop, tablet, and mobile
- **Smooth Animations**: Elegant transitions and hover effects using Framer Motion
- **Modern UI**: Clean, respectful design with a warm color palette

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd in_memoriam
```

2. Install dependencies:
```bash
npm install
```

3. Add your images:
   - Place Jose's main photo as `public/images/jose-main.jpg`
   - Add memory photos as `public/images/memory1.jpg`, `memory2.jpg`, etc.

4. Customize the content:
   - Update the hero text in `components/HeroSection.tsx`
   - Modify the sample memories in `app/page.tsx`
   - Adjust colors in `tailwind.config.js` if desired

5. Run the development server:
```bash
npm run dev
```

6. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Customization

### Adding New Memories

Edit the `sampleMemories` array in `app/page.tsx`:

```typescript
{
  id: 7,
  imageUrl: '/images/memory7.jpg',
  title: 'New Memory Title',
  description: 'Description of this special moment.',
  date: '2023-11-15',
  contributor: 'Friend Name'
}
```

### Adding Text Memories

Edit the `sampleTextMemories` array in `app/page.tsx`:

```typescript
{
  id: 9,
  text: "Your heartfelt message about Jose here.",
  author: "Your Name",
  date: "2023-12-01",
  type: "story" // Options: 'quote', 'story', 'message', 'poem'
}
```

### Changing Colors

The website uses a custom color palette defined in `tailwind.config.js`. You can modify the `primary` and `memorial` color schemes to match your preferences.

### Updating Text Content

- **Hero Section**: Edit the text in `components/HeroSection.tsx`
- **Page Title**: Update the metadata in `app/layout.tsx`
- **Section Headers**: Modify text in `components/ImageGrid.tsx`

## Deployment

### Deploy to Vercel

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Deploy automatically

### Manual Deployment

```bash
npm run build
npm start
```

## Project Structure

```
in_memoriam/
├── app/                    # Next.js app directory
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Main page
├── components/            # React components
│   ├── HeroSection.tsx    # Hero section with main photo
│   └── ImageGrid.tsx      # Interactive image grid
├── types/                 # TypeScript type definitions
│   └── memory.ts          # Memory data interface
├── public/                # Static assets
│   └── images/            # Image files
└── package.json           # Dependencies and scripts
```

## Technologies Used

- **Next.js 14**: React framework with App Router
- **TypeScript**: Type-safe JavaScript
- **Tailwind CSS**: Utility-first CSS framework
- **Framer Motion**: Animation library
- **Vercel**: Deployment platform

## Contributing

This is a personal memorial website. If you're contributing memories or photos, please ensure you have permission to share them.

## License

This project is for personal use as a memorial website.

---

*In loving memory of Jose - may his spirit live on through these cherished memories.*
