import React from 'react';
import marked from 'marked';
import StoryData from '../../core/StoryData';
import { HREF_ATTR } from '../../renderers/renderEjs';
import CustomElement from '../customElements/CustomElement';
import EngineComponent from '../../core/EngineComponent';
import replaceTwineLink from './replaceTwineLink';
import trimTwinePassage from './trimTwinePassage';

function twinify(txt: string): string {
  /* [[links]] with extra markup {#id.class} */
  const result = txt.replace(/\[\[(.*?)\]\]\{(.*?)\}/g, replaceTwineLink);

  /* Classic [[links]]  */
  return result.replace(/\[\[(.*?)\]\]/g, replaceTwineLink);
}

class MdRenderer extends marked.Renderer {
  #urlTransformer?: (url: string) => string;

  public constructor(
    options?: marked.MarkedOptions | null,
    urlTransformer?: (url: string) => string,
  ) {
    super(options || undefined);
    this.#urlTransformer = urlTransformer;
  }

  link(href: string, title: string, text: string): string {
    if (href === null) {
      return text;
    }

    // If the URL looks like a regular URL, treat it as a regular link.
    if (
      href.startsWith('~') ||
      href.startsWith('http:') ||
      href.startsWith('data:')
    ) {
      return super.link(href, title, text);
    }

    const passage = trimTwinePassage(href);

    const titleAttr = title ? `title="${title}"` : '';

    return `<a ${HREF_ATTR}="${passage}" ${titleAttr}>${text}</a>`;
  }

  image(href: string, title: string, text: string) {
    if (href === null) {
      return text;
    }

    const newHref = this.#urlTransformer ? this.#urlTransformer(href) : href;

    return super.image(newHref, title, text);
  }
}

interface FCProps extends StoryData {
  renderer: MdRenderer;
  customElements: CustomElement[];
}

const MarkdownFC: React.FC<FCProps> = (props) => {
  const [tmp, refreshTmp] = React.useState<number>(0);

  function refresh() {
    refreshTmp(tmp + 1);
  }

  const { text, renderer, customElements } = props;

  // Trim the text
  const lines = text.split('\n');

  let minIndent = Number.MAX_SAFE_INTEGER;

  for (let i = 1; i < lines.length; i += 1) {
    const line = lines[i];

    const newLine = line.trimStart();
    if (newLine) {
      const reduction = line.length - newLine.length;
      if (reduction < minIndent) {
        minIndent = reduction;
      }
    } else {
      lines[i] = '';
    }
  }

  let fixedText = lines
    .map((line, i) => {
      if (i === 0) {
        return line;
      }
      return line ? line.substr(minIndent) : '';
    })
    .join('\n');

  function onAnchorClick(this: HTMLAnchorElement) {
    const attr = this.attributes.getNamedItem(HREF_ATTR);
    if (attr) {
      window.engine.show(unescape(attr.value));
    } else {
      window.events.storyError.trigger({
        event: `Clicked attribute with no "${HREF_ATTR}" attribute.`,
      });
    }
  }

  const ref: React.RefCallback<HTMLDivElement> = (
    div: HTMLDivElement | null,
  ) => {
    if (div) {
      const anchorCollection = div.getElementsByTagName('a');

      for (let i = 0; i < anchorCollection.length; i += 1) {
        const anchor = anchorCollection.item(i);
        if (anchor && anchor.attributes.getNamedItem(HREF_ATTR)) {
          anchor?.addEventListener('click', onAnchorClick);
        }
      }

      if (customElements && customElements.length > 0) {
        div.querySelectorAll('*').forEach((elm) => {
          customElements.forEach((t) => {
            if (elm.tagName.match(t.name)) {
              t.callback(elm, props, refresh);
            }
          });
        });
      }
    }
  };

  try {
    fixedText = twinify(fixedText);
    const html = marked(fixedText, { renderer, gfm: false });
    return (
      <div
        className="sm-output"
        ref={ref}
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: html }}
      />
    );
  } catch (e) {
    window.events.storyError.trigger({ event: e });
    return (
      <div className="error">
        Error:
        {JSON.stringify(e)}
      </div>
    );
  }
};

export default function MarkdownRenderer(
  urlTransformer?: null | ((url: string) => string),
  ...customElements: CustomElement[]
): EngineComponent {
  const renderer = new MdRenderer(null, urlTransformer || undefined);

  const fc = React.memo<StoryData>(
    ({ state, passageName, passage, text, nonce, g, temp, s, __, w }) => (
      <MarkdownFC
        state={state}
        passageName={passageName}
        passage={passage}
        text={text}
        nonce={nonce}
        g={g}
        temp={temp}
        s={s}
        __={__}
        w={w}
        renderer={renderer}
        customElements={customElements}
      />
    ),
  );

  return {
    FC: fc,
    name: 'markdown-renderer',
  };
}
