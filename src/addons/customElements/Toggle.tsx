import React from 'react';
import ReactDOM from 'react-dom';
import { isNullOrUndefined } from 'util';

import ToggleFC from './ToggleFC';

export const TOGGLE_TAG = /x-toggle/i;

function ToToggle(
  elm: Element,
  state: { [key: string]: any },
  refresh: () => void,
) {
  const pathAttr = elm.attributes.getNamedItem('path');
  if (!pathAttr) {
    return;
  }

  const valueAttr = elm.attributes.getNamedItem('default');
  const refreshAttr = elm.attributes.getNamedItem('refresh');
  const defaultValue = valueAttr ? !!valueAttr.value.match(/true/i) : false;

  const stateValue: undefined | boolean = state[pathAttr.value];
  const value = isNullOrUndefined(stateValue) ? defaultValue : !!stateValue;

  const labelAttr = elm.attributes.getNamedItem('label');
  const id = elm.id || `ci_${Math.floor(Math.random() * 999999999)}`;

  ReactDOM.render(
    <ToggleFC
      id={id}
      label={labelAttr ? labelAttr.value : "<#ERROR: No 'label' attribute #>"}
      defaultChecked={value}
      onChange={(val) => {
        // eslint-disable-next-line no-param-reassign
        state[pathAttr.value] = val;
        if (refreshAttr) {
          refresh();
        }
      }}
    />,
    elm,
  );
}

export default {
  name: TOGGLE_TAG,
  callback: ToToggle,
};
