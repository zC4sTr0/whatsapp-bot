import { Action } from "../Actions/ExecuteAction";
import { TreeNode } from "./TreeNode";

class Tree {
  private currentPath: string[] = [];
  private currentNode: TreeNode;

  constructor(public root: TreeNode) {
    this.currentNode = root;
  }

  navigate(inputSequence: string[]): void {
    for (const input of inputSequence) {
      const next: TreeNode | Action | undefined =
        this.currentNode.getOption(input);
      if (next instanceof TreeNode) {
        this.currentPath.push(input); // Update the path
        this.currentNode = next; // Move to the next node
        console.log(next.message);
      } else if (typeof next === "function") {
        next(); // Execute the action
        return;
      } else {
        console.log("Invalid selection");
      }
    }
  }

  // Go back to the previous menu item
  back(): void {
    if (this.currentPath.length > 0) {
      this.currentPath.pop();
      this.reset();
      this.navigate(this.currentPath.slice());
    } else {
      console.log("Already at the root menu.");
    }
  }

  reset(): void {
    this.currentPath = [];
    this.currentNode = this.root;
    console.log(this.root.message);
  }
}

export { Tree };
