#!/bin/bash

# Markdown to Knowledge Base HTML Converter
# Converts Infrastructure Documentation to Knowledge Base format
# Preserves branding, navigation, and styling

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
BOLD='\033[1m'
NC='\033[0m'

# Helper functions
log_info() { echo -e "${BLUE}ℹ️  $1${NC}"; }
log_success() { echo -e "${GREEN}✅ $1${NC}"; }
log_warning() { echo -e "${YELLOW}⚠️  $1${NC}"; }
log_error() { echo -e "${RED}❌ $1${NC}"; }
log_header() { echo -e "\n${BOLD}${BLUE}=== $1 ===${NC}"; }

# Configuration
DOCS_SOURCE_DIR="/var/www/zaylegend/infrastructure-docs"
KB_TARGET_DIR="/var/www/zaylegend/apps/knowledge-base"
KB_INFRASTRUCTURE_DIR="$KB_TARGET_DIR/infrastructure"

# Markdown files to convert
declare -A MARKDOWN_FILES=(
    ["README.md"]="index.html"
    ["overview.md"]="overview.html"
    ["ci-cd-pipeline.md"]="ci-cd-pipeline.html"
    ["docker-strategy.md"]="docker-strategy.html"
    ["deployment-process.md"]="deployment-process.html"
    ["server-configuration.md"]="server-configuration.html"
    ["orchestration-guide.md"]="orchestration-guide.html"
)

# Page titles and descriptions
declare -A PAGE_TITLES=(
    ["README.md"]="Infrastructure Documentation"
    ["overview.md"]="Infrastructure Overview"
    ["ci-cd-pipeline.md"]="CI/CD Pipeline"
    ["docker-strategy.md"]="Docker Strategy"
    ["deployment-process.md"]="Deployment Process"
    ["server-configuration.md"]="Server Configuration"
    ["orchestration-guide.md"]="Orchestration Guide"
)

declare -A PAGE_DESCRIPTIONS=(
    ["README.md"]="Complete infrastructure documentation for zaylegend.com portfolio platform"
    ["overview.md"]="High-level architecture and technology stack overview"
    ["ci-cd-pipeline.md"]="Continuous integration and deployment workflows"
    ["docker-strategy.md"]="Containerization approach and management strategies"
    ["deployment-process.md"]="Step-by-step deployment procedures and best practices"
    ["server-configuration.md"]="Nginx, SSL, and system configuration details"
    ["orchestration-guide.md"]="Complete infrastructure recreation and setup guide"
)

# Install required tools if not present
install_dependencies() {
    log_info "Checking dependencies..."
    
    # Check if pandoc is installed
    if ! command -v pandoc &> /dev/null; then
        log_warning "pandoc not found, installing..."
        sudo apt update && sudo apt install -y pandoc
    fi
    
    # Check if python3 and markdown library are available
    if ! python3 -c "import markdown" &> /dev/null; then
        log_warning "Python markdown library not found, installing..."
        sudo apt install -y python3-pip
        pip3 install markdown markdown-extensions
    fi
    
    log_success "Dependencies checked"
}

# Create infrastructure directory in knowledge base
create_infrastructure_directory() {
    log_info "Creating infrastructure directory..."
    mkdir -p "$KB_INFRASTRUCTURE_DIR"
    log_success "Infrastructure directory created: $KB_INFRASTRUCTURE_DIR"
}

