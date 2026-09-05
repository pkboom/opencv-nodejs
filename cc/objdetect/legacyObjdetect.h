#include "macros.h"

#ifndef __FF_LEGACYOBJDETECT_H__
#define __FF_LEGACYOBJDETECT_H__

#if CV_VERSION_LOWER_THAN(5, 0, 0)
#include <opencv2/objdetect.hpp>
#else
// OpenCV 5 moved CascadeClassifier, HOGDescriptor and DetectionROI into the
// contrib xobjdetect module. They stayed in namespace cv, so only the header
// this binding pulls in has to change.
#include <opencv2/xobjdetect.hpp>
#endif

#endif
