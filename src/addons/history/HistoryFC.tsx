
import React from 'react';

interface HistoryFCProps {
  className?: string,
  goBack?: boolean;
  goForward?: boolean;
  goBackClick?(): void;
  goForwardClick?(): void;
}

const HistoryFC: React.FC<HistoryFCProps> = ({
  className,
  goBack,
  goForward,
  goBackClick,
  goForwardClick,
}) => (
  <fieldset className={className || 'sm-history'}>
    <legend>History</legend>
    <button
      className="btn"
      type="button"
      title="Go back in the game's history"
      disabled={!goBack}
      onClick={goBackClick}
    >
      ⮜ Back
    </button>
    <span className="spacer" />
    <button
      className="btn"
      type="button"
      title="Go forward in the game's history"
      disabled={!goForward}
      onClick={goForwardClick}
    >
      Forward ⮞
    </button>
  </fieldset>
);

export default HistoryFC;
