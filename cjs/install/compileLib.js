"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.compileLib = compileLib;
const node_child_process_1 = __importDefault(require("node:child_process"));
const node_fs_1 = __importDefault(require("node:fs"));
const node_path_1 = __importDefault(require("node:path"));
const node_os_1 = require("node:os");
const picocolors_1 = __importDefault(require("picocolors"));
const findOpenCV_js_1 = require("./findOpenCV.js");
const meta_js_1 = require("../lib/meta.js");
const GYP_QUERIES = ['OPENCVNODEJS_INCLUDES', 'OPENCVNODEJS_LIBRARIES'];
const GYP_ACTIONS = ['build', 'clean', 'configure', 'rebuild', 'install'];
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
function describe({ version, source, includeDirs, libDir, modules }) {
    return [
        `${picocolors_1.default.green('OpenCV')} ${picocolors_1.default.yellow(`${version.major}.${version.minor}.${version.revision}`)} via ${picocolors_1.default.green(source)}`,
        `  includes: ${includeDirs.map((d) => picocolors_1.default.yellow(d)).join(', ')}`,
        `  libraries: ${picocolors_1.default.yellow(libDir)}`,
        `  modules (${modules.length}): ${picocolors_1.default.yellow(modules.join(', '))}`,
    ].join(node_os_1.EOL);
}
function fail(message) {
    console.error(`${node_os_1.EOL}${picocolors_1.default.red('opencv-nodejs:')} ${message}${node_os_1.EOL}`);
    process.exitCode = 1;
}
function findExecutable(name) {
    const onPath = (process.env.PATH || '').split(node_path_1.default.delimiter).some((dir) => {
        if (!dir) {
            return false;
        }
        const names = process.platform === 'win32' ? [`${name}.cmd`, `${name}.exe`, name] : [name];
        return names.some((n) => node_fs_1.default.existsSync(node_path_1.default.join(dir, n)));
    });
    if (onPath) {
        return name;
    }
    for (const start of [(0, meta_js_1.getDirName)(), process.cwd()]) {
        let dir = start;
        for (;;) {
            const binPath = node_path_1.default.join(dir, 'node_modules', '.bin', name);
            if (node_fs_1.default.existsSync(binPath)) {
                return binPath;
            }
            const parent = node_path_1.default.resolve(dir, '..');
            if (parent === dir) {
                break;
            }
            dir = parent;
        }
    }
    throw new Error(`Cannot find "${name}". Install it with:${node_os_1.EOL}  npm install --save-dev ${name}`);
}
function parseOptions(args) {
    const opts = { jobs: 'MAX', debug: false, electron: false, dryRun: false, nodeGypOptions: '' };
    for (let i = 0; i < args.length; i++) {
        const eq = args[i].indexOf('=');
        const name = eq === -1 ? args[i] : args[i].slice(0, eq);
        const nextValue = () => { var _a; return (eq === -1 ? (_a = args[++i]) !== null && _a !== void 0 ? _a : '' : args[i].slice(eq + 1)); };
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
async function compileLib(args) {
    const action = args[args.length - 1];
    if (GYP_QUERIES.includes(action)) {
        try {
            const config = (0, findOpenCV_js_1.findOpenCV)();
            const values = action === 'OPENCVNODEJS_INCLUDES' ? config.includeDirs : (0, findOpenCV_js_1.getLibraries)(config);
            // node-gyp splices stdout into the build definition, so nothing else may
            // be printed there.
            values.forEach((v) => console.log(v));
        }
        catch (e) {
            fail(e.message);
        }
        return;
    }
    if (args.includes('--help') || args.includes('-h')) {
        console.log(USAGE);
        return;
    }
    let config;
    try {
        config = (0, findOpenCV_js_1.findOpenCV)();
    }
    catch (e) {
        return fail(e.message);
    }
    console.log(describe(config));
    if (action === 'info') {
        return;
    }
    if (!GYP_ACTIONS.includes(action)) {
        return fail(`unknown action ${picocolors_1.default.yellow(action)}${node_os_1.EOL}${node_os_1.EOL}${USAGE}`);
    }
    const opts = parseOptions(args);
    const bin = opts.electron ? 'electron-rebuild' : 'node-gyp';
    let cmd;
    try {
        cmd = findExecutable(bin);
    }
    catch (e) {
        return fail(e.message);
    }
    // Runs under `shell: true`, so a resolved path containing spaces needs quoting.
    if (/\s/.test(cmd)) {
        cmd = JSON.stringify(cmd);
    }
    cmd += ` ${action} --jobs ${opts.jobs} ${opts.debug ? '--debug' : '--release'}`;
    if (opts.nodeGypOptions) {
        cmd += ` ${opts.nodeGypOptions}`;
    }
    const cwd = node_path_1.default.join((0, meta_js_1.getDirName)(), '..', '..');
    if (opts.dryRun) {
        console.log(`${node_os_1.EOL}cd ${cwd.includes(' ') ? `"${cwd}"` : cwd}${node_os_1.EOL}${cmd}${node_os_1.EOL}`);
        return;
    }
    console.log(`${node_os_1.EOL}Running ${picocolors_1.default.green(cmd)} in ${picocolors_1.default.yellow(cwd)}${node_os_1.EOL}`);
    const code = await new Promise((resolve) => {
        const child = node_child_process_1.default.spawn(cmd, { cwd, shell: true, stdio: 'inherit' });
        child.on('error', (err) => {
            console.error(`${picocolors_1.default.red('opencv-nodejs:')} failed to start ${bin}: ${err.message}`);
            resolve(1);
        });
        child.on('close', resolve);
    });
    if (code !== 0) {
        console.error(`${node_os_1.EOL}${picocolors_1.default.red('opencv-nodejs:')} ${bin} exited with code ${code}.`);
        console.error(`Check that the OpenCV development headers are installed.${node_os_1.EOL}${(0, findOpenCV_js_1.installHint)()}${node_os_1.EOL}`);
        process.exitCode = code;
        return;
    }
    console.log(`${node_os_1.EOL}${picocolors_1.default.green('opencv-nodejs:')} ${bin} completed successfully.${node_os_1.EOL}`);
}
