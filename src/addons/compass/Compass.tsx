import React from 'react';
import ReactDOM from 'react-dom';

import extractTwineLink from '../markdown/extractTwineLink';
import CompassType from './CompassType';
import DirectionAliases from './DirectionAliases';
import { CompassFC } from './CompassFC';

const CompassTag = /^x-compass$/i;

function HandleCompass(elm: Element) {
  const typeAttr = elm.attributes.getNamedItem('type');

  const type: CompassType = typeAttr ? (typeAttr.value as CompassType) : 'default';

  const innerText = elm.innerHTML;

  const enabledDirections: { [dir: string]: string } = {};

  [...innerText.matchAll(/\[\[(.*?)\]\]/g)].forEach(([text]) => {
    const { display, target } = extractTwineLink(text);
    enabledDirections[DirectionAliases[display!] || display] = target;
  });

  ReactDOM.render(
    <CompassFC
      type={type}
      enabledDirections={enabledDirections}
      onClick={(passage) => window.engine.show(passage)}
    />,
    elm,
  );
}

export default {
  name: CompassTag,
  callback: HandleCompass,
};
