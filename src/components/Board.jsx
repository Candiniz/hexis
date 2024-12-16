import React, { useState, useRef } from "react";
import Piece from "./Piece";


const Board = () => {
    const [highlightedTriangles, setHighlightedTriangles] = useState([]); // Destaques
    const boardRef = useRef(null);

    const scale = 0.8; // Escala do tabuleiro
    const size = 50 * scale; // Tamanho do triângulo
    const height = (Math.sqrt(3) / 2) * size; // Altura do triângulo equilátero
    const rows = 8; // Número total de fileiras

    // Define o número de triângulos por fileira
    const triangleCounts = [9, 11, 13, 15, 15, 13, 11, 9]; // Cresce até o meio e diminui

    // Gera os triângulos
    const generateTriangles = () => {
        const triangles = [];
        let yOffset = 0; // Deslocamento vertical para cada fileira
        let xOffset = 0; // Deslocamento horizontal, será ajustado conforme a fileira
    
        triangleCounts.forEach((count, rowIndex) => {
            const rowWidth = count * (size / 2); // Largura total da fileira
            const rowCenterOffset = (triangleCounts[4] * size) / 2 - rowWidth / 2; // Centraliza a fileira baseada na maior fileira
    
            xOffset = rowCenterOffset; // Ajusta o xOffset de acordo com a centralização
    
            for (let colIndex = 0; colIndex < count; colIndex++) {
                const shouldInvert = count === 11 || count === 15;
                const isUp = shouldInvert
                    ? (rowIndex + colIndex) % 2 !== 0 // Inverte o padrão
                    : (rowIndex + colIndex) % 2 === 0; // Padrão original
                    
                const x1 = xOffset + colIndex * (size / 2); // Posição x1 do triângulo
                const x2 = x1 + size; // Posição x2 do triângulo
                const yBase = yOffset; // Posição y da fileira
    
                const uniqueIndex = `${rowIndex}-${colIndex}`; // Identificador único do triângulo
                const isHighlighted = highlightedTriangles.includes(uniqueIndex); // Verifica se o triângulo deve ser destacado
    
                triangles.push(
                    <polygon
                        key={uniqueIndex}
                        points={
                            isUp
                                ? `${x1},${yBase + height} ${x2},${yBase + height} ${x1 + size / 2},${yBase}`
                                : `${x1},${yBase} ${x2},${yBase} ${x1 + size / 2},${yBase + height}`
                        }
                        stroke="#222"
                        strokeWidth="1"
                        className={`triangles ${isHighlighted ? "highlighted" : ""}`}
                        data-unique-index={uniqueIndex}
                    />
                );
            }
    
            yOffset += height; // Ajuste para a próxima fileira (aumenta a altura a cada iteração)
        });
    
        return triangles;
    };

    // Função de colisão
    const handlePieceHover = (pieceTriangles) => {
        const boardTriangles = Array.from(
            boardRef.current.querySelectorAll(".triangles")
        ).map((triangle) => {
            const rect = triangle.getBoundingClientRect();
            const uniqueIndex = triangle.getAttribute("data-unique-index");
            return { rect, uniqueIndex };
        });

        const collidedTriangles = [];
        pieceTriangles.forEach((pieceTriangle) => {
            const pieceRect = pieceTriangle.getBoundingClientRect();
            boardTriangles.forEach(({ rect, uniqueIndex }) => {
                if (
                    pieceRect.left < rect.right &&
                    pieceRect.right > rect.left &&
                    pieceRect.top < rect.bottom &&
                    pieceRect.bottom > rect.top
                ) {
                    collidedTriangles.push(uniqueIndex);
                }
            });
        });

        setHighlightedTriangles(collidedTriangles); // Atualiza o estado
    };

    return (
        <>
            <div ref={boardRef} className="container">
                <svg
                    width={triangleCounts[3] * size + size / 2} // Calcula a largura para incluir a maior fileira e centralizar
                    height={(rows + 1) * height} // Adiciona espaço para as fileiras
                >
                    {generateTriangles()}
                </svg>
            </div>


            {/* Adiciona uma peça de exemplo */}
            <Piece
                shape="parallelogram"
                size={size}
                scaleFactor={1}
                onHover={(triangles) => handlePieceHover(triangles)}
            />
        </>
    );
};

export default Board;