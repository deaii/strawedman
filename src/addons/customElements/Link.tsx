import React from 'react';
import ReactDOM from 'react-dom';

const LINK_TAG = /^x-link$/i;

function HandleLink(elm: Element, state: {[key: string]: any}, reload: () => void) {
  const script = elm.attributes.getNamedItem('script')?.value!;
  const html = elm.innerHTML;

  const onClick = () => {
    if (script) {
      // eslint-disable-next-line no-new-func
      new Function(script).bind(state)();
    }

    reload();
  };

  const btn = (
    // eslint-disable-next-line jsx-a11y/control-has-associated-label
    <button
      type="button"
      // eslint-disable-next-line react/no-danger
      dangerouslySetInnerHTML={{ __html: html }}
      onClick={onClick}
    />
  );

  ReactDOM.render(btn, elm);
}

export default {
  name: LINK_TAG,
  callback: HandleLink,
};
