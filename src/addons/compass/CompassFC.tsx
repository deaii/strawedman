import React from 'react';
import CompassType from './CompassType';
import Direction from './Direction';
import CompassTypes from './CompassTypes';
import CompassButton from './CompassButton';
import CompassDirections from './CompassDirections';

export interface CompassFCProps {
  type: CompassType;
  vertical?: boolean;
  onClick: (passage: string) => void;
  enabledDirections: Partial<{ [dir in Direction]: string }>;
}

export const CompassFC: React.FC<CompassFCProps> = ({
  type,
  vertical,
  onClick,
  enabledDirections,
}) => {
  const supportedDirs = CompassTypes[type];

  const buttons = supportedDirs.map((dir) => {
    const passage = enabledDirections[dir];
    const { label, title, className } = CompassDirections[dir];
    return (
      <CompassButton
        passage={passage}
        className={className}
        onClick={onClick}
        title={title}
        label={label}
      />
    );
  });

  return (
    <div className={`sm-compass sm-compass-${vertical ? 'vertical' : 'horizontal'}`}>
      <div className="sm-compass-header">Compass</div>
      {buttons}
    </div>
  );
};
