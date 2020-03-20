

export interface StoryRendererProps {
  src: string;
  onClick: (href: string) => void;
}

export interface StoryRenderer {
  readonly fc: React.FC<StoryRendererProps>;
}