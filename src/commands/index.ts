import { anchorBuild, anchorBuildVerifiable, anchorRemoveDockerImage } from "./build";
import { anchorTest } from "./test";
import { anchorVerify } from "./verify";
import { anchorInit } from "./scaffold";
import { anchorNew } from "./new";
import { anchorDeploy } from "./deploy";
import { anchorUpgrade } from "./upgrade";

const commands = [
  anchorBuild(),
  anchorBuildVerifiable(),
  anchorDeploy(),
  anchorInit(),
  anchorNew(),
  anchorRemoveDockerImage(),
  anchorTest(),
  anchorUpgrade(),
  anchorVerify(),
];

export default commands;
