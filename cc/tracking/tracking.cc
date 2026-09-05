#include "opencv_modules.h"

#ifdef HAVE_OPENCV_TRACKING

#include "./Trackers/TrackerBoosting.h"
#include "./Trackers/TrackerMIL.h"
#include "./Trackers/TrackerMedianFlow.h"
#include "./Trackers/TrackerTLD.h"
#include "tracking.h"

#include "./Trackers/TrackerKCF.h"
#include "MultiTracker.h"

#if CV_VERSION_LOWER_THAN(5, 0, 0)
#include "./Trackers/TrackerGOTURN.h"
#endif

#include "./Trackers/TrackerMOSSE.h"
#include "./Trackers/TrackerCSRT.h"

#if CV_VERSION_GREATER_EQUAL(4, 7, 0)
#include "./Trackers/TrackerNano.h"
#endif

NAN_MODULE_INIT(Tracking::Init) {
  TrackerBoosting::Init(target);
  TrackerMedianFlow::Init(target);
  TrackerMIL::Init(target);
  TrackerTLD::Init(target);

  TrackerKCF::Init(target);
  MultiTracker::Init(target);
  v8::Local<v8::Object> trackerKCFModes = Nan::New<v8::Object>();
  FF_SET_JS_PROP(trackerKCFModes, GRAY, Nan::New<v8::Integer>(cv::TrackerKCF::MODE::GRAY));
  FF_SET_JS_PROP(trackerKCFModes, CN, Nan::New<v8::Integer>(cv::TrackerKCF::MODE::CN));
  FF_SET_JS_PROP(trackerKCFModes, CUSTOM, Nan::New<v8::Integer>(cv::TrackerKCF::MODE::CUSTOM));
  Nan::Set(target, FF::newString("trackerKCFModes"), trackerKCFModes);

#if CV_VERSION_LOWER_THAN(5, 0, 0)
  TrackerGOTURN::Init(target);
#endif

  TrackerMOSSE::Init(target);
  TrackerCSRT::Init(target);

#if CV_VERSION_GREATER_EQUAL(4, 7, 0)
  TrackerNano::Init(target);
#endif
};

#endif
