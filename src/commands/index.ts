import { anchorBuild, anchorBuildVerifiable, anchorRemoveDockerImage } from "./build";
import { anchorTest } from "./test";
import { anchorVerify } from "./verify";
import { anchorInit } from "./scaffold";
import { anchorNew } from "./new";
import { anchorDeploy } from "./deploy";
import { anchorInstall } from "./install";
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
  anchorNew(),
  anchorRemoveDockerImage(),
  anchorTest(),
  anchorUpgrade(),
  anchorVerify(),
];

export default commands;
