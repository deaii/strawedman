import React from 'react';
import ReactDOM from 'react-dom';

import extractTwineLink from '../markdown/extractTwineLink';
import CompassType from './CompassType';
import DirectionAliases from './DirectionAliases';
import { CompassFC } from './CompassFC';

const ExitsTag = /^x-exits$/i;

function HandleExits(elm: Element) {
  const typeAttr = elm.attributes.getNamedItem('type');

  const type: CompassType = typeAttr ? (typeAttr.value as CompassType) : 'default';

  const innerText = elm.innerHTML;

  const enabledDirections: { [dir: string]: string } = {};

  [...innerText.matchAll(/\[\[(.*?)\]\]/g)].forEach(([text]) => {
    const { display, target } = extractTwineLink(text);
    enabledDirections[DirectionAliases[display!] || display] = target;
  });

  ReactDOM.render(
    <div className="sm-exits">
      <div
        className="exits-left"
        dangerouslySetInnerHTML={{ __html: innerText }}
      />
      <div className="exits-right">
        <CompassFC
          type={type}
          enabledDirections={enabledDirections}
          onClick={(passage) => window.engine.show(passage)}
        />
      </div>
    </div>,
    elm,
  );
}

export default {
  name: ExitsTag,
  callback: HandleExits,
};
