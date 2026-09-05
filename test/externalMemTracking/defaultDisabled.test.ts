import { expect } from 'chai';
import cv from '@pkboom/opencv-nodejs';

describe('External Memory Tracking', () => {
  it('should be enabled by default', () => {
    expect(cv.isCustomMatAllocatorEnabled()).to.be.true;
  });
});
