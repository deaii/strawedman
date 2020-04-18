import State from '../../core/State';

export default interface HistoryPage {
  state: State;
  passageName: string;
  nonce: number;
}
