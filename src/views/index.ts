import { registerProgramView } from "./programs";
import { registerTestView, } from "./tests";

export const registerViews = () => {
  registerProgramView();
  registerTestView();
};