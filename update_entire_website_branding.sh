#!/bin/bash

# Script to update entire zaylegend.com website with personal branding and favicon
echo "🌐 Updating entire zaylegend.com website with your personal branding..."

# Find all HTML files across the entire website, excluding node_modules and other build artifacts
HTML_FILES=$(find /var/www/zaylegend -name "*.html" -type f \
  -not -path "*/node_modules/*" \
  -not -path "*/\.git/*" \
  -not -path "*/.next/*" \
  -not -path "*/coverage/*" \
  -not -path "*/build/*" \
  -not -path "*/*.bak")

if [ -z "$HTML_FILES" ]; then
    echo "✅ No HTML files found"
    exit 0
fi

echo "📁 Found $(echo "$HTML_FILES" | wc -l) files to update"

# Counter for progress
count=0
total=$(echo "$HTML_FILES" | wc -l)

# Process each file
while IFS= read -r file; do
    count=$((count + 1))
    echo "[$count/$total] Updating $(basename "$file") in $(dirname "$file")"
    
    # Skip if file is empty or doesn't contain proper HTML structure
    if [ ! -s "$file" ] || ! grep -q "<head>" "$file"; then
        echo "  Skipping: Not a proper HTML file"
        continue
    fi
    
    # Determine correct favicon path relative to file location
    # Count directory depth from /var/www/zaylegend/
    depth=$(echo "$file" | sed 's|/var/www/zaylegend/||' | grep -o "/" | wc -l)
    favicon_path=""
    
    if [ $depth -eq 0 ]; then
        favicon_path="favicon.ico"
    elif [ $depth -eq 1 ]; then
        favicon_path="../favicon.ico" 
    elif [ $depth -eq 2 ]; then
        favicon_path="../../favicon.ico"
    elif [ $depth -eq 3 ]; then
        favicon_path="../../../favicon.ico"
    else
        favicon_path="../../../../favicon.ico"
    fi
    
    # Add favicon link after the charset meta tag if it doesn't exist
    if ! grep -q "favicon" "$file"; then
        # Try to add after charset meta tag
        if grep -q '<meta charset' "$file"; then
            sed -i "/<meta charset/a\\    <link rel=\"icon\" type=\"image/x-icon\" href=\"$favicon_path\">\\n    <link rel=\"apple-touch-icon\" href=\"$favicon_path\">" "$file"
        # Try to add after head tag if no charset
        elif grep -q '<head>' "$file"; then
            sed -i "/<head>/a\\    <link rel=\"icon\" type=\"image/x-icon\" href=\"$favicon_path\">\\n    <link rel=\"apple-touch-icon\" href=\"$favicon_path\">" "$file"
        fi
    fi
    
    # Update generic descriptions with personal branding
    sed -i 's/A modern portfolio showcase/Personal portfolio and projects by Isayah Young Burke/g' "$file"
    sed -i 's/Portfolio Website/Isayah Young Burke - Portfolio/g' "$file"
    
    # Add comprehensive Open Graph meta tags if they don't exist and it's a main page
    if [[ "$file" == *"/index.html" ]] && ! grep -q "og:title" "$file"; then
        # Add after description meta tag or head tag
        if grep -q '<meta name="description"' "$file"; then
            sed -i '/<meta name="description"/a\\    <meta property="og:title" content="Isayah Young Burke - Portfolio & Projects">\\n    <meta property="og:description" content="Personal portfolio showcasing software development projects and technical expertise">\\n    <meta property="og:image" content="https://portfoliowebsite.s3.us-central-1.ionoscloud.com/favicon.jpg">\\n    <meta property="og:url" content="https://zaylegend.com/">\\n    <meta property="og:type" content="website">\\n    <meta name="twitter:card" content="summary">\\n    <meta name="twitter:site" content="@zaylegend">\\n    <meta name="twitter:creator" content="@zaylegend">' "$file"
        elif grep -q '<head>' "$file"; then
            sed -i '/<head>/a\\    <meta name="description" content="Personal portfolio showcasing software development projects and technical expertise by Isayah Young Burke">\\n    <meta property="og:title" content="Isayah Young Burke - Portfolio & Projects">\\n    <meta property="og:description" content="Personal portfolio showcasing software development projects and technical expertise">\\n    <meta property="og:image" content="https://portfoliowebsite.s3.us-central-1.ionoscloud.com/favicon.jpg">\\n    <meta property="og:url" content="https://zaylegend.com/">\\n    <meta property="og:type" content="website">\\n    <meta name="twitter:card" content="summary">\\n    <meta name="twitter:site" content="@zaylegend">\\n    <meta name="twitter:creator" content="@zaylegend">' "$file"
        fi
    fi
    
done <<< "$HTML_FILES"

echo "✅ Website-wide branding update complete!"
echo "📋 Summary:"
echo "   - Updated $total HTML files across the entire website"
echo "   - Added your favicon to all pages with correct relative paths"
echo "   - Enhanced meta descriptions with personal branding"
echo "   - Added Open Graph meta tags for better social sharing"
echo "   - Added Twitter Card meta tags"
echo "   - Applied consistent Isayah Young Burke branding throughout"