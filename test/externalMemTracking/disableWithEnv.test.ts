import { expect } from 'chai';
import cv from '@pkboom/opencv-nodejs';

process.env.OPENCVNODEJS_DISABLE_EXTERNAL_MEM_TRACKING = '1';

describe('External Memory Tracking', () => {
  it('should be disabled if OPENCVNODEJS_DISABLE_EXTERNAL_MEM_TRACKING is set', () => {
    /* we can not require cv before OPENCVNODEJS_DISABLE_EXTERNAL_MEM_TRACKING is set */
    // process.env.OPENCVNODEJS_DISABLE_EXTERNAL_MEM_TRACKING = 1;
    // const cv = requireCv();
    expect(cv.isCustomMatAllocatorEnabled()).to.be.false;
  });
});
