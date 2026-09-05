#include "opencv_modules.h"

#ifdef HAVE_OPENCV_FACE

#include "Facemark.h"
#include "FacemarkBindings.h"

NAN_METHOD(Facemark::Save) {
  FF::TryCatch tryCatch("Facemark::Save");

  std::string path;
  if (FF::StringConverter::arg(0, &path, info)) {
    return tryCatch.reThrow();
  }
  Nan::ObjectWrap::Unwrap<Facemark>(info.This())->save(path);
}

NAN_METHOD(Facemark::Load) {
  FF::TryCatch tryCatch("Facemark::Load");

  std::string path;
  if (FF::StringConverter::arg(0, &path, info)) {
    return tryCatch.reThrow();
  }
  Nan::ObjectWrap::Unwrap<Facemark>(info.This())->load(path);
}

void Facemark::Init(v8::Local<v8::FunctionTemplate> ctor) {
  Nan::SetPrototypeMethod(ctor, "loadModel", LoadModel);
  Nan::SetPrototypeMethod(ctor, "loadModelAsync", LoadModelAsync);
  Nan::SetPrototypeMethod(ctor, "fit", Fit);
  Nan::SetPrototypeMethod(ctor, "fitAsync", FitAsync);
  Nan::SetPrototypeMethod(ctor, "save", Save);
  Nan::SetPrototypeMethod(ctor, "load", Load);
};

NAN_METHOD(Facemark::LoadModel) {
  FF::executeSyncBinding(
      std::make_shared<FacemarkBindings::LoadModelWorker>(Facemark::unwrapThis(info)->getFacemark()),
      "Facemark::LoadModel",
      info);
}

NAN_METHOD(Facemark::LoadModelAsync) {
  FF::executeAsyncBinding(
      std::make_shared<FacemarkBindings::LoadModelWorker>(Facemark::unwrapThis(info)->getFacemark()),
      "Facemark::LoadModelAsync",
      info);
}

NAN_METHOD(Facemark::Fit) {
  FF::executeSyncBinding(
      std::make_shared<FacemarkBindings::FitWorker>(Facemark::unwrapThis(info)->getFacemark()),
      "Facemark::Fit",
      info);
}

NAN_METHOD(Facemark::FitAsync) {
  FF::executeAsyncBinding(
      std::make_shared<FacemarkBindings::FitWorker>(Facemark::unwrapThis(info)->getFacemark()),
      "Facemark::FitAsync",
      info);
}

bool Facemark::detector(cv::InputArray image, cv::OutputArray faces,
                        Nan::Callback* callback) {
  Nan::HandleScope scope;

  cv::Mat frame = image.getMat().clone();
  v8::Local<v8::Value> jsMat = Mat::Converter::wrap(frame);

  v8::Local<v8::Value> argv[] = {jsMat};

  Nan::AsyncResource resource("opencv-nodejs:Facemark::Detector");
  v8::Local<v8::Object> jsObject = resource.runInAsyncScope(Nan::GetCurrentContext()->Global(), **callback, 1, argv)
                                       .ToLocalChecked()
                                       ->ToObject(Nan::GetCurrentContext())
                                       .ToLocalChecked();

  std::vector<cv::Rect2d> _faces;
  Rect::ArrayConverter::unwrapTo(&_faces, jsObject);

  cv::Mat(_faces).copyTo(faces);

  return true;
}

#endif
