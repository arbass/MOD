/**
 * Article CTA Card Editor Utility
 *
 * Provides editing functionality for CTA cards in Webflow articles:
 * - Copy card HTML to clipboard
 * - Remove elements with visibility control
 * - Inline text editing with link click prevention
 * - Markdown editor popup for rich text sections
 */

// Constants for attribute selectors
const ATTR = {
  MAIN: 'article-cta-card',
  EDIT: 'article-cta-card-edit',
};

const VALUES = {
  COPY_HTML: 'copy-html',
  VISIBILITY: 'visibility',
  RICH_TEXT: 'rich-text',
  LINK: 'link',
};

/**
 * Check if element has a specific value in its article-cta-card attribute
 * Supports comma-separated values like "link,visibility"
 */
function hasAttributeValue(element: Element, value: string): boolean {
  const attrValue = element.getAttribute(ATTR.MAIN);
  if (!attrValue) return false;

  // Split by comma and check if value is in the list
  const values = attrValue.split(',').map((v) => v.trim().toLowerCase());
  return values.includes(value.toLowerCase());
}

/**
 * Get all elements that have a specific value in their article-cta-card attribute
 * Supports comma-separated values
 */
function getElementsWithValue(value: string, container: Element | Document = document): Element[] {
  // Get all elements with the attribute
  const allElements = container.querySelectorAll(`[${ATTR.MAIN}]`);

  // Filter to those containing the specific value
  return Array.from(allElements).filter((el) => hasAttributeValue(el, value));
}

// SVG Icons
const ICONS = {
  copy: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>`,
  check: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>`,
  trash: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>`,
  edit: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>`,
  link: `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path></svg>`,
};

