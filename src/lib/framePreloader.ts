type FramePreloaderOptions = {
  frameCount: number;
  getFrameSource: (index: number) => string;
  eagerCount?: number;
  batchSize?: number;
  batchDelayMs?: number;
  onFrameLoad?: (index: number, image: HTMLImageElement) => void;
};

export type FramePreloader = {
  start: () => void;
  getFrame: (index: number) => HTMLImageElement | null;
  warm: (index: number, radius?: number) => void;
  dispose: () => void;
};

const clamp = (value: number, min: number, max: number) =>
  Math.max(min, Math.min(max, value));

export const createFramePreloader = ({
  frameCount,
  getFrameSource,
  eagerCount = 12,
  batchSize = 8,
  batchDelayMs = 30,
  onFrameLoad,
}: FramePreloaderOptions): FramePreloader => {
  const frames: Array<HTMLImageElement | null> = Array.from(
    { length: frameCount },
    () => null,
  );

  let disposed = false;
  let started = false;
  let nextFrame = 1;
  let timerId: number | null = null;

  const loadFrame = (index: number) => {
    const frameIndex = clamp(index, 1, frameCount);
    if (disposed || frames[frameIndex - 1]) {
      return;
    }

    const image = new Image();
    image.decoding = "async";
    image.src = getFrameSource(frameIndex);
    image.onload = () => {
      onFrameLoad?.(frameIndex, image);
    };
    frames[frameIndex - 1] = image;
  };

  const loadBatch = () => {
    if (disposed) {
      return;
    }

    let loaded = 0;
    while (nextFrame <= frameCount && loaded < batchSize) {
      loadFrame(nextFrame);
      nextFrame += 1;
      loaded += 1;
    }

    if (nextFrame <= frameCount) {
      timerId = window.setTimeout(loadBatch, batchDelayMs);
    }
  };

  return {
    start: () => {
      if (started || disposed) {
        return;
      }
      started = true;

      const eagerLimit = Math.min(frameCount, eagerCount);
      while (nextFrame <= eagerLimit) {
        loadFrame(nextFrame);
        nextFrame += 1;
      }

      if (nextFrame <= frameCount) {
        loadBatch();
      }
    },
    getFrame: (index: number) => {
      const frameIndex = clamp(index, 1, frameCount);
      return frames[frameIndex - 1];
    },
    warm: (index: number, radius = 2) => {
      const start = clamp(index - radius, 1, frameCount);
      const end = clamp(index + radius, 1, frameCount);
      for (let i = start; i <= end; i += 1) {
        loadFrame(i);
      }
    },
    dispose: () => {
      disposed = true;
      if (timerId !== null) {
        window.clearTimeout(timerId);
      }
    },
  };
};
