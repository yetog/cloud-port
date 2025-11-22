#!/bin/bash

# Script to fix CSS/JS asset references while keeping proper branding
echo "🔧 Fixing asset references in knowledge base..."

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
    echo "[$count/$total] Fixing assets in $file"
    
    # Fix CSS and JS references to use local assets
    sed -i 's|https://zaylegend\.com/assets/|assets/|g' "$file"
    
    # Also ensure any remaining paul.copplest.one assets use local paths
    sed -i 's|https://paul\.copplest\.one/assets/|assets/|g' "$file"
    
done <<< "$HTML_FILES"

echo "✅ Asset references fixed!"
echo "📋 Summary:"
echo "   - Updated $total HTML files"
echo "   - Fixed CSS/JS asset references to use local assets"
echo "   - Kept proper Isayah Young Burke branding"