// Styles to inject
const STYLES = `
  .article-cta-editor-btn {
    position: absolute;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 32px;
    height: 32px;
    border: none;
    border-radius: 6px;
    cursor: pointer;
    transition: all 0.2s ease;
    opacity: 0.7;
  }
  .article-cta-editor-btn:hover {
    opacity: 1;
    transform: scale(1.05);
  }
  .article-cta-copy-btn {
    top: 8px;
    right: 8px;
    background: #10B981;
    color: white;
    z-index: 1001;
  }
  .article-cta-copy-btn.copied {
    background: #059669;
  }
  .article-cta-delete-btn {
    top: 4px;
    right: 4px;
    background: #EF4444;
    color: white;
    z-index: 1002;
    width: 24px;
    height: 24px;
  }
  .article-cta-delete-btn:hover {
    background: #DC2626;
  }
  .article-cta-link-btn {
    top: 4px;
    right: 32px;
    background: #8B5CF6;
    color: white;
    z-index: 1002;
    width: 24px;
    height: 24px;
  }
  .article-cta-link-btn:hover {
    background: #7C3AED;
  }
  .article-cta-edit-indicator {
    top: 8px;
    right: 48px;
    background: #3B82F6;
    color: white;
    pointer-events: none;
    z-index: 1000;
  }
  [article-cta-card*="copy-html"] {
    position: relative;
  }
  [article-cta-card*="visibility"] {
    position: relative;
  }
  [article-cta-card-edit] [contenteditable="true"] {
    outline: 2px dashed #3B82F6;
    outline-offset: 2px;
    cursor: text;
  }
  [article-cta-card-edit] [contenteditable="true"]:focus {
    outline: 2px solid #3B82F6;
    background: rgba(59, 130, 246, 0.05);
  }
  
  /* Markdown Editor Modal Styles */
  .md-editor-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 10000;
    opacity: 0;
    visibility: hidden;
    transition: all 0.2s ease;
  }
  .md-editor-overlay.active {
    opacity: 1;
    visibility: visible;
  }
  .md-editor-modal {
    background: white;
    border-radius: 12px;
    width: 90%;
    max-width: 800px;
    max-height: 90vh;
    display: flex;
    flex-direction: column;
    box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
    transform: scale(0.95);
    transition: transform 0.2s ease;
  }
  .md-editor-overlay.active .md-editor-modal {
    transform: scale(1);
  }
  .md-editor-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 16px 20px;
    border-bottom: 1px solid #E5E7EB;
  }
  .md-editor-title {
    font-size: 18px;
    font-weight: 600;
    color: #111827;
    margin: 0;
  }
  .md-editor-close {
    background: none;
    border: none;
    font-size: 24px;
    cursor: pointer;
    color: #6B7280;
    padding: 4px;
    line-height: 1;
  }
  .md-editor-close:hover {
    color: #111827;
  }
  .md-editor-toolbar {
    display: flex;
    gap: 4px;
    padding: 12px 20px;
    border-bottom: 1px solid #E5E7EB;
    flex-wrap: wrap;
  }
  .md-editor-toolbar-btn {
    background: #F3F4F6;
    border: 1px solid #D1D5DB;
    border-radius: 6px;
    padding: 8px 12px;
    cursor: pointer;
    font-size: 13px;
    font-weight: 500;
    color: #374151;
    transition: all 0.15s ease;
  }
  .md-editor-toolbar-btn:hover {
    background: #E5E7EB;
    border-color: #9CA3AF;
  }
  .md-editor-toolbar-btn.active {
    background: #3B82F6;
    color: white;
    border-color: #3B82F6;
  }
  .md-editor-body {
    display: flex;
    flex: 1;
    overflow: hidden;
    min-height: 300px;
  }
  .md-editor-input-wrap {
    flex: 1;
    display: flex;
    flex-direction: column;
    border-right: 1px solid #E5E7EB;
  }
  .md-editor-preview-wrap {
    flex: 1;
    display: flex;
    flex-direction: column;
  }
  .md-editor-label {
    font-size: 12px;
    font-weight: 500;
    color: #6B7280;
    padding: 8px 16px;
    background: #F9FAFB;
    border-bottom: 1px solid #E5E7EB;
  }
  .md-editor-textarea {
    flex: 1;
    border: none;
    resize: none;
    padding: 16px;
    font-family: 'Monaco', 'Menlo', monospace;
    font-size: 14px;
    line-height: 1.6;
    outline: none;
  }
  .md-editor-preview {
    flex: 1;
    padding: 16px;
    overflow-y: auto;
    font-size: 14px;
    line-height: 1.6;
  }
  .md-editor-preview h1 {
    font-size: 24px;
    font-weight: 700;
    margin: 0 0 16px;
  }
  .md-editor-preview h2 {
    font-size: 20px;
    font-weight: 600;
    margin: 16px 0 12px;
  }
  .md-editor-preview h3 {
    font-size: 16px;
    font-weight: 600;
    margin: 12px 0 8px;
  }
  .md-editor-preview p {
    margin: 0 0 12px;
  }
  .md-editor-preview ul, .md-editor-preview ol {
    margin: 0 0 12px;
    padding-left: 24px;
  }
  .md-editor-preview li {
    margin: 4px 0;
  }
  .md-editor-preview strong {
    font-weight: 600;
  }
  .md-editor-preview em {
    font-style: italic;
  }
  .md-editor-footer {
    display: flex;
    justify-content: flex-end;
    gap: 12px;
    padding: 16px 20px;
    border-top: 1px solid #E5E7EB;
  }
  .md-editor-btn {
    padding: 10px 20px;
    border-radius: 6px;
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.15s ease;
  }
  .md-editor-btn-cancel {
    background: white;
    border: 1px solid #D1D5DB;
    color: #374151;
  }
  .md-editor-btn-cancel:hover {
    background: #F3F4F6;
  }
  .md-editor-btn-save {
    background: #10B981;
    border: 1px solid #10B981;
    color: white;
  }
  .md-editor-btn-save:hover {
    background: #059669;
    border-color: #059669;
  }
  
  /* Rich text click hint */
  [article-cta-card="rich-text"] {
    cursor: pointer;
    transition: outline 0.15s ease;
  }
  [article-cta-card-edit] [article-cta-card="rich-text"]:hover {
    outline: 2px dashed #8B5CF6;
    outline-offset: 2px;
  }
`;

