import { registerProgramView } from "./programs";
import { registerTestView } from "./tests";
// import { registerToolsView } from "./tools";

export const registerViews = () => {
  registerProgramView();
  registerTestView();
  // registerToolsView();
};