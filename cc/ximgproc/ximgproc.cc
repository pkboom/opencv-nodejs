#include "opencv_modules.h"

#ifdef HAVE_OPENCV_XIMGPROC

#include "SuperpixelSEEDS.h"
#include "ximgproc.h"

#include "SuperpixelLSC.h"
#include "SuperpixelSLIC.h"

NAN_MODULE_INIT(XImgproc::Init) {
  SuperpixelSEEDS::Init(target);
  SuperpixelSLIC::Init(target);
  SuperpixelLSC::Init(target);
  FF_SET_JS_PROP(target, SLIC, Nan::New<v8::Integer>(cv::ximgproc::SLIC));
  FF_SET_JS_PROP(target, SLICO, Nan::New<v8::Integer>(cv::ximgproc::SLICO));
}

#endif // HAVE_OPENCV_XIMGPROC