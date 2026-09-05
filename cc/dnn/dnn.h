#include "CatchCvExceptionWorker.h"
#include "Mat.h"
#include "NativeNodeUtils.h"
#include "Net.h"
#include "macros.h"
#include "opencv2/dnn.hpp"

#ifndef __FF_DNN_H__
#define __FF_DNN_H__

class Dnn {
public:
  static NAN_MODULE_INIT(Init);

  static NAN_METHOD(ReadNetFromTensorflow);
  static NAN_METHOD(ReadNetFromTensorflowAsync);
#if CV_VERSION_LOWER_THAN(5, 0, 0)
  static NAN_METHOD(ReadNetFromCaffe);
  static NAN_METHOD(ReadNetFromCaffeAsync);
#endif
  static NAN_METHOD(BlobFromImage);
  static NAN_METHOD(BlobFromImageAsync);
  static NAN_METHOD(BlobFromImages);
  static NAN_METHOD(BlobFromImagesAsync);
#if CV_VERSION_LOWER_THAN(5, 0, 0)
  static NAN_METHOD(ReadNetFromDarknet);
  static NAN_METHOD(ReadNetFromDarknetAsync);
#endif
  static NAN_METHOD(NMSBoxes);
  static NAN_METHOD(ReadNetFromONNX);
  static NAN_METHOD(ReadNetFromONNXAsync);
  static NAN_METHOD(ReadNet);
  static NAN_METHOD(ReadNetAsync);
};

#endif
