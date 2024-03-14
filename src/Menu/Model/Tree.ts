import { Action } from "../Actions/action";
import { TreeNode } from "./TreeNode";

class Tree {
  constructor(public root: TreeNode) {}

  navigate(inputSequence: string[]): void {
    let currentNode: TreeNode | Action | undefined = this.root;
    for (const input of inputSequence) {
      if (currentNode instanceof TreeNode) {
        console.log(currentNode.message);
        currentNode = currentNode.getOption(input);
      } else if (typeof currentNode === "function") {
        currentNode();
        return;
      }
    }

    if (currentNode instanceof TreeNode) {
      console.log(currentNode.message);
    }
  }
}

export { Tree };
