import { InputAction } from "../Actions/InputAction";
import { Action } from "../Actions/ExecuteAction";

class TreeNode {
  constructor(
    public message: string,
    public options: Map<string, TreeNode | Action> = new Map(),
    public InputAction?: InputAction,
  ) {}

  addOption(key: string, option: TreeNode | Action): void {
    this.options.set(key, option);
  }

  getOption(key: string): TreeNode | Action | undefined {
    return this.options.get(key);
  }

  handleInput(input: string): TreeNode | Action | undefined {
    if (this.InputAction) {
      return this.InputAction(input);
    } else {
      return this.options.get(input);
    }
  }
}

export { TreeNode };
