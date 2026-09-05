#include "CatchCvExceptionWorker.h"
#include "Mat.h"
#include "NativeNodeUtils.h"
#include "OCRHMMClassifier.h"
#include "OCRHMMDecoder.h"
#include "macros.h"

#ifndef __FF_TEXT_H__
#define __FF_TEXT_H__

class Text {
public:
  static NAN_MODULE_INIT(Init);

  static NAN_METHOD(LoadOCRHMMClassifierNM);
  static NAN_METHOD(LoadOCRHMMClassifierNMAsync);

  static NAN_METHOD(LoadOCRHMMClassifierCNN);
  static NAN_METHOD(LoadOCRHMMClassifierCNNAsync);

  static NAN_METHOD(CreateOCRHMMTransitionsTable);
  static NAN_METHOD(CreateOCRHMMTransitionsTableAsync);
};

#endif