/**
 * Inject required styles into the document
 */
function injectStyles(): void {
  if (document.getElementById('article-cta-editor-styles')) return;

  const styleEl = document.createElement('style');
  styleEl.id = 'article-cta-editor-styles';
  styleEl.textContent = STYLES;
  document.head.appendChild(styleEl);
}

/**
 * Clean HTML for copying - remove editor-specific elements and attributes
 */
function cleanHtmlForCopy(element: HTMLElement): string {
  const clone = element.cloneNode(true) as HTMLElement;

  // Remove all editor buttons (copy, delete, edit indicator)
  clone.querySelectorAll('.article-cta-editor-btn').forEach((el) => el.remove());

  // Remove contenteditable attributes
  clone.querySelectorAll('[contenteditable]').forEach((el) => {
    el.removeAttribute('contenteditable');
  });

  // Remove article-cta-card-edit attribute from root if present
  if (clone.hasAttribute('article-cta-card-edit')) {
    clone.removeAttribute('article-cta-card-edit');
  }

  // Remove editor-specific inline styles
  clone.querySelectorAll('*').forEach((el) => {
    const htmlEl = el as HTMLElement;
    if (htmlEl.style) {
      htmlEl.style.outline = '';
      htmlEl.style.outlineOffset = '';
    }
  });

  // Clean up any empty style attributes
  clone.querySelectorAll('[style=""]').forEach((el) => {
    el.removeAttribute('style');
  });

  return clone.outerHTML;
}

/**
 * Add copy button to elements with copy-html attribute
 */
function setupCopyButtons(): void {
  const copyElements = getElementsWithValue(VALUES.COPY_HTML);

  copyElements.forEach((element) => {
    const htmlElement = element as HTMLElement;

    // Skip if button already exists
    if (htmlElement.querySelector('.article-cta-copy-btn')) return;

    const copyBtn = document.createElement('button');
    copyBtn.className = 'article-cta-editor-btn article-cta-copy-btn';
    copyBtn.innerHTML = ICONS.copy;
    copyBtn.title = 'Copy HTML to clipboard';

    copyBtn.addEventListener('click', async (e) => {
      e.preventDefault();
      e.stopPropagation();

      const htmlToCopy = cleanHtmlForCopy(htmlElement);

      try {
        await navigator.clipboard.writeText(htmlToCopy);

        // Show success state
        copyBtn.innerHTML = ICONS.check;
        copyBtn.classList.add('copied');

        setTimeout(() => {
          copyBtn.innerHTML = ICONS.copy;
          copyBtn.classList.remove('copied');
        }, 2000);
      } catch (err) {
        console.error('Failed to copy HTML:', err);
        alert('Failed to copy HTML to clipboard');
      }
    });

    htmlElement.appendChild(copyBtn);
  });
}

/**
 * Find the closest grid/flex item parent that should be removed
 * This handles cases where visibility element is inside a Webflow grid item wrapper
 * Only removes parent if it's a specific Webflow wrapper (w-dyn-item, listitem)
 */
function findRemovableParent(element: HTMLElement): HTMLElement {
  const parent = element.parentElement;

  if (!parent) return element;

  // Only check for specific Webflow grid item wrappers
  // DO NOT remove parent just because it's inside a flex container
  const isWebflowGridItem =
    parent.classList.contains('w-dyn-item') ||
    parent.getAttribute('role') === 'listitem';

  // Only remove parent if it's a Webflow grid item wrapper
  if (isWebflowGridItem) {
    return parent;
  }

  return element;
}

/**
 * Add delete buttons to elements with visibility attribute
 */
