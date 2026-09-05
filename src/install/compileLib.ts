import child_process from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { EOL } from 'node:os';
import pc from 'picocolors';
import { findOpenCV, getLibraries, installHint, type OpenCVConfig } from './findOpenCV.js';
import { getDirName } from '../lib/meta.js';

const GYP_QUERIES = ['OPENCVNODEJS_INCLUDES', 'OPENCVNODEJS_LIBRARIES'] as const;
const GYP_ACTIONS = ['build', 'clean', 'configure', 'rebuild', 'install'] as const;

type GypQuery = (typeof GYP_QUERIES)[number];
type GypAction = (typeof GYP_ACTIONS)[number];

const USAGE = `Usage: build-opencv [options] <${[...GYP_ACTIONS, 'info'].join('|')}>

OpenCV 4 or 5 must already be installed by your package manager; this command
only compiles the bindings against it.

Actions
  rebuild      clean, configure and build the addon (the usual choice)
  build        build the addon
  configure    run the node-gyp configure step only
  clean        remove build output
  info         show the detected OpenCV install and exit

Options
  --jobs <n>          parallel compile jobs, or MAX (default: MAX)
  --debug             build the Debug configuration
  --electron          build with electron-rebuild instead of node-gyp
  --node-gyp-options  extra flags forwarded verbatim to node-gyp
  --dry-run           print the node-gyp command instead of running it
  -h, --help          show this message

Environment
  OPENCV_INCLUDE_DIR  override the detected include directory
  OPENCV_LIB_DIR      override the detected library directory`;

function describe({ version, source, includeDirs, libDir, modules }: OpenCVConfig): string {
  return [
    `${pc.green('OpenCV')} ${pc.yellow(`${version.major}.${version.minor}.${version.revision}`)} via ${pc.green(source)}`,
    `  includes: ${includeDirs.map((d) => pc.yellow(d)).join(', ')}`,
    `  libraries: ${pc.yellow(libDir)}`,
    `  modules (${modules.length}): ${pc.yellow(modules.join(', '))}`,
  ].join(EOL);
}

function fail(message: string): void {
  console.error(`${EOL}${pc.red('opencv-nodejs:')} ${message}${EOL}`);
  process.exitCode = 1;
}

function findExecutable(name: string): string {
  const onPath = (process.env.PATH || '').split(path.delimiter).some((dir) => {
    if (!dir) {
      return false;
    }
    const names = process.platform === 'win32' ? [`${name}.cmd`, `${name}.exe`, name] : [name];
    return names.some((n) => fs.existsSync(path.join(dir, n)));
  });
  if (onPath) {
    return name;
  }
  for (const start of [getDirName(), process.cwd()]) {
    let dir = start;
    for (;;) {
      const binPath = path.join(dir, 'node_modules', '.bin', name);
      if (fs.existsSync(binPath)) {
        return binPath;
      }
      const parent = path.resolve(dir, '..');
      if (parent === dir) {
        break;
      }
      dir = parent;
    }
  }
  throw new Error(`Cannot find "${name}". Install it with:${EOL}  npm install --save-dev ${name}`);
}

interface Options {
  jobs: string;
  debug: boolean;
  electron: boolean;
  dryRun: boolean;
  nodeGypOptions: string;
}

function parseOptions(args: string[]): Options {
  const opts: Options = { jobs: 'MAX', debug: false, electron: false, dryRun: false, nodeGypOptions: '' };
  for (let i = 0; i < args.length; i++) {
    const eq = args[i].indexOf('=');
    const name = eq === -1 ? args[i] : args[i].slice(0, eq);
    const nextValue = () => (eq === -1 ? args[++i] ?? '' : args[i].slice(eq + 1));
    switch (name) {
      case '--jobs':
        opts.jobs = nextValue();
        break;
      case '--debug':
        opts.debug = true;
        break;
      case '--electron':
        opts.electron = true;
        break;
      case '--dry-run':
      case '--dryrun':
        opts.dryRun = true;
        break;
      case '--node-gyp-options':
        opts.nodeGypOptions = nextValue();
        break;
    }
  }
  return { ...opts, debug: opts.debug || !!process.env.BINDINGS_DEBUG };
}

/** `args` is `process.argv`, so the action is the last element. */
export async function compileLib(args: string[]): Promise<void> {
  const action = args[args.length - 1];

  if (GYP_QUERIES.includes(action as GypQuery)) {
    try {
      const config = findOpenCV();
      const values = action === 'OPENCVNODEJS_INCLUDES' ? config.includeDirs : getLibraries(config);
      // node-gyp splices stdout into the build definition, so nothing else may
      // be printed there.
      values.forEach((v) => console.log(v));
    } catch (e) {
      fail((e as Error).message);
    }
    return;
  }

  if (args.includes('--help') || args.includes('-h')) {
    console.log(USAGE);
    return;
  }

  let config: OpenCVConfig;
  try {
    config = findOpenCV();
  } catch (e) {
    return fail((e as Error).message);
  }
  console.log(describe(config));

  if (action === 'info') {
    return;
  }
  if (!GYP_ACTIONS.includes(action as GypAction)) {
    return fail(`unknown action ${pc.yellow(action)}${EOL}${EOL}${USAGE}`);
  }

  const opts = parseOptions(args);
  const bin = opts.electron ? 'electron-rebuild' : 'node-gyp';
  let cmd: string;
  try {
    cmd = findExecutable(bin);
  } catch (e) {
    return fail((e as Error).message);
  }

  // Runs under `shell: true`, so a resolved path containing spaces needs quoting.
  if (/\s/.test(cmd)) {
    cmd = JSON.stringify(cmd);
  }
  cmd += ` ${action} --jobs ${opts.jobs} ${opts.debug ? '--debug' : '--release'}`;
  if (opts.nodeGypOptions) {
    cmd += ` ${opts.nodeGypOptions}`;
  }

  const cwd = path.join(getDirName(), '..', '..');
  if (opts.dryRun) {
    console.log(`${EOL}cd ${cwd.includes(' ') ? `"${cwd}"` : cwd}${EOL}${cmd}${EOL}`);
    return;
  }

  console.log(`${EOL}Running ${pc.green(cmd)} in ${pc.yellow(cwd)}${EOL}`);
  const code = await new Promise<number>((resolve) => {
    const child = child_process.spawn(cmd, { cwd, shell: true, stdio: 'inherit' });
    child.on('error', (err) => {
      console.error(`${pc.red('opencv-nodejs:')} failed to start ${bin}: ${err.message}`);
      resolve(1);
    });
    child.on('close', resolve);
  });

  if (code !== 0) {
    console.error(`${EOL}${pc.red('opencv-nodejs:')} ${bin} exited with code ${code}.`);
    console.error(`Check that the OpenCV development headers are installed.${EOL}${installHint()}${EOL}`);
    process.exitCode = code;
    return;
  }
  console.log(`${EOL}${pc.green('opencv-nodejs:')} ${bin} completed successfully.${EOL}`);
}
