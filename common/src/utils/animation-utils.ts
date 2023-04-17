export const EmptyFrame = () => null;

export const getFrame = (currentFrame: number, animations: Record<number, React.FC[]>): React.FC => {
  const sortedStartFrames = Object.keys(animations).map(k => Number(k)).sort((a, b) => a - b);
  let i = 0;

  while (sortedStartFrames[i + 1] !== undefined && currentFrame >= sortedStartFrames[i + 1]) {
    i += 1;
  }

  const startFrame = sortedStartFrames[i];
  const frames = animations[startFrame];

  if (currentFrame >= startFrame) {
    return frames[Math.min(currentFrame - sortedStartFrames[i], frames.length - 1)];
  }
  return frames[0];
};
