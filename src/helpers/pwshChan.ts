import { PowerShell } from 'node-powershell';
import chan, { appendChan } from "./outputChannel";

export default async function pwshChan(
  cmd: string,
  args: string[],
  title: string,
  cwd?: string,
  silent: boolean = false
) {
  const ps = new PowerShell({
    debug: true,
    executableOptions: {
      '-ExecutionPolicy': 'Bypass',
      '-NoProfile': true,
    },
  });
  try {    
    const scriptCommand = PowerShell.command`${cmd} ${args.join(' ')}`;
    const result = await ps.invoke(scriptCommand);

    if (result.hadErrors) {
      if (result.stdout) {
        appendChan('ERROR', result.stdout?.toString());
      } 
      if (result.stderr) {
        appendChan('ERROR', result.stderr?.toString());
      }
    } else if (result.stdout) {
      appendChan('INFO', result.stdout?.toString());
    }
  } catch (error) {
    if (error instanceof Error) {
      appendChan('ERROR', error.message);
      !silent && chan.show(true);
    }
  } finally {
    await ps.dispose();
  }
};
