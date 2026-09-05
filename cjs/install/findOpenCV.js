"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.installHint = installHint;
exports.findOpenCV = findOpenCV;
exports.getLibraries = getLibraries;
const node_child_process_1 = require("node:child_process");
const node_fs_1 = __importDefault(require("node:fs"));
const node_path_1 = __importDefault(require("node:path"));
const MIN_OPENCV_MAJOR = 4;
const MAX_OPENCV_MAJOR = 5;
/** OpenCV 5 ships `opencv5.pc`, OpenCV 4 ships `opencv4.pc`. Newest first. */
const PKG_CONFIG_NAMES = ['opencv5', 'opencv4'];
/** Headers are referenced as <opencv2/...>, which lives inside one of these. */
const INCLUDE_SUBDIRS = ['opencv5', 'opencv4'];
function isDir(p) {
    try {
        return node_fs_1.default.statSync(p).isDirectory();
    }
    catch {
        return false;
    }
}
function tryExec(cmd, args) {
    try {
        return (0, node_child_process_1.execFileSync)(cmd, args, { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }).trim();
    }
    catch {
        return '';
    }
}
function readVersion(includeDirs) {
    for (const dir of includeDirs) {
        let text;
        try {
            text = node_fs_1.default.readFileSync(node_path_1.default.join(dir, 'opencv2', 'core', 'version.hpp'), 'utf8');
        }
        catch {
            continue;
        }
        const read = (name) => {
            const m = new RegExp(`^\\s*#\\s*define\\s+CV_VERSION_${name}\\s+(\\d+)`, 'm').exec(text);
            return m ? parseInt(m[1], 10) : null;
        };
        const major = read('MAJOR');
        const minor = read('MINOR');
        const revision = read('REVISION');
        if (major !== null && minor !== null && revision !== null) {
            return { major, minor, revision };
        }
    }
    return null;
}
function findModules(libDir) {
    let entries;
    try {
        entries = node_fs_1.default.readdirSync(libDir);
    }
    catch {
        return [];
    }
    const found = new Set();
    for (const entry of entries) {
        // opencv_world4130.lib, opencv_core4130.lib
        const win = /^opencv_([a-z0-9_]+?)\d*\.lib$/i.exec(entry);
        if (win) {
            found.add(win[1].toLowerCase());
            continue;
        }
        // libopencv_core.dylib, libopencv_core.so.4.13.0
        const unix = /^libopencv_([a-z0-9_]+?)\.(?:so|dylib)(?:\.[\d.]+)?$/i.exec(entry);
        if (unix) {
            found.add(unix[1].toLowerCase());
        }
    }
    return [...found].sort();
}
/**
 * A pin is a directive, not a hint: an unusable one throws instead of returning
 * nothing, since falling through to autodetection would build against a
 * different OpenCV -- possibly a different major -- and still report success.
 */
function fromEnv() {
    const { OPENCV_INCLUDE_DIR, OPENCV_LIB_DIR } = process.env;
    if (!OPENCV_INCLUDE_DIR && !OPENCV_LIB_DIR) {
        return [];
    }
    if (!OPENCV_INCLUDE_DIR || !OPENCV_LIB_DIR) {
        const missing = OPENCV_INCLUDE_DIR ? 'OPENCV_LIB_DIR' : 'OPENCV_INCLUDE_DIR';
        throw new Error(`OPENCV_INCLUDE_DIR and OPENCV_LIB_DIR must be set together; ${missing} is missing.`);
    }
    const inc = node_path_1.default.resolve(OPENCV_INCLUDE_DIR);
    const libDir = node_path_1.default.resolve(OPENCV_LIB_DIR);
    // Accept either the versioned dir or its parent.
    const includeDirs = (INCLUDE_SUBDIRS.some((d) => inc.endsWith(d))
        ? [inc, node_path_1.default.dirname(inc)]
        : [inc, ...INCLUDE_SUBDIRS.map((d) => node_path_1.default.join(inc, d))]).filter(isDir);
    if (!includeDirs.length) {
        throw new Error(`OPENCV_INCLUDE_DIR does not exist: ${inc}`);
    }
    if (!isDir(libDir)) {
        throw new Error(`OPENCV_LIB_DIR does not exist: ${libDir}`);
    }
    return [{ source: 'OPENCV_INCLUDE_DIR / OPENCV_LIB_DIR', includeDirs, libDir }];
}
function fromPkgConfig() {
    return PKG_CONFIG_NAMES.flatMap((pkgName) => {
        const cflags = tryExec('pkg-config', ['--cflags-only-I', pkgName]);
        const libdirs = tryExec('pkg-config', ['--libs-only-L', pkgName]);
        const strip = (out, flag) => out
            .split(/\s+/)
            .filter((t) => t.startsWith(flag))
            .map((t) => t.slice(flag.length))
            .filter(isDir);
        const includeDirs = strip(cflags, '-I');
        if (!includeDirs.length) {
            return [];
        }
        // pkg-config omits -L when the libraries sit in the linker's default path.
        const libDir = strip(libdirs, '-L')[0]
            || defaultUnixLibDirs().find((d) => findModules(d).length);
        return libDir ? [{ source: `pkg-config (${pkgName})`, includeDirs, libDir }] : [];
    });
}
function defaultUnixLibDirs() {
    return [
        '/usr/lib',
        `/usr/lib/${process.arch === 'arm64' ? 'aarch64' : 'x86_64'}-linux-gnu`,
        '/usr/lib64',
        '/usr/local/lib',
        '/opt/homebrew/lib',
    ];
}
/**
 * Homebrew's `opencv` is OpenCV 5. `opencv@4` is keg-only, so it is neither
 * symlinked into the prefix nor visible to pkg-config and must be probed by
 * name. With both installed `opencv` wins; pin via OPENCV_INCLUDE_DIR.
 */
