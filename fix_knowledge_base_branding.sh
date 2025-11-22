#!/bin/bash

# Script to fix Paul Copplestone branding in knowledge base
# Replace with Isayah Young Burke branding

echo "🔧 Fixing knowledge base branding..."

# Find all HTML files that need updating
HTML_FILES=$(find /var/www/zaylegend -name "*.html" -exec grep -l "Paul Copplestone\|paul\.copplest\.one\|kiwicopple" {} \;)

if [ -z "$HTML_FILES" ]; then
    echo "✅ No files found with Paul Copplestone branding"
    exit 0
fi

echo "📁 Found $(echo "$HTML_FILES" | wc -l) files to update"

# Counter for progress
count=0
total=$(echo "$HTML_FILES" | wc -l)

# Process each file
while IFS= read -r file; do
    count=$((count + 1))
    echo "[$count/$total] Updating $file"
    
    # Create backup
    cp "$file" "$file.bak"
    
    # Replace branding elements
    sed -i 's|Paul Copplestone|Isayah Young Burke|g' "$file"
    sed -i 's|https://paul\.copplest\.one/|https://zaylegend.com/|g' "$file"
    sed -i 's|https://paul\.copplest\.one|https://zaylegend.com|g' "$file"
    sed -i 's|paul\.copplest\.one|zaylegend.com|g' "$file"
    sed -i 's|https://twitter\.com/kiwicopple|https://twitter.com/zaylegend|g' "$file"
    sed -i 's|@kiwicopple|@zaylegend|g' "$file"
    sed -i 's|kiwicopple|zaylegend|g' "$file"
    sed -i 's|http://eepurl\.com/dE68jj|https://zaylegend.com|g' "$file"
    sed -i 's|Techie and entrepreneur|Knowledge repository and learning insights|g' "$file"
    
    # Update GitHub edit links
    sed -i 's|https://github\.com/kiwicopple/paul\.copplest\.one/edit/master/docs/knowledge/|https://github.com/yetog/yetog/knowledge-base/edit/main/|g' "$file"
    
    # Remove HTTrack comments
    sed -i '/<!-- Mirrored from paul\.copplest\.one/d' "$file"
    sed -i '/<!-- Added by HTTrack -->/d' "$file"
    sed -i '/<!-- \/Added by HTTrack -->/d' "$file"
    
done <<< "$HTML_FILES"

# Update CSS and JS references to use local assets
echo "🎨 Updating asset references..."
while IFS= read -r file; do
    # Replace external CSS/JS links with local ones
    sed -i 's|https://paul\.copplest\.one/assets/|assets/|g' "$file"
done <<< "$HTML_FILES"

echo "✅ Branding update complete!"
echo "📋 Summary:"
echo "   - Updated $total HTML files"
echo "   - Replaced 'Paul Copplestone' with 'Isayah Young Burke'"
echo "   - Updated all URLs to point to zaylegend.com"
echo "   - Updated social media links"
echo "   - Fixed GitHub edit links"
echo "   - Removed HTTrack comments"
echo "   - Backup files created with .bak extension"

echo ""
echo "🚨 Important: Test the knowledge base to ensure everything works correctly!"
echo "📝 Backup files are available if you need to revert changes"