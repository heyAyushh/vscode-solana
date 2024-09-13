import { execa } from 'execa';
import chan, { appendChan } from "./outputChannel";
import { spawnChan } from "./spawnExec";

export default async function pwshChan(
  cmd: string,
  args: string[],
  title: string,
  cwd?: string,
  silent: boolean = false
) {
  try {
    const result = await spawnChan('powershell', ['-Command', `${cmd} ${args.join(' ')}`], title, cwd, silent);

    if (result) {
      if (result.failed) {
        appendChan('ERROR', result.stdout);
        appendChan('ERROR', result.stderr);
      } else {
        appendChan('INFO', result.stdout);
      }
    }
  } catch (error) {
    if (error instanceof Error) {
      appendChan('ERROR', error.message);
      !silent && chan.show(true);
    }
  }
}

export const pwshExec = async (cmd: string) => {
  try {
    const result = await execa('powershell', ['-Command', cmd]);
    return result.stdout;
  } catch (error) {
    if (error instanceof Error) {
      appendChan('ERROR', error.message);
      chan.show(true);
    }
    throw error;
  }
};

