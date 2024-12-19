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
        let xOffset = 0; // Deslocamento horizontal

        triangleCounts.forEach((count, rowIndex) => {
            const rowWidth = count * (size / 2); // Largura total da fileira
            const rowCenterOffset = (triangleCounts[4] * size) / 2 - rowWidth / 2; // Centraliza a fileira com base na fileira central

            xOffset = rowCenterOffset; // Ajusta o xOffset de acordo com a centralização da fileira

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
                // console.log(`Row: ${rowIndex}, Col: ${colIndex}, Index: ${uniqueIndex}`);

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
                        className={`triangles ${isUp ? "up" : "down"} ${isHighlighted ? "highlighted" : ""}`}
                        data-unique-index={uniqueIndex}
                    />
                );
            }

            yOffset += height; // Ajuste para a próxima fileira
        });

        return triangles;
    };


    // Função de colisão atualizada para considerar o cálculo da posição de peças maiores
    const handlePieceHover = ({ center, shape }) => {


        const boardTriangles = Array.from(
            boardRef.current.querySelectorAll(".triangles")
        ).map((triangle) => {
            const rect = triangle.getBoundingClientRect();
            const uniqueIndex = triangle.getAttribute("data-unique-index");
            const isUp = triangle.classList.contains("up"); // Verifica a classe "up" ou "down"
            return { rect, uniqueIndex, isUp };
        });


        const centralTriangle = boardTriangles.find(({ rect }) => {
            return (
                center.x > rect.left &&
                center.x < rect.right &&
                center.y > rect.top &&
                center.y < rect.bottom
            );
        });

        if (!centralTriangle) {
            setHighlightedTriangles([]);
            return;
        }

        const [centralRow, centralCol] = centralTriangle.uniqueIndex
            .split("-")
            .map(Number);
        // console.log(centralTriangle.uniqueIndex)

        const triangleMap = new Map(boardTriangles.map(triangle => [triangle.uniqueIndex, triangle]));
        const trianglesToHighlight = shape.map(({ x, y, orientation, uniqueIndex }) => {

            // Função para verificar se o uniqueIndex pertence à região nordeste
            function isNordeste(uniqueIndex) {
                const [row, col] = centralTriangle.uniqueIndex.split('-').map(Number);

                return (row === 0 && col >= 8) ||
                    (row === 1 && col >= 10) ||
                    (row === 2 && col >= 12) ||
                    (row === 3 && col >= 14);
            }

            // Definindo a lógica de cálculo do targetRow com base na região
            let targetRow;
            if (isNordeste(uniqueIndex)) {
                targetRow = centralRow + y;
                console.log(targetRow)
            } else {
                targetRow = centralRow + y;
                console.log(targetRow)
            }


            let targetCol;

            if (
                shape.some(triangle => triangle.y === 0) &&
                shape.some(triangle => triangle.y === 1)) {

                targetCol = centralCol + x - ((targetRow >= 0 && targetRow < triangleCounts.length)
                    ? Math.floor((triangleCounts[centralRow] - triangleCounts[targetRow]) / 2 - 1)
                    : 0);
            } else {
                targetCol = centralCol + x - ((targetRow >= 0 && targetRow < triangleCounts.length)
                    ? Math.floor((triangleCounts[centralRow] - triangleCounts[targetRow]) / 2)
                    : 0);
            }



            if (
                targetRow >= 0 &&
                targetRow < triangleCounts.length &&
                targetCol >= 0 &&
                targetCol < triangleCounts[targetRow]
            ) {
                const targetTriangle = triangleMap.get(`${targetRow}-${targetCol}`);

                if (targetTriangle && targetTriangle.isUp === (orientation === "up")) {
                    return `${targetRow}-${targetCol}`;
                }
            }
            return null;
        });

        if (trianglesToHighlight.some(item => item === null)) {
            setHighlightedTriangles([]);
            return
        }

        // Filtra nulos e atualiza os destaques
        setHighlightedTriangles(trianglesToHighlight.filter(Boolean));
        // console.log("Triangles to highlight:", trianglesToHighlight);
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
                shape="hexagon" // Peça de exemplo
                size={size}
                scaleFactor={1}
                onHover={(triangles) => handlePieceHover(triangles)}
            />
        </>
    );
};

export default Board;