function fromHomebrew() {
    if (process.platform !== 'darwin' && process.platform !== 'linux') {
        return [];
    }
    const candidates = [];
    for (const formula of ['opencv', 'opencv@4']) {
        const prefix = tryExec('brew', ['--prefix', formula]);
        if (!prefix || !isDir(prefix)) {
            continue;
        }
        const include = INCLUDE_SUBDIRS.map((d) => node_path_1.default.join(prefix, 'include', d)).find(isDir);
        if (include) {
            candidates.push({
                source: `Homebrew ${formula} (${prefix})`,
                includeDirs: [include, node_path_1.default.join(prefix, 'include')].filter(isDir),
                libDir: node_path_1.default.join(prefix, 'lib'),
            });
        }
    }
    return candidates;
}
function fromSystemDirs() {
    if (process.platform === 'win32') {
        return [];
    }
    const include = ['/usr/include', '/usr/local/include']
        .flatMap((base) => INCLUDE_SUBDIRS.map((d) => node_path_1.default.join(base, d)))
        .find((d) => isDir(node_path_1.default.join(d, 'opencv2')));
    if (!include) {
        return [];
    }
    const libDir = defaultUnixLibDirs().find((d) => findModules(d).length);
    if (!libDir) {
        return [];
    }
    return [{
            source: `system package (${include})`,
            includeDirs: [include, node_path_1.default.dirname(include)].filter(isDir),
            libDir,
        }];
}
/**
 * Chocolatey's `opencv`, and the official Windows archive it mirrors, unpack to
 * <root>/build with headers in build/include and import libraries in
 * build/x64/vc<N>/lib.
 */
function fromWindows() {
    if (process.platform !== 'win32') {
        return [];
    }
    const roots = [];
    if (process.env.OPENCV_DIR) {
        // OPENCV_DIR conventionally points at the vc<N> dir; accept any depth.
        roots.push(process.env.OPENCV_DIR, node_path_1.default.resolve(process.env.OPENCV_DIR, '..', '..'), node_path_1.default.resolve(process.env.OPENCV_DIR, '..', '..', '..'));
    }
    roots.push('C:\\tools\\opencv\\build', 'C:\\opencv\\build');
    for (const root of roots) {
        const include = node_path_1.default.join(root, 'include');
        if (!isDir(node_path_1.default.join(include, 'opencv2'))) {
            continue;
        }
        const archDir = node_path_1.default.join(root, process.arch === 'ia32' ? 'x86' : 'x64');
        if (!isDir(archDir)) {
            continue;
        }
        const libDir = node_fs_1.default
            .readdirSync(archDir)
            .filter((d) => /^vc\d+$/i.test(d))
            .sort((a, b) => parseInt(b.slice(2), 10) - parseInt(a.slice(2), 10))
            .map((ts) => node_path_1.default.join(archDir, ts, 'lib'))
            .find((d) => findModules(d).length);
        if (libDir) {
            return [{ source: `Windows install (${root})`, includeDirs: [include], libDir }];
        }
    }
    return [];
}
function installHint() {
    switch (process.platform) {
        case 'darwin':
            return 'Install OpenCV with Homebrew:\n  brew install opencv        # OpenCV 5\n  brew install opencv@4      # OpenCV 4';
        case 'win32':
            return 'Install OpenCV with Chocolatey:\n  choco install opencv';
        default:
            return 'Install OpenCV with your package manager, e.g.:\n  sudo apt install libopencv-dev';
    }
}
function findOpenCV() {
    const pinned = fromEnv();
    const candidates = pinned.length
        ? pinned
        : [fromHomebrew, fromPkgConfig, fromSystemDirs, fromWindows].flatMap((probe) => probe());
    const rejected = [];
    for (const candidate of candidates) {
        const version = readVersion(candidate.includeDirs);
        if (!version) {
            rejected.push(`${candidate.source}: no opencv2/core/version.hpp under ${candidate.includeDirs.join(', ')}`);
            continue;
        }
        const found = `OpenCV ${version.major}.${version.minor}.${version.revision}`;
        if (version.major < MIN_OPENCV_MAJOR || version.major > MAX_OPENCV_MAJOR) {
            rejected.push(`${candidate.source}: ${found} is not supported`);
            continue;
        }
        const modules = findModules(candidate.libDir);
        if (!modules.length) {
            rejected.push(`${candidate.source}: ${found} found, but no OpenCV libraries in ${candidate.libDir}`);
            continue;
        }
        return { ...candidate, version, modules };
    }
    const supported = `OpenCV ${MIN_OPENCV_MAJOR}.x and ${MAX_OPENCV_MAJOR}.x are supported`;
    const detail = rejected.length ? `\n${rejected.map((r) => `  - ${r}`).join('\n')}` : '';
    if (pinned.length) {
        throw new Error(`OPENCV_INCLUDE_DIR / OPENCV_LIB_DIR do not point at a usable OpenCV (${supported}).${detail}`);
    }
    throw new Error(`No usable OpenCV installation found (${supported}).${detail}\n\n${installHint()}`);
}
function getLibraries({ libDir, modules }) {
    if (process.platform === 'win32') {
        // MSVC links import libraries by path; opencv_world bundles every module.
        const files = node_fs_1.default.readdirSync(libDir);
        const pick = (mod) => files.find((f) => new RegExp(`^opencv_${mod}\\d*\\.lib$`, 'i').test(f));
        const world = pick('world');
        const wanted = world ? [world] : modules.map(pick).filter((f) => !!f);
        return wanted.map((f) => node_path_1.default.join(libDir, f));
    }
    return [`-L${libDir}`, ...modules.map((m) => `-lopencv_${m}`), `-Wl,-rpath,${libDir}`];
}
