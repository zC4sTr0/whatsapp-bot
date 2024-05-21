import { Action } from "../Actions/ExecuteAction";
import { TreeNode } from "./TreeNode";
import { InputAction } from "../Actions/InputAction";

class InputNode {
  constructor(
    public prompt: string,
    public InputAction: InputAction,
  ) {}

  handleInput(input: string): TreeNode | Action | undefined {
    return this.InputAction(input);
  }
}

export { InputNode };
