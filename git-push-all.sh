#!/bin/bash

# Git Push All Apps Script
# Automatically commits and pushes changes across all portfolio applications
# Usage: ./git-push-all.sh [commit-message]

set -e  # Exit on error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
BOLD='\033[1m'
NC='\033[0m' # No Color

# Configuration
APPS_DIR="/var/www/zaylegend/apps"
MAIN_BRANCH="main"
BACKUP_BRANCH="master"

# Function to print colored output
print_status() {
    echo -e "${BLUE}[$(date '+%H:%M:%S')]${NC} $1"
}

print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

print_header() {
    echo -e "\n${BOLD}${BLUE}=== $1 ===${NC}"
}

# Function to detect changes and generate commit message
generate_commit_message() {
    local repo_path="$1"
    local custom_message="$2"
    
    cd "$repo_path"
    
    # If custom message provided, use it
    if [ -n "$custom_message" ]; then
        echo "$custom_message"
        return
    fi
    
    # Auto-generate based on changes
    local modified_files=$(git diff --name-only HEAD 2>/dev/null || git diff --name-only 2>/dev/null || echo "")
    local new_files=$(git ls-files --others --exclude-standard 2>/dev/null || echo "")
    local deleted_files=$(git diff --name-only --diff-filter=D HEAD 2>/dev/null || echo "")
    
    local changes=()
    local file_count=0
    
    # Count and categorize changes
    if [ -n "$modified_files" ]; then
        local mod_count=$(echo "$modified_files" | wc -l)
        file_count=$((file_count + mod_count))
        changes+=("updated $mod_count files")
    fi
    
    if [ -n "$new_files" ]; then
        local new_count=$(echo "$new_files" | wc -l)
        file_count=$((file_count + new_count))
        changes+=("added $new_count files")
    fi
    
    if [ -n "$deleted_files" ]; then
        local del_count=$(echo "$deleted_files" | wc -l)
        file_count=$((file_count + del_count))
        changes+=("deleted $del_count files")
    fi
    
    # Detect type of changes for better commit messages
    local commit_type="update"
    local commit_scope=""
    
    # Check for specific file patterns
    if echo "$modified_files $new_files" | grep -q "package\.json\|package-lock\.json\|yarn\.lock"; then
        commit_type="deps"
        commit_scope="dependencies"
    elif echo "$modified_files $new_files" | grep -q "\.md$\|README"; then
        commit_type="docs"
        commit_scope="documentation"
    elif echo "$modified_files $new_files" | grep -q "Dockerfile\|docker-compose\|\.dockerignore"; then
        commit_type="docker"
        commit_scope="containerization"
    elif echo "$modified_files $new_files" | grep -q "index\.html\|favicon"; then
        commit_type="feat"
        commit_scope="branding/UI"
    elif echo "$modified_files $new_files" | grep -q "\.github/workflows"; then
        commit_type="ci"
        commit_scope="GitHub Actions"
    elif echo "$modified_files $new_files" | grep -q "\.tsx\?\|\.jsx\?\|\.vue\|\.svelte"; then
        commit_type="feat"
        commit_scope="components"
    elif echo "$modified_files $new_files" | grep -q "\.css\|\.scss\|\.less"; then
        commit_type="style"
        commit_scope="styling"
    fi
    
    # Generate descriptive commit message
    local change_desc=$(IFS=', '; echo "${changes[*]}")
    
    if [ -n "$commit_scope" ]; then
        echo "${commit_type}(${commit_scope}): ${change_desc}"
    else
        echo "${commit_type}: ${change_desc}"
    fi
}

