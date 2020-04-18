
export default interface YesNoProps {
  title?: string;
  text: string;
  yesText?: string;
  noText?: string;
  onResult: (value: boolean) => void;
}
