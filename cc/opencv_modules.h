#include "macros.h"

// This file defines the list of modules available in current build configuration
#include <opencv2/opencv_modules.hpp>

// OpenCV 5 renamed several modules, so the HAVE_OPENCV_* macros this binding
// guards its code with no longer match. The legacy compatibility headers
// (opencv2/calib3d.hpp, opencv2/features2d.hpp) are still shipped, so map the
// new macro names back onto the ones used throughout cc/.
#if defined(HAVE_OPENCV_CALIB) && !defined(HAVE_OPENCV_CALIB3D)
#define HAVE_OPENCV_CALIB3D
#endif

#if defined(HAVE_OPENCV_FEATURES) && !defined(HAVE_OPENCV_FEATURES2D)
#define HAVE_OPENCV_FEATURES2D
#endif

// The AGAST, BRISK, KAZE and AKAZE detectors ship with features2d on OpenCV 4
// but were moved to the contrib xfeatures2d module in OpenCV 5, so their
// bindings follow whichever module actually provides them.
#if CV_VERSION_LOWER_THAN(5, 0, 0)
#ifdef HAVE_OPENCV_FEATURES2D
#define HAVE_LEGACY_FEATURE_DETECTORS
#endif
#elif defined(HAVE_OPENCV_XFEATURES2D)
#define HAVE_LEGACY_FEATURE_DETECTORS
#endif

// CascadeClassifier, HOGDescriptor and DetectionROI moved from objdetect to the
// contrib xobjdetect module in OpenCV 5. cc/objdetect binds exactly those three.
#if CV_VERSION_LOWER_THAN(5, 0, 0)
#ifdef HAVE_OPENCV_OBJDETECT
#define HAVE_LEGACY_OBJDETECT
#endif
#elif defined(HAVE_OPENCV_XOBJDETECT)
#define HAVE_LEGACY_OBJDETECT
#endif

#ifdef HAVE_OPENCV_HIGHGUI
#ifdef HAVE_OPENCV_IMGCODECS
#ifdef HAVE_OPENCV_VIDEOIO
#define HAVE_IO
#endif
#endif
#endif
