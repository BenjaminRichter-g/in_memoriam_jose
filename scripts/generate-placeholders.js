const fs = require('fs');
const path = require('path');

// Create a simple HTML file that generates placeholder images
const placeholderHTML = `
<!DOCTYPE html>
<html>
<head>
    <title>Generate Placeholder Images</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 20px; }
        .placeholder { 
            width: 400px; 
            height: 300px; 
            background: linear-gradient(45deg, #f0f0f0, #e0e0e0);
            border: 2px solid #ccc;
            display: flex;
            align-items: center;
            justify-content: center;
            margin: 10px;
            border-radius: 8px;
        }
        .main-placeholder {
            width: 600px;
            height: 500px;
            background: linear-gradient(45deg, #e8f4f8, #d4e6f1);
        }
        .grid { display: flex; flex-wrap: wrap; }
        button { 
            padding: 10px 20px; 
            margin: 10px; 
            background: #007bff; 
            color: white; 
            border: none; 
            border-radius: 5px; 
            cursor: pointer; 
        }
    </style>
</head>
<body>
    <h1>Placeholder Image Generator</h1>
    <p>Right-click on each image and "Save image as..." to download them to your public/images folder.</p>
    
    <h2>Main Hero Image (jose-main.jpg)</h2>
    <div class="placeholder main-placeholder">
        <div style="text-align: center; color: #666;">
            <h3>Jose - Main Photo</h3>
            <p>Replace with actual photo</p>
        </div>
    </div>
    
    <h2>Memory Images</h2>
    <div class="grid">
        <div class="placeholder">
            <div style="text-align: center; color: #666;">
                <h4>Memory 1</h4>
                <p>Family Gathering</p>
            </div>
        </div>
        <div class="placeholder">
            <div style="text-align: center; color: #666;">
                <h4>Memory 2</h4>
                <p>Beach Day</p>
            </div>
        </div>
        <div class="placeholder">
            <div style="text-align: center; color: #666;">
                <h4>Memory 3</h4>
                <p>Birthday Celebration</p>
            </div>
        </div>
        <div class="placeholder">
            <div style="text-align: center; color: #666;">
                <h4>Memory 4</h4>
                <p>Work Achievement</p>
            </div>
        </div>
        <div class="placeholder">
            <div style="text-align: center; color: #666;">
                <h4>Memory 5</h4>
                <p>Hiking Adventure</p>
            </div>
        </div>
        <div class="placeholder">
            <div style="text-align: center; color: #666;">
                <h4>Memory 6</h4>
                <p>Dinner with Friends</p>
            </div>
        </div>
    </div>
    
    <script>
        // Add download functionality
        document.querySelectorAll('.placeholder').forEach((placeholder, index) => {
            placeholder.addEventListener('click', function() {
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');
                const rect = this.getBoundingClientRect();
                
                canvas.width = rect.width;
                canvas.height = rect.height;
                
                // Create gradient background
                const gradient = ctx.createLinearGradient(0, 0, rect.width, rect.height);
                gradient.addColorStop(0, '#f0f0f0');
                gradient.addColorStop(1, '#e0e0e0');
                
                ctx.fillStyle = gradient;
                ctx.fillRect(0, 0, rect.width, rect.height);
                
                // Add text
                ctx.fillStyle = '#666';
                ctx.font = '16px Arial';
                ctx.textAlign = 'center';
                ctx.fillText(index === 0 ? 'Jose - Main Photo' : 'Memory ' + index, rect.width/2, rect.height/2);
                
                // Download
                const link = document.createElement('a');
                link.download = index === 0 ? 'jose-main.jpg' : 'memory' + index + '.jpg';
                link.href = canvas.toDataURL();
                link.click();
            });
        });
    </script>
</body>
</html>
`;

// Ensure scripts directory exists
const scriptsDir = path.join(__dirname);
if (!fs.existsSync(scriptsDir)) {
    fs.mkdirSync(scriptsDir, { recursive: true });
}

// Write the HTML file
fs.writeFileSync(path.join(scriptsDir, 'placeholder-generator.html'), placeholderHTML);

console.log('Placeholder image generator created at scripts/placeholder-generator.html');
console.log('Open this file in your browser to generate placeholder images for testing.'); 