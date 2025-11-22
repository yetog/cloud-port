#!/bin/bash

# Script to fix asset file name references in knowledge base
echo "🔧 Fixing asset file name references..."

# Find all HTML files in knowledge base
HTML_FILES=$(find /var/www/zaylegend -name "*.html" -path "*/knowledge-base/*")

if [ -z "$HTML_FILES" ]; then
    echo "✅ No knowledge base HTML files found"
    exit 0
fi

echo "📁 Found $(echo "$HTML_FILES" | wc -l) files to update"

# Counter for progress
count=0
total=$(echo "$HTML_FILES" | wc -l)

# Process each file
while IFS= read -r file; do
    count=$((count + 1))
    echo "[$count/$total] Fixing asset names in $file"
    
    # Fix CSS file references
    sed -i 's|assets/css/0\.styles\.f745d67d\.css|assets/css/styles.css|g' "$file"
    sed -i 's|assets/css/styles\.css|assets/css/styles.css|g' "$file"
    
    # Fix main JS file references  
    sed -i 's|assets/js/app\.7512a4bb\.js|assets/js/app.js|g' "$file"
    sed -i 's|assets/js/2\.082b5d92\.js|assets/js/page.js|g' "$file"
    sed -i 's|assets/js/36\.007b0846\.js|assets/js/vendor.js|g' "$file"
    
    # Remove all the specific versioned JS references that don't exist locally
    # and replace with our basic JS files
    sed -i 's|<link rel="preload"[^>]*assets/js/[0-9][^>]*>||g' "$file"
    sed -i 's|<link rel="prefetch"[^>]*assets/js/[0-9][^>]*>||g' "$file"
    
    # Clean up multiple spaces
    sed -i 's|  *| |g' "$file"
    
done <<< "$HTML_FILES"

echo "✅ Asset file name references fixed!"
echo "📋 Summary:"
echo "   - Updated $total HTML files"
echo "   - Fixed CSS references to use existing styles.css"
echo "   - Fixed JS references to use existing app.js, page.js, vendor.js"
echo "   - Removed non-existent versioned asset references"