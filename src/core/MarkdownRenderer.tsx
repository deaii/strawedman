import React from 'react';
import marked from 'marked';
import { events } from './Events';
import { StoryData } from './StoryData';
import { HREF_ATTR } from '../renderers/renderEjs';

class MdRenderer extends marked.Renderer {
  _urlTransformer?: (url: string) => string;


  public constructor(options?: marked.MarkedOptions | null, urlTransformer?: (url: string) => string) {
    super(options || undefined);
    this._urlTransformer = urlTransformer;
  }

  link(href: string, title: string, text: string) : string {

    if (href === null) {
      return text;
    }

    // If the URL looks like a regular URL, treat it as a regular link.
    if (href.startsWith('~') || href.startsWith('http:') || href.startsWith('data:')){
      return super.link(href, title, text);
    }

    const titleAttr = title ? `title="${title}"` : '';

    return `<a ${HREF_ATTR}="${href}" ${titleAttr}>${text}</a>`;
  }

  image(href: string, title: string, text: string) {
    if (href === null) {
      return text;
    }

    const newHref = this._urlTransformer ? this._urlTransformer(href) : href;

    return super.image(newHref, title, text);
  }
}

export function MarkdownRenderer(urlTransformer?: (url: string) => string) {
  const renderer = new MdRenderer(null, urlTransformer);

  return React.memo<StoryData>(({text}) => {
    // Trim the text
    const lines = text.split('\n');
    
    let minIndent = Number.MAX_SAFE_INTEGER;

    for (let i = 1; i < lines.length; i++){
      const line = lines[i];

      const newLine = line.trimStart();
      if (newLine){
        const reduction = line.length - newLine.length;
        if (reduction < minIndent){
          minIndent = reduction;
        }
      }else{
        lines[i] = '';
      }
    }

    var fixedText = lines.map((line, i) => {
      if (i === 0) {
        return line;
      }
      return line ? line.substr(minIndent) : '';
    }).join('\n');

    function onAnchorClick(this: HTMLAnchorElement, ev: MouseEvent) {
      const attr = this.attributes.getNamedItem(HREF_ATTR);
      if (attr) {
        window.engine.show(unescape(attr.value));
      } else {
        events.storyError.trigger({event: `Clicked attribute with no "${HREF_ATTR}" attribute.`});
      }
    }

    let ref: React.RefCallback<HTMLDivElement> = (div: HTMLDivElement | null) => {
      if (div) {
        const anchorCollection = div.getElementsByTagName('a');

        for (let i = 0; i < anchorCollection.length; i++) {
          const anchor = anchorCollection.item(i);
          if (anchor && anchor.attributes.getNamedItem(HREF_ATTR)) {
            anchor?.addEventListener('click', onAnchorClick);
          }
        }
      }
    }

    try
    {
      const html = marked(fixedText, { renderer, gfm: false });
      return (<div className="Markdown" ref={ref} dangerouslySetInnerHTML={{__html: html}}></div>)
    }
    catch (e)
    {
      events.storyError.trigger({event: e});
      return <div className="error">Error: {JSON.stringify(e)}</div>;
    }
  });
}