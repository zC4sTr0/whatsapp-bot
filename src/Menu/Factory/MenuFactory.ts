import { Action } from "../Actions/ExecuteAction";
import { Tree } from "../Model/Tree";
import { TreeNode } from "../Model/TreeNode";

const confirmAction: Action = () => console.log("Action confirmed.");
const cancelAction: Action = () => console.log("Action cancelled.");
const displayHelp: Action = () => console.log("Help information displayed.");

const mainMenu = new TreeNode("Main Menu: 1. Services, 2. Settings, 3. Help");
const servicesMenu = new TreeNode("Services: 1. Register, 2. Login");
const settingsMenu = new TreeNode("Settings: 1. Profile, 2. Security");
const helpMenu = new TreeNode("", new Map([["", displayHelp]]));

const loginMenu = new TreeNode("Enter your login details");

const processRegistrationDetails = (
  input: string,
): TreeNode | Action | undefined => {
  // Example input processing. Replace with actual logic to validate input.
  if (input.includes("@")) {
    console.log(`Email received: ${input}`);
    return confirmAction; // Move to confirmation action
  } else {
    console.log("Invalid email. Please enter a valid email address.");
    return registerMenu; // Stay at the register menu for another attempt
  }
};

const registerMenu = new TreeNode(
  "Enter your email to register:",
  new Map(),
  processRegistrationDetails,
);

registerMenu.addOption("confirm", confirmAction);
registerMenu.addOption("cancel", cancelAction);

loginMenu.addOption("confirm", confirmAction);
loginMenu.addOption("cancel", cancelAction);

servicesMenu.addOption("1", registerMenu);
servicesMenu.addOption("2", loginMenu);

const profileMenu = new TreeNode(
  "Profile Settings: 1. Edit Profile, 2. View Profile",
);
const securityMenu = new TreeNode(
  "Security Settings: 1. Change Password, 2. Two-Factor Authentication",
);

profileMenu.addOption("1", () => console.log("Editing Profile..."));
profileMenu.addOption("2", () => console.log("Viewing Profile..."));

securityMenu.addOption("1", () => console.log("Changing Password..."));
securityMenu.addOption("2", () =>
  console.log("Configuring Two-Factor Authentication..."),
);

settingsMenu.addOption("1", profileMenu);
settingsMenu.addOption("2", securityMenu);

// Constructing the main menu
mainMenu.addOption("1", servicesMenu);
mainMenu.addOption("2", settingsMenu);
mainMenu.addOption("3", helpMenu);

const menuTree = new Tree(mainMenu);

menuTree.navigate(["1"]);
menuTree.navigate(["1"]);
