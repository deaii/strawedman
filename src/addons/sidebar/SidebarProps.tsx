import StoryData from '../../core/StoryData';
import EngineComponent from '../../core/EngineComponent';

export default interface SidebarProps extends StoryData {
  title: string;
  components: EngineComponent[];
  right?: boolean;
}