# Convert markdown to HTML with knowledge base styling
convert_markdown_to_html() {
    local md_file="$1"
    local html_file="$2"
    local title="$3"
    local description="$4"
    
    log_info "Converting $md_file to $html_file..."
    
    # Read the markdown content
    local md_content
    md_content=$(cat "$DOCS_SOURCE_DIR/$md_file")
    
    # Convert markdown to HTML using Python markdown
    local html_content
    html_content=$(python3 -c "
import markdown
import sys
import re

# Read markdown content
with open('$DOCS_SOURCE_DIR/$md_file', 'r') as f:
    md_content = f.read()

# Configure markdown with extensions
md = markdown.Markdown(extensions=[
    'markdown.extensions.codehilite',
    'markdown.extensions.fenced_code',
    'markdown.extensions.tables',
    'markdown.extensions.toc',
    'markdown.extensions.attr_list',
    'markdown.extensions.def_list'
], extension_configs={
    'codehilite': {
        'css_class': 'language-',
        'use_pygments': False
    }
})

# Convert to HTML
html_content = md.convert(md_content)

# Post-process HTML for knowledge base compatibility
html_content = re.sub(r'<h1 id=\"([^\"]*)\"><a href=\"[^\"]*\" class=\"header-anchor\">#</a> ([^<]*)</h1>', 
                     r'<h1 id=\"\1\"><a href=\"#\1\" class=\"header-anchor\">#</a> \2</h1>', html_content)

# Add header anchors to all headings
html_content = re.sub(r'<h([2-6]) id=\"([^\"]*)\">([^<]*)</h([2-6])>', 
                     r'<h\1 id=\"\2\"><a href=\"#\2\" class=\"header-anchor\">#</a> \3</h\4>', html_content)

# Fix code blocks
html_content = re.sub(r'<pre><code class=\"language-([^\"]*)\">',
                     r'<div class=\"language-\1 extra-class\"><pre class=\"language-\1\"><code>', html_content)
html_content = re.sub(r'</code></pre>', r'</code></pre></div>', html_content)

print(html_content)
")
    
    # Create the complete HTML file with knowledge base template
    create_html_page "$html_file" "$title" "$description" "$html_content"
    
    log_success "Converted $md_file to $html_file"
}

# Create complete HTML page with knowledge base branding
create_html_page() {
    local html_file="$1"
    local title="$2" 
    local description="$3"
    local content="$4"
    
    # Determine relative path for assets based on file location
    local asset_path="../"
    if [[ "$html_file" == "index.html" ]]; then
        asset_path="../"
    else
        asset_path="../"
    fi
    
    cat > "$KB_INFRASTRUCTURE_DIR/$html_file" << EOF
<!DOCTYPE html>
<html lang="en-US">

<head>
 <meta charset="utf-8">
    <link rel="icon" type="image/x-icon" href="${asset_path}favicon.ico">
    <link rel="apple-touch-icon" href="${asset_path}favicon.ico">
 <meta name="viewport" content="width=device-width,initial-scale=1">
 <title>$title | Isayah Young Burke</title>
 <meta name="generator" content="VuePress 1.9.9">

 <meta name="description" content="$description">
    <meta property="og:title" content="Isayah Young Burke - Infrastructure Documentation">
    <meta property="og:description" content="$description">
    <meta property="og:image" content="https://portfoliowebsite.s3.us-central-1.ionoscloud.com/favicon.jpg">
    <meta property="og:url" content="https://zaylegend.com/knowledge-base/">
    <meta property="og:type" content="website">
    <meta name="twitter:card" content="summary">
    <meta name="twitter:site" content="@zaylegend">
    <meta name="twitter:creator" content="@zaylegend">

 <link rel="preload" href="${asset_path}assets/css/styles.css" as="style">
 <link rel="preload" href="${asset_path}assets/js/search.js" as="script">
 <link rel="stylesheet" href="${asset_path}assets/css/styles.css">
 <link rel="stylesheet" href="${asset_path}assets/css/custom.css">
 </head>
 <body>
 <div id="app" data-server-rendered="true"><div class="theme-container"><header class="navbar"><div class="sidebar-button"><svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" role="img" viewBox="0 0 448 512" class="icon"><path fill="currentColor" d="M436 124H12c-6.627 0-12-5.373-12-12V80c0-6.627 5.373-12 12-12h424c6.627 0 12 5.373 12 12v32c0 6.627-5.373 12-12 12zm0 160H12c-6.627 0-12-5.373-12-12v-32c0-6.627 5.373-12 12-12h424c6.627 0 12 5.373 12 12v32c0 6.627-5.373 12-12 12zm0 160H12c-6.627 0-12-5.373-12-12v-32c0-6.627 5.373-12 12-12h424c6.627 0 12 5.373 12 12v32c0 6.627-5.373 12-12 12z"></path></svg></div> <a href="https://zaylegend.com/" class="home-link router-link-active"><!----> <span class="site-name">Isayah Young Burke</span></a> <div class="links"><div class="search-box"><input aria-label="Search" autocomplete="off" spellcheck="false" value=""> <!----></div> <nav class="nav-links can-hide"><div class="nav-item"><a href="https://zaylegend.com/blog/" class="nav-link">
 Blog
</a></div><div class="nav-item"><a href="../index.html" class="nav-link router-link-active">
 Knowledge
</a></div><div class="nav-item"><a href="https://zaylegend.com" target="_blank" rel="noopener noreferrer" class="nav-link external">
 Subscribe
 <span><svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false" x="0px" y="0px" viewBox="0 0 100 100" width="15" height="15" class="icon outbound"><path fill="currentColor" d="M18.8,85.1h56l0,0c2.2,0,4-1.8,4-4v-32h-8v28h-48v-48h28v-8h-32l0,0c-2.2,0-4,1.8-4,4v56C14.8,83.3,16.6,85.1,18.8,85.1z"></path> <polygon fill="currentColor" points="45.7,48.7 51.3,54.3 77.2,28.5 77.2,37.2 85.2,37.2 85.2,14.9 62.8,14.9 62.8,22.9 71.5,22.9"></polygon></svg> <span class="sr-only">(opens new window)</span></span></a></div><div class="nav-item"><a href="https://twitter.com/zaylegend" target="_blank" rel="noopener noreferrer" class="nav-link external">
 Twitter
 <span><svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false" x="0px" y="0px" viewBox="0 0 100 100" width="15" height="15" class="icon outbound"><path fill="currentColor" d="M18.8,85.1h56l0,0c2.2,0,4-1.8,4-4v-32h-8v28h-48v-48h28v-8h-32l0,0c-2.2,0-4,1.8-4,4v56C14.8,83.3,16.6,85.1,18.8,85.1z"></path> <polygon fill="currentColor" points="45.7,48.7 51.3,54.3 77.2,28.5 77.2,37.2 85.2,37.2 85.2,14.9 62.8,14.9 62.8,22.9 71.5,22.9"></polygon></svg> <span class="sr-only">(opens new window)</span></span></a></div> <!----></nav></div></header> <div class="sidebar-mask"></div> <aside class="sidebar"><nav class="nav-links"><div class="nav-item"><a href="https://zaylegend.com/blog/" class="nav-link">
 Blog
</a></div><div class="nav-item"><a href="../index.html" class="nav-link router-link-active">
 Knowledge
</a></div><div class="nav-item"><a href="https://zaylegend.com" target="_blank" rel="noopener noreferrer" class="nav-link external">
 Subscribe
 <span><svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false" x="0px" y="0px" viewBox="0 0 100 100" width="15" height="15" class="icon outbound"><path fill="currentColor" d="M18.8,85.1h56l0,0c2.2,0,4-1.8,4-4v-32h-8v28h-48v-48h28v-8h-32l0,0c-2.2,0-4,1.8-4,4v56C14.8,83.3,16.6,85.1,18.8,85.1z"></path> <polygon fill="currentColor" points="45.7,48.7 51.3,54.3 77.2,28.5 77.2,37.2 85.2,37.2 85.2,14.9 62.8,14.9 62.8,22.9 71.5,22.9"></polygon></svg> <span class="sr-only">(opens new window)</span></span></a></div><div class="nav-item"><a href="https://twitter.com/zaylegend" target="_blank" rel="noopener noreferrer" class="nav-link external">
 Twitter
 <span><svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false" x="0px" y="0px" viewBox="0 0 100 100" width="15" height="15" class="icon outbound"><path fill="currentColor" d="M18.8,85.1h56l0,0c2.2,0,4-1.8,4-4v-32h-8v28h-48v-48h28v-8h-32l0,0c-2.2,0-4,1.8-4,4v56C14.8,83.3,16.6,85.1,18.8,85.1z"></path> <polygon fill="currentColor" points="45.7,48.7 51.3,54.3 77.2,28.5 77.2,37.2 85.2,37.2 85.2,14.9 62.8,14.9 62.8,22.9 71.5,22.9"></polygon></svg> <span class="sr-only">(opens new window)</span></span></a></div> <!----></nav> <ul class="sidebar-links"><li><section class="sidebar-group depth-0"><p class="sidebar-heading"><span>Miscellaneous</span> <!----></p> <ul class="sidebar-links sidebar-group-items"><li><a class='sidebar-link' href='../chess.html'>Chess</a></li><li><a class='sidebar-link' href='../climbing.html'>Climbing</a></li><li><a class='sidebar-link' href='../consciousness.html'>Consciousness</a></li><li><a class='sidebar-link' href='../languages.html'>Languages</a></li><li><a class='sidebar-link' href='../mathematics.html'>Mathematics</a></li><li><a class='sidebar-link' href='../meditation.html'>Meditation</a></li><li><a class='sidebar-link' href='../mimetic-theory.html'>Mimetic Theory</a></li><li><a class='sidebar-link' href='../music.html'>Music</a></li><li><a class='sidebar-link' href='../physics.html'>Physics</a></li><li><a class='sidebar-link' href='../public-speaking.html'>Public Speaking</a></li><li><a class='sidebar-link' href='../pyrolysis.html'>Pyrolysis</a></li><li><a class='sidebar-link' href='../relationships.html'>Relationships</a></li><li><a class='sidebar-link' href='../soil.html'>Soil Health</a></li><li><a class='sidebar-link' href='../space.html'>Space</a></li><li><a class='sidebar-link' href='../trees.html'>Trees</a></li><li><a class='sidebar-link' href='../writing.html'>Writing</a></li><li><a class='sidebar-link' href='../zoology.html'>Zoology</a></li></ul></section></li><li><section class="sidebar-group depth-0"><p class="sidebar-heading"><span>Tech</span> <!----></p> <ul class="sidebar-links sidebar-group-items"><li><a class='sidebar-link' href='../tech/ai-development.html'>AI Development</a></li><li><a class='sidebar-link' href='../tech/development-workflows.html'>Development Workflows</a></li><li><a class='sidebar-link' href='../tech/session-recaps.html'>Session Recaps</a></li><li><a class='sidebar-link' href='../tech/automation-tools.html'>Automation Tools</a></li><li><a class='sidebar-link' href='../tech/awesome-list.html'>Awesome List</a></li><li><a class='sidebar-link' href='../tech/bash-profile.html'>MacOS Bash Profile</a></li><li><a class='sidebar-link' href='../tech/docker.html'>Docker Cheatsheet</a></li><li><a class='sidebar-link' href='../tech/html-cheatsheet.html'>HTML Cheatsheet</a></li><li><a class='sidebar-link' href='../tech/macos-tips.html'>MacOS tips</a></li><li><a class='sidebar-link' href='../tech/mental-models.html'>Mental Models</a></li><li><a class='sidebar-link' href='../tech/postgresql.html'>PostgreSQL cheatsheet</a></li><li><a class='sidebar-link' href='../tech/postgres-data.html'>Loading JSON into Postgres</a></li><li><a class='sidebar-link' href='../tech/regex.html'>Regex Cheatsheet</a></li><li><a class='sidebar-link' href='../tech/secrets-management-sops.html'>Secrets management - SOPS</a></li><li><a class='sidebar-link' href='../tech/seo.html'>SEO Cheatsheet</a></li><li><a class='sidebar-link' href='../tech/today-i-learned.html'>Today I Learned</a></li><li><a class='sidebar-link' href='../tech/vscode-snippets.html'>VSCode Snippets</a></li></ul></section></li><li><section class="sidebar-group depth-0"><p class="sidebar-heading open"><span>Infrastructure</span> <!----></p> <ul class="sidebar-links sidebar-group-items"><li><a class='sidebar-link' href='index.html'>Documentation Overview</a></li><li><a class='sidebar-link' href='overview.html'>Architecture Overview</a></li><li><a class='sidebar-link' href='ci-cd-pipeline.html'>CI/CD Pipeline</a></li><li><a class='sidebar-link' href='docker-strategy.html'>Docker Strategy</a></li><li><a class='sidebar-link' href='deployment-process.html'>Deployment Process</a></li><li><a class='sidebar-link' href='server-configuration.html'>Server Configuration</a></li><li><a class='sidebar-link' href='orchestration-guide.html'>Orchestration Guide</a></li></ul></section></li><li><section class="sidebar-group depth-0"><p class="sidebar-heading"><span>Courses</span> <!----></p> <ul class="sidebar-links sidebar-group-items"><li><section class="sidebar-group depth-1"><p class="sidebar-heading"><span>AI Engineering</span> <!----></p> <ul class="sidebar-links sidebar-group-items"><li><a class='sidebar-link' href='../ai-engineering/index.html'>Course Overview</a></li><li><a class='sidebar-link' href='../ai-engineering/syllabus.html'>Full Syllabus</a></li><li><a class='sidebar-link' href='../ai-engineering/foundations.html'>Foundations (Week 0-1)</a></li><li><a class='sidebar-link' href='../ai-engineering/core-applications.html'>Core Applications (Week 2-3)</a></li><li><a class='sidebar-link' href='../ai-engineering/advanced-techniques.html'>Advanced Techniques (Week 4-5)</a></li><li><a class='sidebar-link' href='../ai-engineering/capstone-advanced.html'>Capstone & Advanced (Week 6-7)</a></li></ul></section></li><li><a class='sidebar-link' href='../courses/mindfulness.html'>Mindfulness Course</a></li></ul></section></li><li><section class="sidebar-group depth-0"><p class="sidebar-heading"><span>Business</span> <!----></p> <ul class="sidebar-links sidebar-group-items"><li><a class='sidebar-link' href='../business/hiring.html'>Hiring</a></li><li><a class='sidebar-link' href='../business/management.html'>Management</a></li><li><a class='sidebar-link' href='../business/sales.html'>Sales</a></li><li><a class='sidebar-link' href='../business/marketing.html'>Marketing</a></li><li><a class='sidebar-link' href='../business/fundraising.html'>Fundraising</a></li><li><a class='sidebar-link' href='../business/resources.html'>Startup Resources</a></li></ul></section></li><li><section class="sidebar-group depth-0"><p class="sidebar-heading"><span>Levels</span> <!----></p> <ul class="sidebar-links sidebar-group-items"><li><a class='sidebar-link' href='../levels/business.html'>Business</a></li><li><a class='sidebar-link' href='../levels/life.html'>Life</a></li><li><a class='sidebar-link' href='../levels/leadership.html'>Leadership</a></li><li><a class='sidebar-link' href='../levels/learning.html'>Learning</a></li></ul></section></li><li><section class="sidebar-group depth-0"><p class="sidebar-heading"><span>Philosophy</span> <!----></p> <ul class="sidebar-links sidebar-group-items"><li><a class='sidebar-link' href='../philosophy/ethics.html'>Ethics</a></li><li><a class='sidebar-link' href='../philosophy/buddhism.html'>Buddhism</a></li><li><a class='sidebar-link' href='../philosophy/stoicism.html'>Stoicism</a></li><li><a class='sidebar-link' href='../philosophy/desire.html'>Desire</a></li></ul></section></li><li><section class="sidebar-group depth-0"><p class="sidebar-heading"><span>People</span> <!----></p> <ul class="sidebar-links sidebar-group-items"><li><a class='sidebar-link' href='../people.html'>People</a></li><li><a class='sidebar-link' href='../people/lee-kuan-yew.html'>Lee Kuan Yew</a></li><li><a class='sidebar-link' href='../people/jensen-huang.html'>Jensen Huang</a></li><li><a class='sidebar-link' href='../people/elon-musk.html'>Elon Musk</a></li><li><a class='sidebar-link' href='../people/marlon-brando.html'>Marlon Brando</a></li><li><a class='sidebar-link' href='../people/nelson-mandela.html'>Nelson Mandela</a></li></ul></section></li></ul> </aside> <main class="page"> <div class="theme-default-content content__default">$content</div> <footer class="page-edit"><div class="edit-link"><a href="https://github.com/yetog/knowledge-base/edit/main/infrastructure/$md_file" target="_blank" rel="noopener noreferrer">Edit this page</a> <span><svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false" x="0px" y="0px" viewBox="0 0 100 100" width="15" height="15" class="icon outbound"><path fill="currentColor" d="M18.8,85.1h56l0,0c2.2,0,4-1.8,4-4v-32h-8v28h-48v-48h28v-8h-32l0,0c-2.2,0-4,1.8-4,4v56C14.8,83.3,16.6,85.1,18.8,85.1z"></path> <polygon fill="currentColor" points="45.7,48.7 51.3,54.3 77.2,28.5 77.2,37.2 85.2,37.2 85.2,14.9 62.8,14.9 62.8,22.9 71.5,22.9"></polygon></svg> <span class="sr-only">(opens new window)</span></span></div> <div class="last-updated"><span class="prefix">Last Updated:</span> <span class="time">$(date)</span></div></footer> <!----> </main></div><div class="global-ui"></div></div>
 <script src="${asset_path}assets/js/search.js" defer></script>
 </body>

</html>
EOF
}

# Update sidebar navigation in all knowledge base pages
update_sidebar_navigation() {
    log_info "Updating sidebar navigation to include Infrastructure section..."
    
    # Find all HTML files in knowledge base
    local html_files
    mapfile -t html_files < <(find "$KB_TARGET_DIR" -name "*.html" -type f | grep -v "infrastructure/")
    
    for html_file in "\${html_files[@]}"; do
        # Skip if file doesn't exist or is empty
        if [[ ! -s "\$html_file" ]]; then
            continue
        fi
        
        # Check if Infrastructure section already exists
        if grep -q "Infrastructure" "\$html_file"; then
            log_info "Infrastructure section already exists in \$(basename "\$html_file")"
            continue
        fi
        
        log_info "Updating navigation in \$(basename "\$html_file")..."
        
        # Add Infrastructure section after Tech section
        sed -i '/<\/section><\/li><li><section class="sidebar-group depth-0"><p class="sidebar-heading"><span>Courses<\/span>/i\\
<li><section class="sidebar-group depth-0"><p class="sidebar-heading"><span>Infrastructure</span> <!----></p> <ul class="sidebar-links sidebar-group-items"><li><a class='"'"'sidebar-link'"'"' href='"'"'infrastructure/index.html'"'"'>Documentation Overview</a></li><li><a class='"'"'sidebar-link'"'"' href='"'"'infrastructure/overview.html'"'"'>Architecture Overview</a></li><li><a class='"'"'sidebar-link'"'"' href='"'"'infrastructure/ci-cd-pipeline.html'"'"'>CI/CD Pipeline</a></li><li><a class='"'"'sidebar-link'"'"' href='"'"'infrastructure/docker-strategy.html'"'"'>Docker Strategy</a></li><li><a class='"'"'sidebar-link'"'"' href='"'"'infrastructure/deployment-process.html'"'"'>Deployment Process</a></li><li><a class='"'"'sidebar-link'"'"' href='"'"'infrastructure/server-configuration.html'"'"'>Server Configuration</a></li><li><a class='"'"'sidebar-link'"'"' href='"'"'infrastructure/orchestration-guide.html'"'"'>Orchestration Guide</a></li></ul></section></li>' "\$html_file"
    done
    
    log_success "Sidebar navigation updated"
}

# Main conversion process
main() {
    log_header "Infrastructure Documentation to Knowledge Base Converter"
    
    # Check source directory exists
    if [[ ! -d "$DOCS_SOURCE_DIR" ]]; then
        log_error "Source directory not found: $DOCS_SOURCE_DIR"
        exit 1
    fi
    
    # Check target directory exists
    if [[ ! -d "$KB_TARGET_DIR" ]]; then
        log_error "Knowledge base directory not found: $KB_TARGET_DIR"
        exit 1
    fi
    
    # Install dependencies
    install_dependencies
    
    # Create infrastructure directory
    create_infrastructure_directory
    
    # Convert all markdown files
    log_header "Converting Markdown Files"
    for md_file in "\${!MARKDOWN_FILES[@]}"; do
        if [[ -f "$DOCS_SOURCE_DIR/$md_file" ]]; then
            convert_markdown_to_html "\$md_file" "\${MARKDOWN_FILES[\$md_file]}" "\${PAGE_TITLES[\$md_file]}" "\${PAGE_DESCRIPTIONS[\$md_file]}"
        else
            log_warning "Source file not found: $md_file"
        fi
    done
    
    # Copy favicon to infrastructure directory
    if [[ -f "$KB_TARGET_DIR/favicon.ico" ]]; then
        cp "$KB_TARGET_DIR/favicon.ico" "$KB_INFRASTRUCTURE_DIR/"
    fi
    
    # Update sidebar navigation
    update_sidebar_navigation
    
    log_header "Conversion Summary"
    log_success "Infrastructure documentation successfully integrated into knowledge base!"
    log_info "Available at: https://zaylegend.com/knowledge-base/infrastructure/"
    
    echo
    log_header "Next Steps"
    echo "1. Review the generated HTML files in $KB_INFRASTRUCTURE_DIR"
    echo "2. Test the pages locally: open $KB_INFRASTRUCTURE_DIR/index.html"
    echo "3. Commit and push to knowledge base repository"
    echo "4. Verify live deployment at https://zaylegend.com/knowledge-base/infrastructure/"
}

# Help function
show_help() {
    echo "Infrastructure Documentation to Knowledge Base Converter"
    echo ""
    echo "This script converts the infrastructure documentation from Markdown"
    echo "to HTML format compatible with the existing knowledge base styling."
    echo ""
    echo "Usage:"
    echo "  $0                # Convert all documentation"
    echo "  $0 --help         # Show this help"
    echo ""
    echo "Features:"
    echo "  - Preserves knowledge base branding and styling"
    echo "  - Adds navigation sidebar integration"
    echo "  - Converts Markdown to properly formatted HTML"
    echo "  - Maintains search functionality compatibility"
    echo "  - Includes proper meta tags and SEO"
    echo ""
    echo "Source: $DOCS_SOURCE_DIR"
    echo "Target: $KB_INFRASTRUCTURE_DIR"
}

# Check arguments
if [[ "\$1" == "--help" || "\$1" == "-h" ]]; then
    show_help
    exit 0
fi

# Run main function
main "\$@"