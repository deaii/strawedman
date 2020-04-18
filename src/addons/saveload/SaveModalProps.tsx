import SaveDescriptor from './SaveDescriptor';

export default interface SaveModalProps {
  slots: SaveDescriptor[];
  onDelete: (slotName: string) => void;
  onLoad: (slotName: string) => void;
  checkSave: (slotName: string) => boolean;
  onSave: (slotName: string) => void;
  onCancel: () => void;
}
