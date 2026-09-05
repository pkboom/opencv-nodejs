#include "Facemark.h"
#include "FacemarkAAMData.h"

#ifndef __FF_FACEMARKBINDINGS_H_
#define __FF_FACEMARKBINDINGS_H_

namespace FacemarkBindings {

struct LoadModelWorker : public CatchCvExceptionWorker {
public:
  cv::Ptr<cv::face::Facemark> self;
  LoadModelWorker(cv::Ptr<cv::face::Facemark> self) {
    this->self = self;
  }

  virtual ~LoadModelWorker() {
  }

  std::string model;

  std::string executeCatchCvExceptionWorker() {
    self->loadModel(model);
    return "";
  }

  bool unwrapRequiredArgs(Nan::NAN_METHOD_ARGS_TYPE info) {
    return (FF::StringConverter::arg(0, &model, info));
  }
};

struct FitWorker : public CatchCvExceptionWorker {
public:
  cv::Ptr<cv::face::Facemark> self;
  FitWorker(cv::Ptr<cv::face::Facemark> self) {
    this->self = self;
  }
  virtual ~FitWorker() {
  }

  cv::Mat image;
  std::vector<cv::Rect> faces;
  std::vector<std::vector<cv::Point2f>> landmarks;

  std::string executeCatchCvExceptionWorker() {
    self->fit(image, faces, landmarks);
    return "";
  }

  v8::Local<v8::Value> getReturnValue() {
    v8::Local<v8::Value> ret = Point2::ArrayOfArraysWithCastConverter<cv::Point2f>::wrap(landmarks);
    return ret;
  }

  bool unwrapRequiredArgs(Nan::NAN_METHOD_ARGS_TYPE info) {
    return (Mat::Converter::arg(0, &image, info) || Rect::ArrayWithCastConverter<cv::Rect>::arg(1, &faces, info));
  }
};

} // namespace FacemarkBindings

#endif