function setupDeleteButtons(): void {
  const visibilityElements = getElementsWithValue(VALUES.VISIBILITY);

  visibilityElements.forEach((element) => {
    const htmlElement = element as HTMLElement;

    // Skip if button already exists
    if (htmlElement.querySelector('.article-cta-delete-btn')) return;

    const deleteBtn = document.createElement('button');
    deleteBtn.className = 'article-cta-editor-btn article-cta-delete-btn';
    deleteBtn.innerHTML = ICONS.trash;
    deleteBtn.title = 'Remove this element';

    deleteBtn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();

      // Find the correct element to remove (might be parent grid item)
      const elementToRemove = findRemovableParent(htmlElement);
      elementToRemove.remove();
    });

    htmlElement.appendChild(deleteBtn);
  });
}

/**
 * Add link edit buttons to elements with link attribute
 */
function setupLinkEditButtons(): void {
  const linkElements = getElementsWithValue(VALUES.LINK);

  linkElements.forEach((element) => {
    const htmlElement = element as HTMLElement;

    // Skip if button already exists
    if (htmlElement.querySelector('.article-cta-link-btn')) return;

    // Only add to anchor elements or elements containing anchors
    const isAnchor = htmlElement.tagName.toLowerCase() === 'a';
    const containsAnchor = htmlElement.querySelector('a');

    if (!isAnchor && !containsAnchor) return;

    const linkBtn = document.createElement('button');
    linkBtn.className = 'article-cta-editor-btn article-cta-link-btn';
    linkBtn.innerHTML = ICONS.link;
    linkBtn.title = 'Edit link URL';

    linkBtn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();

      // Get the anchor element
      const anchor = isAnchor ? (htmlElement as HTMLAnchorElement) : containsAnchor;
      if (!anchor) return;

      const currentHref = anchor.getAttribute('href') || '';
      const newHref = prompt('Enter new URL:', currentHref);

      if (newHref !== null && newHref !== currentHref) {
        anchor.setAttribute('href', newHref);

        // Visual feedback
        linkBtn.style.background = '#10B981';
        setTimeout(() => {
          linkBtn.style.background = '';
        }, 1000);
      }
    });

    htmlElement.appendChild(linkBtn);
  });
}

/**
 * Simple Markdown to HTML converter
 */
