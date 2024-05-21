import { TreeNode } from "../Model/TreeNode";
import { Action } from "./ExecuteAction";

type InputAction = (input: string) => TreeNode | Action | undefined;

export { InputAction };
