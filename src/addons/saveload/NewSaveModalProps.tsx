
export default interface NewSaveModalProps {
  checkSave: (slot: string) => boolean;
  onCancel: () => void;
  onSave: (slotName: string) => void;
}