function markdownToHtml(markdown: string): string {
  let html = markdown;

  // Escape HTML
  html = html.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

  // Headers
  html = html.replace(/^### (.+)$/gm, '<h3>$1</h3>');
  html = html.replace(/^## (.+)$/gm, '<h2>$1</h2>');
  html = html.replace(/^# (.+)$/gm, '<h1>$1</h1>');

  // Bold and Italic
  html = html.replace(/\*\*\*(.+?)\*\*\*/g, '<strong><em>$1</em></strong>');
  html = html.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
  html = html.replace(/\*(.+?)\*/g, '<em>$1</em>');
  html = html.replace(/___(.+?)___/g, '<strong><em>$1</em></strong>');
  html = html.replace(/__(.+?)__/g, '<strong>$1</strong>');
  html = html.replace(/_(.+?)_/g, '<em>$1</em>');

  // Process lists - unordered
  const ulRegex = /^[\-\*] (.+)$/gm;
  let ulMatch;
  const ulItems: string[] = [];
  let lastIndex = 0;
  let tempHtml = html;

  // Find all unordered list blocks
  const lines = tempHtml.split('\n');
  let inUl = false;
  let inOl = false;
  const processedLines: string[] = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const ulMatch = line.match(/^[\-\*] (.+)$/);
    const olMatch = line.match(/^\d+\. (.+)$/);

    if (ulMatch) {
      if (!inUl) {
        processedLines.push('<ul role="list">');
        inUl = true;
      }
      processedLines.push(`<li>${ulMatch[1]}</li>`);
    } else if (olMatch) {
      if (inUl) {
        processedLines.push('</ul>');
        inUl = false;
      }
      if (!inOl) {
        processedLines.push('<ol role="list">');
        inOl = true;
      }
      processedLines.push(`<li>${olMatch[1]}</li>`);
    } else {
      if (inUl) {
        processedLines.push('</ul>');
        inUl = false;
      }
      if (inOl) {
        processedLines.push('</ol>');
        inOl = false;
      }

      // Wrap non-empty lines that aren't headers in <p>
      if (line.trim() && !line.match(/^<[huo]/)) {
        processedLines.push(`<p>${line}</p>`);
      } else if (line.trim()) {
        processedLines.push(line);
      }
    }
  }

  if (inUl) processedLines.push('</ul>');
  if (inOl) processedLines.push('</ol>');

  html = processedLines.join('\n');

  // Clean up empty paragraphs
  html = html.replace(/<p><\/p>/g, '');
  html = html.replace(/<p>\s*<\/p>/g, '');

  return html;
}

/**
 * Convert HTML to simple Markdown
 */
function htmlToMarkdown(html: string): string {
  const tempDiv = document.createElement('div');
  tempDiv.innerHTML = html;

  let markdown = '';

  function processNode(node: Node): string {
    let result = '';

    if (node.nodeType === Node.TEXT_NODE) {
      return node.textContent || '';
    }

    if (node.nodeType !== Node.ELEMENT_NODE) {
      return '';
    }

    const el = node as HTMLElement;
    const tagName = el.tagName.toLowerCase();
    const childContent = Array.from(el.childNodes).map(processNode).join('');

    switch (tagName) {
      case 'h1':
        result = `# ${childContent}\n\n`;
        break;
      case 'h2':
        result = `## ${childContent}\n\n`;
        break;
      case 'h3':
        result = `### ${childContent}\n\n`;
        break;
      case 'p':
        result = `${childContent}\n\n`;
        break;
      case 'strong':
      case 'b':
        result = `**${childContent}**`;
        break;
      case 'em':
      case 'i':
        result = `*${childContent}*`;
        break;
      case 'ul':
        result = childContent;
        break;
      case 'ol':
        // Track list item number
        let num = 0;
        result = Array.from(el.children)
          .map((li) => {
            num++;
            return `${num}. ${processNode(li).replace(/^- /, '')}`;
          })
          .join('\n') + '\n\n';
        break;
      case 'li':
        result = `- ${childContent}\n`;
        break;
      case 'br':
        result = '\n';
        break;
      case 'div':
        result = childContent;
        break;
      default:
        result = childContent;
    }

    return result;
  }

  Array.from(tempDiv.childNodes).forEach((node) => {
    markdown += processNode(node);
  });

  return markdown.trim();
}

/**
 * Create and manage Markdown editor modal
 */
function createMarkdownEditor(): {
  open: (targetElement: HTMLElement) => void;
  close: () => void;
} {
  let currentTarget: HTMLElement | null = null;
  let overlay: HTMLElement | null = null;

  function createModal(): HTMLElement {
    const modalOverlay = document.createElement('div');
    modalOverlay.className = 'md-editor-overlay';
    modalOverlay.innerHTML = `
      <div class="md-editor-modal">
        <div class="md-editor-header">
          <h3 class="md-editor-title">Rich Text Editor</h3>
          <button class="md-editor-close" type="button">&times;</button>
        </div>
        <div class="md-editor-toolbar">
          <button class="md-editor-toolbar-btn" data-action="h1" type="button">H1</button>
          <button class="md-editor-toolbar-btn" data-action="h2" type="button">H2</button>
          <button class="md-editor-toolbar-btn" data-action="h3" type="button">H3</button>
          <button class="md-editor-toolbar-btn" data-action="bold" type="button"><strong>B</strong></button>
          <button class="md-editor-toolbar-btn" data-action="italic" type="button"><em>I</em></button>
          <button class="md-editor-toolbar-btn" data-action="ul" type="button">• List</button>
          <button class="md-editor-toolbar-btn" data-action="ol" type="button">1. List</button>
        </div>
        <div class="md-editor-body">
          <div class="md-editor-input-wrap">
            <div class="md-editor-label">Markdown</div>
            <textarea class="md-editor-textarea" placeholder="Enter your content in Markdown format..."></textarea>
          </div>
          <div class="md-editor-preview-wrap">
            <div class="md-editor-label">Preview</div>
            <div class="md-editor-preview"></div>
          </div>
        </div>
        <div class="md-editor-footer">
          <button class="md-editor-btn md-editor-btn-cancel" type="button">Cancel</button>
          <button class="md-editor-btn md-editor-btn-save" type="button">Save</button>
        </div>
      </div>
    `;

    // Event handlers
    const closeBtn = modalOverlay.querySelector('.md-editor-close') as HTMLElement;
    const cancelBtn = modalOverlay.querySelector('.md-editor-btn-cancel') as HTMLElement;
    const saveBtn = modalOverlay.querySelector('.md-editor-btn-save') as HTMLElement;
    const textarea = modalOverlay.querySelector('.md-editor-textarea') as HTMLTextAreaElement;
    const preview = modalOverlay.querySelector('.md-editor-preview') as HTMLElement;
    const toolbarBtns = modalOverlay.querySelectorAll('.md-editor-toolbar-btn');

    // Close handlers
    closeBtn.addEventListener('click', close);
    cancelBtn.addEventListener('click', close);
    modalOverlay.addEventListener('click', (e) => {
      if (e.target === modalOverlay) close();
    });

    // Save handler
    saveBtn.addEventListener('click', () => {
      if (currentTarget) {
        currentTarget.innerHTML = markdownToHtml(textarea.value);
        close();
      }
    });

    // Live preview
    textarea.addEventListener('input', () => {
      preview.innerHTML = markdownToHtml(textarea.value);
    });

    // Toolbar actions
    toolbarBtns.forEach((btn) => {
      btn.addEventListener('click', () => {
        const action = btn.getAttribute('data-action');
        if (!action) return;

        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const text = textarea.value;
        const selectedText = text.substring(start, end);
        let newText = '';
        let cursorOffset = 0;

        switch (action) {
          case 'h1':
            newText = `# ${selectedText || 'Heading 1'}`;
            cursorOffset = selectedText ? newText.length : 2;
            break;
          case 'h2':
            newText = `## ${selectedText || 'Heading 2'}`;
            cursorOffset = selectedText ? newText.length : 3;
            break;
          case 'h3':
            newText = `### ${selectedText || 'Heading 3'}`;
            cursorOffset = selectedText ? newText.length : 4;
            break;
          case 'bold':
            newText = `**${selectedText || 'bold text'}**`;
            cursorOffset = selectedText ? newText.length : 2;
            break;
          case 'italic':
            newText = `*${selectedText || 'italic text'}*`;
            cursorOffset = selectedText ? newText.length : 1;
            break;
          case 'ul':
            newText = `- ${selectedText || 'List item'}`;
            cursorOffset = selectedText ? newText.length : 2;
            break;
          case 'ol':
            newText = `1. ${selectedText || 'List item'}`;
            cursorOffset = selectedText ? newText.length : 3;
            break;
        }

        textarea.value = text.substring(0, start) + newText + text.substring(end);
        textarea.focus();

        // Update preview
        preview.innerHTML = markdownToHtml(textarea.value);
      });
    });

    // Handle Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && modalOverlay.classList.contains('active')) {
        close();
      }
    });

    return modalOverlay;
  }

  function open(targetElement: HTMLElement): void {
    currentTarget = targetElement;

    if (!overlay) {
      overlay = createModal();
      document.body.appendChild(overlay);
    }

    const textarea = overlay.querySelector('.md-editor-textarea') as HTMLTextAreaElement;
    const preview = overlay.querySelector('.md-editor-preview') as HTMLElement;

    // Convert current HTML to Markdown
    const currentHtml = targetElement.innerHTML;
    const markdown = htmlToMarkdown(currentHtml);

    textarea.value = markdown;
    preview.innerHTML = markdownToHtml(markdown);

    // Show modal
    requestAnimationFrame(() => {
      overlay!.classList.add('active');
      textarea.focus();
    });
  }

  function close(): void {
    if (overlay) {
      overlay.classList.remove('active');
    }
    currentTarget = null;
  }

  return { open, close };
}

