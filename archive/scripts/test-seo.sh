#!/bin/bash

# SEO Testing Script for Module-Based Articles
# Usage: ./test-seo.sh [article-slug]

BASE_URL="http://localhost:3000"
ARTICLE_SLUG=${1:-"module-based-approach"}
FULL_URL="$BASE_URL/articles/$ARTICLE_SLUG"

echo "🔍 Testing SEO for: $FULL_URL"
echo "=================================================="

# Test 1: Check if page loads
echo "📄 Testing page response..."
HTTP_STATUS=$(curl -s -o /dev/null -w "%{http_code}" "$FULL_URL")
if [ "$HTTP_STATUS" == "200" ]; then
    echo "✅ Page loads successfully (HTTP $HTTP_STATUS)"
else
    echo "❌ Page failed to load (HTTP $HTTP_STATUS)"
    exit 1
fi

echo ""

# Test 2: Extract meta tags
echo "🏷️ Extracting meta tags..."
echo ""

# Get the HTML content
HTML_CONTENT=$(curl -s "$FULL_URL")

# Extract title
TITLE=$(echo "$HTML_CONTENT" | grep -o '<title[^>]*>[^<]*</title>' | sed 's/<[^>]*>//g')
echo "📝 Title: $TITLE"

# Extract description
DESCRIPTION=$(echo "$HTML_CONTENT" | grep -o 'name="description" content="[^"]*"' | sed 's/name="description" content="//g' | sed 's/"$//g')
echo "📝 Description: $DESCRIPTION"

# Extract OpenGraph tags
OG_TITLE=$(echo "$HTML_CONTENT" | grep -o 'property="og:title" content="[^"]*"' | sed 's/property="og:title" content="//g' | sed 's/"$//g')
OG_DESCRIPTION=$(echo "$HTML_CONTENT" | grep -o 'property="og:description" content="[^"]*"' | sed 's/property="og:description" content="//g' | sed 's/"$//g')
OG_IMAGE=$(echo "$HTML_CONTENT" | grep -o 'property="og:image" content="[^"]*"' | sed 's/property="og:image" content="//g' | sed 's/"$//g')

echo ""
echo "🌐 OpenGraph tags:"
echo "   og:title: $OG_TITLE"
echo "   og:description: $OG_DESCRIPTION"
echo "   og:image: $OG_IMAGE"

# Extract Twitter tags
TWITTER_CARD=$(echo "$HTML_CONTENT" | grep -o 'name="twitter:card" content="[^"]*"' | sed 's/name="twitter:card" content="//g' | sed 's/"$//g')
TWITTER_TITLE=$(echo "$HTML_CONTENT" | grep -o 'name="twitter:title" content="[^"]*"' | sed 's/name="twitter:title" content="//g' | sed 's/"$//g')

echo ""
echo "🐦 Twitter tags:"
echo "   twitter:card: $TWITTER_CARD"
echo "   twitter:title: $TWITTER_TITLE"

echo ""

# Test 3: Check cover image
if [ ! -z "$OG_IMAGE" ]; then
    echo "🖼️ Testing cover image..."
    IMAGE_URL="$BASE_URL$OG_IMAGE"
    IMAGE_STATUS=$(curl -s -o /dev/null -w "%{http_code}" "$IMAGE_URL")
    if [ "$IMAGE_STATUS" == "200" ]; then
        echo "✅ Cover image loads successfully ($IMAGE_URL)"
    else
        echo "❌ Cover image failed to load: $IMAGE_URL (HTTP $IMAGE_STATUS)"
    fi
else
    echo "⚠️ No OpenGraph image found"
fi

echo ""
echo "🚀 Quick test links:"
echo "📘 Facebook: https://developers.facebook.com/tools/debug/?q=$(echo "$FULL_URL" | sed 's/:/%3A/g' | sed 's/\//%2F/g')"
echo "🌐 OpenGraph: https://www.opengraph.xyz/?url=$(echo "$FULL_URL" | sed 's/:/%3A/g' | sed 's/\//%2F/g')"
echo "🐦 Twitter: https://cards-dev.twitter.com/validator"
echo ""
echo "✨ Test complete!"
