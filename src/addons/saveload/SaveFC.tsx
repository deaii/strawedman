import React from 'react';

// eslint-disable-next-line import/no-webpack-loader-syntax
import saveSvg from '!!raw-loader!@fortawesome/fontawesome-free/svgs/solid/save.svg';

// eslint-disable-next-line import/no-webpack-loader-syntax
import redoSvg from '!!raw-loader!@fortawesome/fontawesome-free/svgs/solid/redo.svg';

interface SaveFCProps {
  className: string;
  onSaves: () => void;
  onRestart: () => void;
}

const SaveFC: React.FC<SaveFCProps> = ({
  className,
  onSaves,
  onRestart,
}) => (
  <div className={className}>
    <button
      className="btn"
      type="button"
      onClick={onSaves}
    >
      {/* eslint-disable-next-line react/no-danger */}
      <span className="btn-icon" dangerouslySetInnerHTML={{ __html: saveSvg }} />
      <span className="btn-text">Saves</span>
    </button>
    <br />
    <button
      className="btn"
      type="button"
      onClick={onRestart}
    >
      {/* eslint-disable-next-line react/no-danger */}
      <span className="btn-icon" dangerouslySetInnerHTML={{ __html: redoSvg }} />
      <span className="btn-text">Restart</span>
    </button>
  </div>
);

export default SaveFC;
