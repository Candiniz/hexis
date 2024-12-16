import React from "react";
import Piece from "./Piece";

const TriangleRow = ({ countUp, countDown, scale }) => {
  const size = 50 * scale; // Lado do triângulo ajustável pelo scale
  const height = (Math.sqrt(3) / 2) * size; // Altura do triângulo ajustada
  const totalTriangles = countUp + countDown;

  const triangles = [];
  for (let i = 0; i < totalTriangles; i++) {
    const isUp = i % 2 === 0; // Alterna entre triângulos para cima e para baixo
    const x1 = (i * size) / 2; // Base do triângulo na horizontal
    const x2 = x1 + size; // Final do triângulo na horizontal
    const yBase = height; // Base na vertical

    if (isUp) {
      // Triângulo apontando para cima
      triangles.push(
        <polygon
          key={i}
          points={`${x1},${yBase} ${x2},${yBase} ${x1 + size / 2},0`}
          fill="#444"
          stroke="#222"
          strokeWidth="1"
          className="triangles"
        />
      );
    } else {
      // Triângulo apontando para baixo
      triangles.push(
        <polygon
          key={i}
          points={`${x1},0 ${x2},0 ${x1 + size / 2},${yBase}`}
          fill="#444"
          stroke="#222"
          strokeWidth="1"
          className="triangles"
        />
      );
    }
  }

  const svgWidth = totalTriangles * (size / 2) + size / 2; // Largura total do SVG
  const svgHeight = height; // Altura total do SVG

  return (
    <svg width={svgWidth} height={svgHeight}>
      {triangles}
    </svg>
  );
};

const TriangleRow2 = ({ countUp, countDown, scale }) => {
  const size = 50 * scale; // Lado do triângulo ajustável pelo scale
  const height = (Math.sqrt(3) / 2) * size; // Altura do triângulo ajustada
  const totalTriangles = countUp + countDown;

  const triangles = [];
  for (let i = 0; i < totalTriangles; i++) {
    const isUp = i % 2 === 0; // Alterna entre triângulos para cima e para baixo
    const x1 = (i * size) / 2; // Base do triângulo na horizontal
    const x2 = x1 + size; // Final do triângulo na horizontal
    const yBase = height; // Base na vertical

    if (isUp) {
      // Triângulo apontando para baixo (invertido)
      triangles.push(
        <polygon
          key={i}
          points={`${x1},0 ${x2},0 ${x1 + size / 2},${yBase}`}
          fill="#444"
          stroke="#222"
          strokeWidth="1"
          className="triangles"
        />
      );
    } else {
      // Triângulo apontando para cima (invertido)
      triangles.push(
        <polygon
          key={i}
          points={`${x1},${yBase} ${x2},${yBase} ${x1 + size / 2},0`}
          fill="#444"
          stroke="#222"
          strokeWidth="1"
          className="triangles"
        />
      );
    }
  }

  const svgWidth = totalTriangles * (size / 2) + size / 2; // Largura total do SVG
  const svgHeight = height; // Altura total do SVG

  return (
    <svg width={svgWidth} height={svgHeight}>
      {triangles}
    </svg>
  );
};

const Board = () => {
  const scaleFactor = 0.8; // Ajuste de escala
  const triangleSize = 50 * scaleFactor; // Tamanho base do triângulo usado no tabuleiro

  return (
    <>
      <div>
        <div className="container-wrapper">
          <div className="container">
            <div>
              <TriangleRow countUp={4} countDown={5} scale={scaleFactor} />
            </div>
            <div>
              <TriangleRow countUp={5} countDown={6} scale={scaleFactor} />
            </div>
            <div>
              <TriangleRow countUp={6} countDown={7} scale={scaleFactor} />
            </div>
            <div>
              <TriangleRow countUp={7} countDown={8} scale={scaleFactor} />
            </div>

            <div>
              <TriangleRow2 countUp={7} countDown={8} scale={scaleFactor} />
            </div>
            <div>
              <TriangleRow2 countUp={6} countDown={7} scale={scaleFactor} />
            </div>
            <div>
              <TriangleRow2 countUp={5} countDown={6} scale={scaleFactor} />
            </div>
            <div>
              <TriangleRow2 countUp={4} countDown={5} scale={scaleFactor} />
            </div>
          </div>
        </div>
      </div>

      {/* O mesmo scaleFactor aplicado às peças */}
      <Piece shape="parallelogram" size={triangleSize} scaleFactor={1} />
    </>
  );
};

export default Board;
