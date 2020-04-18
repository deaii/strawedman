export default interface ToggleParams {
  id: string;
  label: string;
  defaultChecked: boolean;
  onChange: (value: boolean) => void;
}
