#include "macros.h"

#ifndef __FF_LEGACYDETECTORS_H__
#define __FF_LEGACYDETECTORS_H__

#if CV_VERSION_LOWER_THAN(5, 0, 0)
#include <opencv2/features2d.hpp>
#else
// OpenCV 5 moved these four detectors into the contrib xfeatures2d module. The
// classes themselves are unchanged, so re-expose them under cv:: to keep the
// bindings identical across both majors.
#include <opencv2/xfeatures2d.hpp>
namespace cv {
using xfeatures2d::AgastFeatureDetector;
using xfeatures2d::AKAZE;
using xfeatures2d::BRISK;
using xfeatures2d::KAZE;
} // namespace cv
#endif

#endif
