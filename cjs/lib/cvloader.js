"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getOpenCV = getOpenCV;
const node_fs_1 = __importDefault(require("node:fs"));
const node_path_1 = __importDefault(require("node:path"));
const picocolors_1 = __importDefault(require("picocolors"));
const commons_js_1 = require("./commons.js");
const meta_js_1 = require("./meta.js");
const logDebug = process.env.OPENCVNODEJS_DEBUG_REQUIRE
    ? (prefix, message) => console.log(`[${prefix}] ${message}`)
    : () => { };
/** Only consulted after a load failure, so detection stays off the happy path. */
function tryGetOpencvLibDir() {
    if (process.env.OPENCV_BIN_DIR) {
        return process.env.OPENCV_BIN_DIR;
    }
    if (process.env.OPENCV_LIB_DIR) {
        return process.env.OPENCV_LIB_DIR;
    }
    try {
        const { findOpenCV } = (0, meta_js_1.getRequire)()('../install/findOpenCV.js');
        const { libDir } = findOpenCV();
        logDebug('libDir', `detected ${libDir}`);
        // Windows ships the DLLs in build/bin, not beside the .lib files.
        const binDir = node_path_1.default.resolve(libDir, '..', 'bin');
        return node_fs_1.default.existsSync(binDir) ? binDir : libDir;
    }
    catch (e) {
        logDebug('libDir', `detection failed: ${e.message}`);
        return '';
    }
}
function getRequirePath() {
    if ((0, commons_js_1.isElectronWebpack)()) {
        return '../../build/Release/opencv_nodejs.node';
    }
    const debugPath = node_path_1.default.join((0, meta_js_1.getDirName)(), '../../build/Debug/opencv_nodejs.node');
    const requirePath = node_fs_1.default.existsSync(debugPath)
        ? debugPath
        : node_path_1.default.join((0, meta_js_1.getDirName)(), '../../build/Release/opencv_nodejs.node');
    return requirePath.replace(/\.node$/, '');
}
function getOpenCV() {
    const requirePath = getRequirePath();
    const loadError = (detail, remedy) => new Error(`Failed to load the opencv-nodejs addon from ${picocolors_1.default.yellow(requirePath)}.\n${detail}\n${remedy}\n  npx build-opencv rebuild\n`);
    try {
        return (0, meta_js_1.getRequire)()(requirePath);
    }
    catch (err) {
        const message = err.message;
        logDebug('require', `failed to require ${requirePath}: ${message}`);
        // Nothing to resolve: the addon was never built.
        if (message.startsWith('Cannot find module')) {
            throw loadError('It has not been built yet.', 'Install OpenCV (4 or 5) with your package manager, then run:');
        }
        // The addon exists but its OpenCV libraries did not resolve. On Windows
        // that is a PATH problem, so retry with the library directory added.
        const libDir = tryGetOpencvLibDir();
        if (libDir && node_fs_1.default.existsSync(libDir)) {
            process.env.PATH = `${process.env.PATH || ''}${node_path_1.default.delimiter}${libDir}`;
            try {
                return (0, meta_js_1.getRequire)()(requirePath);
            }
            catch (retryErr) {
                throw loadError(`  ${picocolors_1.default.red(retryErr.message)}\n`
                    + `Its OpenCV libraries could not be loaded from ${picocolors_1.default.yellow(libDir)}.`, 'If you changed OpenCV since building, rebuild with:');
            }
        }
        throw loadError(`  ${picocolors_1.default.red(message)}`, 'Ensure OpenCV (4 or 5) is installed, then rebuild with:');
    }
}
exports.default = getOpenCV;
