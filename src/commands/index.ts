import { anchorBuild, anchorBuildVerifiable, anchorRemoveDockerImage } from "./build";
import { anchorTest, anchorTestLocalValidator } from "./test";
import { anchorVerify } from "./verify";
import { anchorInit } from "./scaffold";
import { anchorNew } from "./new";
import { anchorDeploy } from "./deploy";
import { anchorInstall, solanaInstall } from "./install";
import { anchorUpgrade } from "./upgrade";
import { anchorAnalyze } from "./analyze";
import { anchorHelp } from "./help";

const commands = [
  anchorAnalyze(),
  anchorBuild(),
  anchorBuildVerifiable(),
  anchorDeploy(),
  anchorHelp(),
  anchorInit(),
  anchorInstall(),
  solanaInstall(),
  anchorNew(),
  anchorRemoveDockerImage(),
  anchorTest(),
  anchorTestLocalValidator(),
  anchorUpgrade(),
  anchorVerify(),
];

export default commands;
