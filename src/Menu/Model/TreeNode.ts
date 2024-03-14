import { Action } from "../Actions/action";

class TreeNode {
  constructor(
    public message: string,
    public options: Map<string, TreeNode | Action> = new Map(),
  ) {}

  addOption(key: string, option: TreeNode | Action): void {
    this.options.set(key, option);
  }

  getOption(key: string): TreeNode | Action | undefined {
    return this.options.get(key);
  }
}

export { TreeNode };
