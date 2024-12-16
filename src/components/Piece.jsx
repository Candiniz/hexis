import { useState } from "react";

const Piece = ({ shape, size, scaleFactor = 1 }) => {
  // Validando o tamanho
  const validSize = typeof size === "number" && !isNaN(size) ? size : 50;
  const scaledSize = validSize * scaleFactor;
  const height = Math.sqrt(3) / 2 * scaledSize;

  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);

  const width = scaledSize * 3;
  const svgHeight = scaledSize * 3;

  const handleDragStart = (e) => {
    setIsDragging(true);
    e.target.style.cursor = "grabbing";
  };

  const handleDrag = (e) => {
    if (isDragging) {
      setPosition({
        x: e.clientX - width / 2,
        y: e.clientY - svgHeight / 2,
      });
    }
  };

  const handleDragEnd = (e) => {
    setIsDragging(false);
    e.target.style.cursor = "grab";
  };

  // Definição das formas
  const shapes = {
    lozenge: (
      <g>
        <path
          d={`M0,0 L${scaledSize},0 L${scaledSize / 2},${height} Z`}
          fill="#ab5656"
          stroke="#222"
          strokeWidth="1"
        />
        <path
          d={`M${scaledSize},0 L${scaledSize * 1.5},${height} L${scaledSize / 2},${height} Z`}
          fill="#ab5656"
          stroke="#222"
          strokeWidth="1"
        />
      </g>
    ),
    parallelogram: (
      <g>
        <path
          d={`M0,0 L${scaledSize},0 L${scaledSize / 2},${height} Z`}
          fill="#598e8a"
          stroke="#222"
          strokeWidth="1"
        />
        <path
          d={`M${scaledSize},0 L${scaledSize * 1.5},${height} L${scaledSize / 2},${height} Z`}
          fill="#598e8a"
          stroke="#222"
          strokeWidth="1"
        />
        <path
          d={`M${scaledSize},0 L${scaledSize * 2},0 L${scaledSize * 1.5},${height} Z`}
          fill="#598e8a"
          stroke="#222"
          strokeWidth="1"
        />
        <path
          d={`M${scaledSize * 1.5},${height} L${scaledSize * 2},0 L${scaledSize * 2.5},${height} Z`}
          fill="#598e8a"
          stroke="#222"
          strokeWidth="1"
        />
      </g>
    ),
    hexagon: (
      <g>
        <path
          d={`M0,0 L${scaledSize},0 L${scaledSize / 2},${height} Z`}
          fill="#444"
          stroke="#222"
          strokeWidth="1"
        />
        <path
          d={`M${scaledSize},0 L${scaledSize * 1.5},${height} L${scaledSize / 2},${height} Z`}
          fill="#888"
          stroke="#222"
          strokeWidth="1"
        />
        <path
          d={`M${scaledSize * 1.5},${height} L${scaledSize},${height * 2} L${scaledSize / 2},${height} Z`}
          fill="#444"
          stroke="#222"
          strokeWidth="1"
        />
        <path
          d={`M${scaledSize / 2},${height * 2} L${scaledSize},${height * 2} L0,${height * 3} Z`}
          fill="#888"
          stroke="#222"
          strokeWidth="1"
        />
        <path
          d={`M${scaledSize},${height * 2} L${scaledSize * 1.5},${height * 3} L${scaledSize},${height * 4} Z`}
          fill="#444"
          stroke="#222"
          strokeWidth="1"
        />
        <path
          d={`M${scaledSize / 2},${height * 2} L${scaledSize},${height * 2} L${scaledSize * 1.5},${height} Z`}
          fill="#888"
          stroke="#222"
          strokeWidth="1"
        />
      </g>
    ),
  };

  return (
    <div
      style={{
        position: "absolute",
        top: position.y,
        left: position.x,
        width: width,
        height: svgHeight,
        cursor: "grab",
        opacity: isDragging ? 0.7 : 1,
      }}
      onMouseDown={handleDragStart}
      onMouseMove={handleDrag}
      onMouseUp={handleDragEnd}
      onMouseLeave={handleDragEnd}
    >
      <svg width={width} height={svgHeight}>
        {shapes[shape]}
      </svg>
    </div>
  );
};

export default Piece;
