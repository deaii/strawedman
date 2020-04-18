import React from 'react';
import Overlay from './Overlay';
import OverlayFC from './OverlayFC';
import OverlayFCParams from './OverlayFCParams';

export default function CreateOverlayFC({ title, markdown }: Overlay): React.FC<OverlayFCParams> {
  return (params) => (OverlayFC({ ...params, title, markdown }));
}
