import { useState, useRef, useEffect } from "react";

const Piece = ({ shape, size, scaleFactor = 1, onHover }) => {
  const [position, setPosition] = useState({ x: 0, y: 0 }); // Posição da peça
  const [isDragging, setIsDragging] = useState(false); // Estado de arrasto
  const pieceRef = useRef(null);
  const dragStartRef = useRef({ x: 0, y: 0 }); // Posição inicial do mouse

  // Validando o tamanho
  const validSize = typeof size === "number" && !isNaN(size) ? size : 50;
  const scaledSize = validSize * scaleFactor;

  const height = (Math.sqrt(3) / 2) * scaledSize;

  const width = scaledSize * 3;
  const svgHeight = scaledSize * 3;

  // Definição das formas
  const shapesSVG = {
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
          fill="#98b68a"
          stroke="#222"
          strokeWidth="1"
        />
        <path
          d={`M${scaledSize},0 L${scaledSize * 1.5},${height} L${scaledSize / 2},${height} Z`}
          fill="#98b68a"
          stroke="#222"
          strokeWidth="1"
        />
        <path
          d={`M${scaledSize * 1.5},${height} L${scaledSize},${height * 2} L${scaledSize / 2},${height} Z`}
          fill="#98b68a"
          stroke="#222"
          strokeWidth="1"
        />
        <path
          d={`M0,${height * 2} L${scaledSize / 2},${height} L${scaledSize},${height * 2} Z`}
          fill="#98b68a"
          stroke="#222"
          strokeWidth="1"
        />
        <path
          d={`M0,${height * 2} L${-scaledSize / 2},${height} L${scaledSize / 2},${height} Z`}
          fill="#98b68a"
          stroke="#222"
          strokeWidth="1"
        />
        <path
          d={`M0,0 L${-scaledSize / 2},${height} L${scaledSize / 2},${height} Z`}
          fill="#98b68a"
          stroke="#222"
          strokeWidth="1"
        />
      </g>
    )

  };

  const shapes = {
    parallelogram: [
    { x: 0, y: 0, orientation: "up" },
    { x: 1, y: 0, orientation: "down" },
    { x: 2, y: 0, orientation: "up" },
    { x: -1, y: 0, orientation: "down" },
  ],
    lozenge: [
      { x: -1, y: 0, orientation: "down" },
      { x: 0, y: 0, orientation: "up" },
    ],
    hexagon: [
      { x: -1, y: 0, orientation: "up" },
      { x: -2, y: 0, orientation: "down" },
      { x: -3, y: 0, orientation: "up" },
      { x: -1, y: 1, orientation: "down" },
      { x: -2, y: 1, orientation: "up" },
      { x: -3, y: 1, orientation: "down" },
    ],
  };


  // Inicia o arrasto
  const handleMouseDown = (event) => {
    setIsDragging(true);
    dragStartRef.current = {
      x: event.clientX - position.x,
      y: event.clientY - position.y,
    };
  };

  // Atualiza a posição durante o arrasto
  const handleMouseMove = (event) => {
    if (!isDragging) return;

    const newX = event.clientX - dragStartRef.current.x;
    const newY = event.clientY - dragStartRef.current.y;

    setPosition({ x: newX, y: newY });

    const centerX = newX + width / 2;
    const centerY = newY + scaledSize / 2;

    // Notifica o formato e o ponto central
    onHover({
      center: { x: centerX, y: centerY },
      shape: shapes[shape], // Formato dinâmico da peça
    });
  };

  // Finaliza o arrasto
  const handleMouseUp = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragging]);

  return (
    <div
      ref={pieceRef}
      style={{
        position: "absolute",
        top: position.y,
        left: position.x,
        width: width,
        height: svgHeight,
        cursor: isDragging ? "grabbing" : "grab",
      }}
      onMouseDown={handleMouseDown}
    >
      <svg className="svg">
        {shapesSVG[shape]}
      </svg>
    </div>
  );
};

export default Piece;