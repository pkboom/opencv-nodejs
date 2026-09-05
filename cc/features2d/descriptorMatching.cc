#include "opencv_modules.h"

#ifdef HAVE_OPENCV_FEATURES2D

#include "descriptorMatching.h"

NAN_MODULE_INIT(DescriptorMatching::Init) {
  Nan::SetMethod(target, "matchFlannBased", MatchFlannBased);
  Nan::SetMethod(target, "matchBruteForce", MatchBruteForce);
  Nan::SetMethod(target, "matchBruteForceL1", MatchBruteForceL1);
  Nan::SetMethod(target, "matchBruteForceHamming", MatchBruteForceHamming);
  Nan::SetMethod(target, "matchFlannBasedAsync", MatchFlannBasedAsync);
  Nan::SetMethod(target, "matchBruteForceAsync", MatchBruteForceAsync);
  Nan::SetMethod(target, "matchBruteForceL1Async", MatchBruteForceL1Async);
  Nan::SetMethod(target, "matchBruteForceHammingAsync", MatchBruteForceHammingAsync);
  Nan::SetMethod(target, "matchBruteForceHammingLut", MatchBruteForceHammingLut);
  Nan::SetMethod(target, "matchBruteForceSL2", MatchBruteForceSL2);
  Nan::SetMethod(target, "matchBruteForceHammingLutAsync", MatchBruteForceHammingLutAsync);
  Nan::SetMethod(target, "matchBruteForceSL2Async", MatchBruteForceSL2Async);
};

NAN_METHOD(DescriptorMatching::MatchFlannBased) {
  match(info, cv::DescriptorMatcher::FLANNBASED);
}

NAN_METHOD(DescriptorMatching::MatchBruteForce) {
  match(info, cv::DescriptorMatcher::BRUTEFORCE);
}

NAN_METHOD(DescriptorMatching::MatchBruteForceL1) {
  match(info, cv::DescriptorMatcher::BRUTEFORCE_L1);
}

NAN_METHOD(DescriptorMatching::MatchBruteForceHamming) {
  match(info, cv::DescriptorMatcher::BRUTEFORCE_HAMMING);
}

NAN_METHOD(DescriptorMatching::MatchBruteForceHammingLut) {
  match(info, cv::DescriptorMatcher::BRUTEFORCE_HAMMINGLUT);
}

NAN_METHOD(DescriptorMatching::MatchBruteForceSL2) {
  match(info, cv::DescriptorMatcher::BRUTEFORCE_SL2);
}

NAN_METHOD(DescriptorMatching::MatchFlannBasedAsync) {
  matchAsync(info, cv::DescriptorMatcher::FLANNBASED);
}

NAN_METHOD(DescriptorMatching::MatchBruteForceAsync) {
  matchAsync(info, cv::DescriptorMatcher::BRUTEFORCE);
}

NAN_METHOD(DescriptorMatching::MatchBruteForceL1Async) {
  matchAsync(info, cv::DescriptorMatcher::BRUTEFORCE_L1);
}

NAN_METHOD(DescriptorMatching::MatchBruteForceHammingAsync) {
  matchAsync(info, cv::DescriptorMatcher::BRUTEFORCE_HAMMING);
}

NAN_METHOD(DescriptorMatching::MatchBruteForceHammingLutAsync) {
  matchAsync(info, cv::DescriptorMatcher::BRUTEFORCE_HAMMINGLUT);
}

NAN_METHOD(DescriptorMatching::MatchBruteForceSL2Async) {
  matchAsync(info, cv::DescriptorMatcher::BRUTEFORCE_SL2);
}

struct DescriptorMatching::MatchWorker : public CatchCvExceptionWorker {
public:
  cv::Ptr<cv::DescriptorMatcher> matcher;
  MatchWorker(cv::Ptr<cv::DescriptorMatcher> _matcher) {
    this->matcher = _matcher;
  }
  virtual ~MatchWorker() {
  }

  cv::Mat descFrom;
  cv::Mat descTo;
  std::vector<cv::DMatch> dmatches;

  std::string executeCatchCvExceptionWorker() {
    matcher->match(descFrom, descTo, dmatches);
    return "";
  }

  bool unwrapRequiredArgs(Nan::NAN_METHOD_ARGS_TYPE info) {
    return Mat::Converter::arg(0, &descFrom, info)
           || Mat::Converter::arg(1, &descTo, info);
  }

  v8::Local<v8::Value> getReturnValue() {
    return DescriptorMatch::ArrayConverter::wrap(dmatches);
  }
};

void DescriptorMatching::match(Nan::NAN_METHOD_ARGS_TYPE info, cv::DescriptorMatcher::MatcherType matcherType) {
  FF::executeSyncBinding(
      std::make_shared<MatchWorker>(cv::DescriptorMatcher::create(matcherType)),
      "Match",
      info);
}

void DescriptorMatching::matchAsync(Nan::NAN_METHOD_ARGS_TYPE info, cv::DescriptorMatcher::MatcherType matcherType) {
  FF::executeAsyncBinding(
      std::make_shared<MatchWorker>(cv::DescriptorMatcher::create(matcherType)),
      "MatchAsync",
      info);
}

#endif