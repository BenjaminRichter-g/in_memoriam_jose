# CSV Import Guide for Memorial Website

## 🎯 **Complete Integration System**

Your memorial website now supports importing data directly from CSV files! This replaces the hard-coded memory data with your actual content.

## 📋 **Step-by-Step Process**

### **1. Prepare Your CSV File**

Create a CSV file with this exact format:

```csv
name,image,text,date,type
Maria,jose-family.jpg,"Beautiful family moment with Jose during the holidays",2023-12-25,
Carlos,jose-birthday.jpg,,2023-05-20,
Ana,,Jose was the kindest person I ever met,2023-12-15,quote
```

**Column Details:**
- **name**: Person's name (contributor/author)
- **image**: Image filename (e.g., "jose-family.jpg") or leave empty for text-only
- **text**: Memory description or message (use quotes for text with commas)
- **date**: Date in YYYY-MM-DD format (optional)
- **type**: For text-only entries - "quote", "story", "message", or "poem" (optional)

### **2. Add Your Images**

Place your actual photos in the `public/images/` folder:
```
public/images/
├── jose-family.jpg
├── jose-birthday.jpg
├── jose-work.jpg
└── ... (all your images)
```

### **3. Convert Your CSV**

Run the converter script:
```bash
node scripts/convert-csv.js your-memories.csv
```

This will generate:
- `your-memories.json` - JSON data
- `your-memories.ts` - TypeScript code

### **4. Update Your Website**

Copy the generated TypeScript code from `your-memories.ts` and replace the arrays in `app/page.tsx`:

```typescript
// Replace this section in app/page.tsx
const sampleMemories: MemoryData[] = [
  // Copy from your-memories.ts
]

const sampleTextMemories: TextMemory[] = [
  // Copy from your-memories.ts
]
```

## 📊 **CSV Examples**

### **Memory with Image and Text:**
```csv
Maria,jose-family.jpg,"Beautiful family moment with Jose during the holidays. The house was filled with laughter and love.",2023-12-25,
```

### **Image Only (No Text):**
```csv
Carlos,jose-birthday.jpg,,2023-05-20,
```

### **Text Only (No Image):**
```csv
Ana,,Jose was the kindest person I ever met. His generosity knew no bounds and his smile could light up any room.,2023-12-15,quote
```

## 🔄 **How It Works**

The converter automatically:

1. **Memory Entries**: Creates grid items when both image and text exist
2. **Image-Only**: Creates grid items with default text when only image exists
3. **Text-Only**: Creates slideshow text entries when only text exists
4. **Random Slideshow**: Combines any image with any text randomly
5. **Auto-IDs**: Generates sequential IDs for all entries
6. **Date Handling**: Uses provided dates or defaults to current date

## 🎮 **Features Available**

- ✅ **Image Grid**: Hover effects and expandable details
- ✅ **Random Slideshow**: Full-screen with navigation controls
- ✅ **Keyboard Support**: Arrow keys, spacebar, escape
- ✅ **Responsive Design**: Works on all devices
- ✅ **Long Text Support**: Scrollable text areas
- ✅ **Type Classification**: Quote, story, message, poem

## 🚀 **Quick Start**

1. **Create your CSV file** with your actual data
2. **Add images** to `public/images/` folder
3. **Run converter**: `node scripts/convert-csv.js your-file.csv`
4. **Copy generated code** to `app/page.tsx`
5. **Test website**: `npm run dev`

## 📝 **Tips**

- **Image Names**: Use descriptive names like `jose-family-2023.jpg`
- **Text with Commas**: Always wrap in quotes: `"This text, has commas"`
- **Dates**: Use YYYY-MM-DD format for consistency
- **Types**: Use "quote", "story", "message", or "poem" for text-only entries
- **Empty Fields**: Leave empty for missing data (e.g., `,,` for no image and no text)

## 🔧 **Troubleshooting**

**Issue**: "No rows found in CSV"
- **Solution**: Check CSV format and ensure no extra spaces

**Issue**: Images not loading
- **Solution**: Verify images are in `public/images/` folder

**Issue**: Text not displaying properly
- **Solution**: Check quotes around text with commas

**Issue**: Website not updating
- **Solution**: Restart dev server: `npm run dev`

## 📞 **Need Help?**

The system is designed to be simple and robust. If you encounter any issues:

1. Check the CSV format matches the examples
2. Verify image files exist in the correct folder
3. Ensure proper quotes around text with commas
4. Restart the development server

Your memorial website is now ready to display your actual memories and messages! 