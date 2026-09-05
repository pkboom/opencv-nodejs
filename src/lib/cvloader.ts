import fs from 'node:fs';
import path from 'node:path';
import pc from 'picocolors';
import { isElectronWebpack } from './commons.js';
import type * as openCV from '../../typings/index.js';
import { getDirName, getRequire } from './meta.js';

declare type OpenCVType = typeof openCV;

const logDebug = process.env.OPENCVNODEJS_DEBUG_REQUIRE
  ? (prefix: string, message: string) => console.log(`[${prefix}] ${message}`)
  : () => { /* ignore */ };

/** Only consulted after a load failure, so detection stays off the happy path. */
function tryGetOpencvLibDir(): string {
  if (process.env.OPENCV_BIN_DIR) {
    return process.env.OPENCV_BIN_DIR;
  }
  if (process.env.OPENCV_LIB_DIR) {
    return process.env.OPENCV_LIB_DIR;
  }
  try {
    const { findOpenCV } = getRequire()('../install/findOpenCV.js') as typeof import('../install/findOpenCV.js');
    const { libDir } = findOpenCV();
    logDebug('libDir', `detected ${libDir}`);
    // Windows ships the DLLs in build/bin, not beside the .lib files.
    const binDir = path.resolve(libDir, '..', 'bin');
    return fs.existsSync(binDir) ? binDir : libDir;
  } catch (e) {
    logDebug('libDir', `detection failed: ${(e as Error).message}`);
    return '';
  }
}

function getRequirePath(): string {
  if (isElectronWebpack()) {
    return '../../build/Release/opencv_nodejs.node';
  }
  const debugPath = path.join(getDirName(), '../../build/Debug/opencv_nodejs.node');
  const requirePath = fs.existsSync(debugPath)
    ? debugPath
    : path.join(getDirName(), '../../build/Release/opencv_nodejs.node');
  return requirePath.replace(/\.node$/, '');
}

export function getOpenCV(): OpenCVType {
  const requirePath = getRequirePath();
  const loadError = (detail: string, remedy: string) => new Error(
    `Failed to load the opencv-nodejs addon from ${pc.yellow(requirePath)}.\n${detail}\n${remedy}\n  npx build-opencv rebuild\n`,
  );

  try {
    return getRequire()(requirePath) as OpenCVType;
  } catch (err) {
    const message = (err as Error).message;
    logDebug('require', `failed to require ${requirePath}: ${message}`);

    // Nothing to resolve: the addon was never built.
    if (message.startsWith('Cannot find module')) {
      throw loadError(
        'It has not been built yet.',
        'Install OpenCV (4 or 5) with your package manager, then run:',
      );
    }

    // The addon exists but its OpenCV libraries did not resolve. On Windows
    // that is a PATH problem, so retry with the library directory added.
    const libDir = tryGetOpencvLibDir();
    if (libDir && fs.existsSync(libDir)) {
      process.env.PATH = `${process.env.PATH || ''}${path.delimiter}${libDir}`;
      try {
        return getRequire()(requirePath) as OpenCVType;
      } catch (retryErr) {
        throw loadError(
          `  ${pc.red((retryErr as Error).message)}\n`
            + `Its OpenCV libraries could not be loaded from ${pc.yellow(libDir)}.`,
          'If you changed OpenCV since building, rebuild with:',
        );
      }
    }

    throw loadError(`  ${pc.red(message)}`, 'Ensure OpenCV (4 or 5) is installed, then rebuild with:');
  }
}

export default getOpenCV;