/**
 * Setup inline text editing for elements with edit attribute
 */
function setupInlineEditing(): void {
  const editContainers = document.querySelectorAll(`[${ATTR.EDIT}]`);
  const mdEditor = createMarkdownEditor();

  editContainers.forEach((container) => {
    const htmlContainer = container as HTMLElement;

    // Get all text-containing elements except rich-text areas
    const textElements = htmlContainer.querySelectorAll(
      'h1, h2, h3, h4, h5, h6, p, span, a, li'
    );

    // Get rich-text elements (supports comma-separated values)
    const richTextElements = getElementsWithValue(VALUES.RICH_TEXT, htmlContainer);

    // Setup rich-text click handler
    richTextElements.forEach((el) => {
      el.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        mdEditor.open(el as HTMLElement);
      });
    });

    // Make text elements editable
    textElements.forEach((el) => {
      // Skip if inside rich-text element (check for comma-separated values too)
      const closestWithAttr = el.closest(`[${ATTR.MAIN}]`);
      if (closestWithAttr && hasAttributeValue(closestWithAttr, VALUES.RICH_TEXT)) return;

      const htmlEl = el as HTMLElement;

      // Make editable
      htmlEl.setAttribute('contenteditable', 'true');

      // Prevent link navigation
      if (el.tagName.toLowerCase() === 'a' || el.closest('a')) {
        el.addEventListener('click', (e) => {
          e.preventDefault();
        });

        const parentLink = el.closest('a');
        if (parentLink) {
          parentLink.addEventListener('click', (e) => {
            // Only prevent if clicking on the text, not elsewhere
            e.preventDefault();
          });
        }
      }

      // Handle paste - strip formatting
      htmlEl.addEventListener('paste', (e) => {
        e.preventDefault();
        const text = e.clipboardData?.getData('text/plain') || '';
        document.execCommand('insertText', false, text);
      });
    });

    // Prevent all links from navigating in edit mode
    const allLinks = htmlContainer.querySelectorAll('a');
    allLinks.forEach((link) => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
      });
    });

    // Also handle elements explicitly marked with "link" value
    const linkElements = getElementsWithValue(VALUES.LINK, htmlContainer);
    linkElements.forEach((el) => {
      el.addEventListener('click', (e) => {
        e.preventDefault();
      });
    });

    // Add edit indicator
    if (!htmlContainer.querySelector('.article-cta-edit-indicator')) {
      const indicator = document.createElement('div');
      indicator.className = 'article-cta-editor-btn article-cta-edit-indicator';
      indicator.innerHTML = ICONS.edit;
      indicator.title = 'Edit mode active';
      htmlContainer.appendChild(indicator);
    }
  });
}

// Page slug where editor should be active
const EDITOR_PAGE_SLUG = '/cta---construcor';

/**
 * Main initialization function
 */
export const articleCtaCardEditor = (): void => {
  // Only run on the CTA constructor page
  if (!window.location.pathname.includes(EDITOR_PAGE_SLUG)) {
    return;
  }

  // Check if there are any elements to work with
  const copyElements = getElementsWithValue(VALUES.COPY_HTML);

  if (copyElements.length === 0) {
    return;
  }

  // Inject styles
  injectStyles();

  // Setup all functionality
  setupCopyButtons();
  setupDeleteButtons();
  setupLinkEditButtons();
  setupInlineEditing();
};
