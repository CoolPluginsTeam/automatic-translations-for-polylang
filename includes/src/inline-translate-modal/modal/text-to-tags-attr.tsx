const ATFP_ATTR_BLOCKLIST = /^on/i;

export interface HtmlVocabulary {
    ALLOWED_TAGS: Array<string>;
    ALLOWED_ATTR: Array<string>;    
    ALLOW_DATA_ATTR: boolean;
    ALLOW_ARIA_ATTR: boolean;
}

/**
 * Collect all tag names and attribute names used within a given HTML string.
 * @param html - The HTML string to analyze.
 * @returns An object containing arrays of tag names and attribute names.
 */
export function atfpCollectHtmlVocabulary(html: string): HtmlVocabulary {
    const tags: Array<string> = [];
    const attrs: Array<string> = [];

    if (typeof html !== 'string' || html.trim() === '') {
        return { ALLOWED_TAGS: [], ALLOWED_ATTR: [], ALLOW_DATA_ATTR: true, ALLOW_ARIA_ATTR: true };
    }

    try {
        const tpl = document.createElement('template');
        tpl.innerHTML = html;
        const stack: Element[] = [];

        const pushElementChildren = (parent: ParentNode) => {
            // NodeListOf<Element> but HTMLCollection .children is more widely supported
            // @ts-ignore: accessing .children on DocumentFragment is supported in modern browsers
            const ch: HTMLCollection = (parent as any).children;
            for (let i = ch.length - 1; i >= 0; i -= 1) {
                stack.push(ch[i]);
            }
        };

        // tpl.content is a DocumentFragment
        pushElementChildren(tpl.content);

        while (stack.length) {
            const el = stack.pop();
            if (!(el instanceof Element)) {
                continue;
            }
            tags.push(el.tagName.toLowerCase());
            for (let i = 0; i < el.attributes.length; i += 1) {
                const name = el.attributes[i].name.toLowerCase();
                if (!ATFP_ATTR_BLOCKLIST.test(name)) {
                    attrs.push(name);
                }
            }
            // Recurse into nested templates if present
            if (el instanceof HTMLTemplateElement && el.content) {
                pushElementChildren(el.content);
            }
            pushElementChildren(el);
        }
    } catch (e) {
        return { ALLOWED_TAGS: [], ALLOWED_ATTR: [], ALLOW_DATA_ATTR: true, ALLOW_ARIA_ATTR: true };
    }

    const config = {
        ALLOWED_TAGS: tags,
        ALLOWED_ATTR: attrs,
        ALLOW_DATA_ATTR: true,
        ALLOW_ARIA_ATTR: true,
    };

    return config;
}