# Function to process a single repository
process_repo() {
    local app_name="$1"
    local custom_message="$2"
    local repo_path="${APPS_DIR}/${app_name}"
    
    print_header "$app_name"
    
    # Check if directory exists
    if [ ! -d "$repo_path" ]; then
        print_warning "Directory $repo_path does not exist, skipping..."
        return 1
    fi
    
    cd "$repo_path"
    
    # Check if it's a git repository
    if [ ! -d ".git" ]; then
        print_warning "$app_name is not a git repository, skipping..."
        return 1
    fi
    
    # Check for changes
    if git diff --quiet && git diff --cached --quiet; then
        local untracked=$(git ls-files --others --exclude-standard)
        if [ -z "$untracked" ]; then
            print_status "$app_name has no changes to commit"
            return 0
        fi
    fi
    
    # Get current branch
    local current_branch=$(git branch --show-current 2>/dev/null || echo "")
    if [ -z "$current_branch" ]; then
        current_branch=$(git rev-parse --abbrev-ref HEAD 2>/dev/null || echo "main")
    fi
    
    print_status "Current branch: $current_branch"
    
    # Show what will be committed
    print_status "Changes to be committed:"
    git status --porcelain | head -10
    if [ $(git status --porcelain | wc -l) -gt 10 ]; then
        echo "... and $(($(git status --porcelain | wc -l) - 10)) more files"
    fi
    
    # Add all changes
    print_status "Adding all changes..."
    git add .
    
    # Generate commit message
    local commit_message=$(generate_commit_message "$repo_path" "$custom_message")
    print_status "Commit message: $commit_message"
    
    # Create commit with enhanced message
    local full_commit_message="$commit_message

🤖 Generated with Claude Code (https://claude.ai/code)

Co-Authored-By: Claude <noreply@anthropic.com>"
    
    print_status "Creating commit..."
    if git commit -m "$full_commit_message"; then
        print_success "Commit created successfully"
    else
        print_error "Failed to create commit for $app_name"
        return 1
    fi
    
    # Check if remote exists
    if ! git remote get-url origin >/dev/null 2>&1; then
        print_warning "$app_name has no remote origin configured, skipping push..."
        return 1
    fi
    
    # Convert HTTPS remote to SSH if needed
    local remote_url=$(git remote get-url origin)
    if [[ "$remote_url" == https://github.com/* ]]; then
        local ssh_url=$(echo "$remote_url" | sed 's|https://github.com/|git@github.com:|')
        print_status "Converting remote from HTTPS to SSH: $ssh_url"
        git remote set-url origin "$ssh_url"
    fi
    
    # Push to remote
    print_status "Pushing to remote..."
    
    # Try with SSH key if available
    local push_command="git push origin $current_branch"
    if [ -f ~/.ssh/github_actions_deploy ]; then
        push_command="GIT_SSH_COMMAND='ssh -i ~/.ssh/github_actions_deploy' git push origin $current_branch"
    elif [ -f ~/.ssh/claude_code_ed25519 ]; then
        push_command="GIT_SSH_COMMAND='ssh -i ~/.ssh/claude_code_ed25519' git push origin $current_branch"
    fi
    
    if eval "$push_command"; then
        print_success "Successfully pushed $app_name to origin/$current_branch"
    else
        print_error "Failed to push $app_name"
        return 1
    fi
    
    return 0
}

# Main execution
main() {
    local custom_message="$1"
    local specific_app="$2"
    
    print_header "Portfolio Git Push Manager"
    print_status "Starting git operations..."
    
    # List of all applications
    local apps=("chord-genesis" "dj-visualizer" "fineline" "game-hub" "knowledge-base" "spritegen" "voice-assistant" "contentforge")
    
    local success_count=0
    local total_count=0
    local failed_apps=()
    
    # Process specific app or all apps
    if [ -n "$specific_app" ]; then
        apps=("$specific_app")
    fi
    
    for app in "${apps[@]}"; do
        total_count=$((total_count + 1))
        
        if process_repo "$app" "$custom_message"; then
            success_count=$((success_count + 1))
        else
            failed_apps+=("$app")
        fi
        
        echo # Empty line for readability
    done
    
    # Summary
    print_header "Summary"
    print_success "Successfully processed: $success_count/$total_count repositories"
    
    if [ ${#failed_apps[@]} -gt 0 ]; then
        print_warning "Failed repositories: ${failed_apps[*]}"
    fi
    
    print_status "Git push operation completed!"
}

# Help function
show_help() {
    echo "Portfolio Git Push Manager"
    echo ""
    echo "Usage:"
    echo "  $0                              # Process all apps with auto-generated messages"
    echo "  $0 \"Custom commit message\"      # Process all apps with custom message"
    echo "  $0 \"Custom message\" app-name   # Process specific app with custom message"
    echo ""
    echo "Examples:"
    echo "  $0"
    echo "  $0 \"Add dark mode toggle feature\""
    echo "  $0 \"Fix responsive design\" game-hub"
    echo ""
    echo "Available apps:"
    echo "  chord-genesis, dj-visualizer, fineline, game-hub,"
    echo "  knowledge-base, spritegen, voice-assistant, contentforge"
}

# Check arguments
if [ "$1" = "--help" ] || [ "$1" = "-h" ]; then
    show_help
    exit 0
fi

# Run main function
main "$1" "$2"