import React, { useEffect, useRef, useState } from "react";
import { physics } from "../../utils/physics";

const Canvas = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    physics(canvasRef);
  }, [canvasRef]);
  return (
    <div>
      <canvas ref={canvasRef} />
    </div>
  );
};

export default Canvas;
