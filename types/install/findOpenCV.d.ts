export interface OpenCVVersion {
    major: number;
    minor: number;
    revision: number;
}
export interface OpenCVConfig {
    /** How OpenCV was found, for build logs and errors. */
    source: string;
    version: OpenCVVersion;
    /** Directories holding `opencv2/`. */
    includeDirs: string[];
    libDir: string;
    /** Linkable module names, e.g. `['core', 'imgproc']`. */
    modules: string[];
}
export declare function installHint(): string;
export declare function findOpenCV(): OpenCVConfig;
export declare function getLibraries({ libDir, modules }: OpenCVConfig): string[];
