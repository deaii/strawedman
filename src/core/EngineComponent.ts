import React from 'react';
import StoryData from './StoryData';

export default interface EngineComponent {
  name: string;
  FC: React.FC<StoryData>;
}
