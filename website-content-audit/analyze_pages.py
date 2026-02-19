#!/usr/bin/env python3
"""
Script to analyze ModulEdge website pages for technical specification updates
"""
import re
import json

# Main pages to analyze (excluding individual blog posts and case studies)
MAIN_PAGES = [
    {"url": "https://www.moduledge.com/", "name": "Home"},
    {"url": "https://www.moduledge.com/customization", "name": "Customization"},
    {"url": "https://www.moduledge.com/partner-program", "name": "Partner Program"},
    {"url": "https://www.moduledge.com/about", "name": "About"},
    {"url": "https://www.moduledge.com/case-study", "name": "Case Studies"},
    {"url": "https://www.moduledge.com/contact-us", "name": "Contact Us"},
    {"url": "https://www.moduledge.com/blog", "name": "Blog"},
]

# Patterns to find (case-insensitive)
PATTERNS = {
    "power_5_50": [
        r"5\s*[-–]\s*50\s*kW",
        r"5\s*to\s*50\s*kW",
        r"5-50\s*kW",
        r"5–50\s*kW",
    ],
    "tier_iii_only": [
        r"Tier\s+III(?!\s*/\s*IV)",  # Tier III but not followed by /IV
        r"Tier\s+3(?!\s*/\s*4)",     # Tier 3 but not followed by /4
    ]
}

def find_issues_in_text(text, page_name, url):
    """Find all instances of old technical specs in text"""
    issues = []
    
    # Find power specifications (5-50 kW)
    for pattern in PATTERNS["power_5_50"]:
        matches = re.finditer(pattern, text, re.IGNORECASE)
        for match in matches:
            # Get context around the match
            start = max(0, match.start() - 100)
            end = min(len(text), match.end() + 100)
            context = text[start:end].strip()
            
            issues.append({
                "page": page_name,
                "url": url,
                "type": "power_spec",
                "found": match.group(),
                "should_be": "5–150 kW",
                "context": context,
                "position": match.start()
            })
    
    # Find Tier III mentions (without /IV)
    for pattern in PATTERNS["tier_iii_only"]:
        matches = re.finditer(pattern, text, re.IGNORECASE)
        for match in matches:
            # Get context around the match
            start = max(0, match.start() - 100)
            end = min(len(text), match.end() + 100)
            context = text[start:end].strip()
            
            issues.append({
                "page": page_name,
                "url": url,
                "type": "tier_cert",
                "found": match.group(),
                "should_be": "Tier III/IV",
                "context": context,
                "position": match.start()
            })
    
    return issues

# This will be filled with actual page content
# For now, it's a placeholder for the structure
if __name__ == "__main__":
    print("Analysis script ready. Need to fetch page content via browser.")
    print(json.dumps(MAIN_PAGES, indent=2))
