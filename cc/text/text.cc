#include "opencv_modules.h"

#ifdef HAVE_OPENCV_TEXT

#include "text.h"
#include "textBindings.h"

NAN_MODULE_INIT(Text::Init) {
  OCRHMMDecoder::Init(target);
  OCRHMMClassifier::Init(target);
  Nan::SetMethod(target, "loadOCRHMMClassifierNM", LoadOCRHMMClassifierNM);
  Nan::SetMethod(target, "loadOCRHMMClassifierNMAsync", LoadOCRHMMClassifierNMAsync);
  Nan::SetMethod(target, "loadOCRHMMClassifierCNN", LoadOCRHMMClassifierCNN);
  Nan::SetMethod(target, "loadOCRHMMClassifierCNNAsync", LoadOCRHMMClassifierCNNAsync);
  Nan::SetMethod(target, "createOCRHMMTransitionsTable", CreateOCRHMMTransitionsTable);
  Nan::SetMethod(target, "createOCRHMMTransitionsTableAsync", CreateOCRHMMTransitionsTableAsync);
}

NAN_METHOD(Text::LoadOCRHMMClassifierNM) {
  FF::executeSyncBinding(
      std::make_shared<TextBindings::LoadOCRHMMClassifierNMWorker>(),
      "Text::LoadOCRHMMClassifierNM",
      info);
}

NAN_METHOD(Text::LoadOCRHMMClassifierNMAsync) {
  FF::executeAsyncBinding(
      std::make_shared<TextBindings::LoadOCRHMMClassifierNMWorker>(),
      "Text::LoadOCRHMMClassifierNMAsync",
      info);
}

NAN_METHOD(Text::LoadOCRHMMClassifierCNN) {
  FF::executeSyncBinding(
      std::make_shared<TextBindings::LoadOCRHMMClassifierCNNWorker>(),
      "Text::LoadOCRHMMClassifierCNN",
      info);
}

NAN_METHOD(Text::LoadOCRHMMClassifierCNNAsync) {
  FF::executeAsyncBinding(
      std::make_shared<TextBindings::LoadOCRHMMClassifierCNNWorker>(),
      "Text::LoadOCRHMMClassifierCNNAsync",
      info);
}

NAN_METHOD(Text::CreateOCRHMMTransitionsTable) {
  FF::executeSyncBinding(
      std::make_shared<TextBindings::CreateOCRHMMTransitionsTableWorker>(),
      "Text::CreateOCRHMMTransitionsTable",
      info);
}

NAN_METHOD(Text::CreateOCRHMMTransitionsTableAsync) {
  FF::executeAsyncBinding(
      std::make_shared<TextBindings::CreateOCRHMMTransitionsTableWorker>(),
      "Text::CreateOCRHMMTransitionsTableAsync",
      info);
}

#endif
