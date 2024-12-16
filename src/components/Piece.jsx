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

    // Notifica a interação dos triângulos com o tabuleiro
    if (pieceRef.current) {
      const triangles = Array.from(pieceRef.current.querySelectorAll("path"));
      onHover(triangles);
    }
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
      <svg width={width} height={svgHeight}>
        {shapes[shape]}
      </svg>
    </div>
  );
};

export default Piece;
