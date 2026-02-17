# SEO Schemas

This folder contains SEO schemas exported from Webflow for editing and management.

## Purpose
- Store exported SEO schemas from Webflow
- Make text edits to schema content
- Organize SEO content before importing back to Webflow

## Workflow
1. Export SEO schemas from Webflow
2. Place files in this folder
3. Make necessary text edits
4. Import updated schemas back to Webflow

## File Organization
You can organize files by:
- Date (YYYY-MM-DD format)
- Page name
- Schema type
- Any other structure that fits your workflow

## File format

Keep the **full snippet as exported from Webflow** (with `<script type="application/ld+json">...</script>` wrapper). That way you can paste the file content straight back into Webflow Custom Code without adding the script tag. Use any extension you like (e.g. `.json`); the important part is that the content includes the script tag.

## Notes
- Keep original files as backups when making significant changes
- Use descriptive file names for easy identification
