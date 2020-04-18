import SaveDescriptor from './SaveDescriptor';
import HistoryPage from '../history/HistoryPage';

export default interface SaveData extends SaveDescriptor {
  data: HistoryPage[];
}
