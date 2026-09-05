#include "macros.h"
#include <opencv2/calib3d.hpp>
#if CV_VERSION_GREATER_EQUAL(5, 0, 0)
// OpenCV 5 moved chessboard/circle-grid detection, and with it the
// CALIB_CB_* flags, from calib3d to objdetect.
#include <opencv2/objdetect.hpp>
#endif

#ifndef __FF_CALIB3D_CONSTANTS_H__
#define __FF_CALIB3D_CONSTANTS_H__

class Calib3dConstants {
public:
  static void Init(v8::Local<v8::Object> module);
};

#endif