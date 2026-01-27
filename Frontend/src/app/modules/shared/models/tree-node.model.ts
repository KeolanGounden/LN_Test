export type TreeNode = {
  name: string;
  value: string;
  children?: TreeNode[];
  disabled?: boolean;
  expanded?: boolean;
};
