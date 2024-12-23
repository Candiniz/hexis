/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useRef, useEffect } from "react";
import { DiagonalsUp, DiagonalsDown } from './Diagonals.js';
import piecesMap from "./highlightedTriangles.js";
import Piece from "./Piece";

const Board = () => {
    const [highlightedTriangles, setHighlightedTriangles] = useState([]);
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 600);
    const boardRef = useRef(null);
    const [pieceShapes, setPieceShapes] = useState([]);
    const [droppedTriangles, setDroppedTriangles] = useState([]);
    const [droppedTriangleColors, setDroppedTriangleColors] = useState({});
    const [resetKey, setResetKey] = useState(0);
    const [animatedPieces, setAnimatedPieces] = useState([]);
    const [newPieces, setNewPieces] = useState([]);
    const [score, setScore] = useState(0);

    const scale = 0.8; // Escala do tabuleiro
    const size = 50 * scale; // Tamanho do triângulo
    const height = (Math.sqrt(3) / 2) * size; // Altura do triângulo equilátero
    const rows = 8; // Número total de fileiras

    // Define o número de triângulos por fileira
    const triangleCounts = [9, 11, 13, 15, 15, 13, 11, 9]; // Cresce até o meio e diminui

    const shapes = [
        "triangle1",
        "triangle2",
        "unique1",
        "unique2",
        "trapezoid1",
        "trapezoid2",
        "trapezoid1_vertical_a",
        "trapezoid1_vertical_b",
        "trapezoid2_vertical_a",
        "trapezoid2_vertical_b",
        "hexagon",
        "lozenge1",
        "lozenge2",
        "lozenge3",
        "parallelogram1",
        "parallelogram2",
        "parallelogram1_vertical_a",
        "parallelogram2_vertical_a",
        "parallelogram1_vertical_b",
        "parallelogram2_vertical_b",
        "semiHexagon1",
        "semiHexagon2",
        "semiHexagon3",
        "semiHexagon4",
        "semiHexagon5",
    ];

    const shapeColors = {
        triangle1: "#ff9999",
        triangle2: "#ffcc99",
        unique1: "#9eb38b",
        unique2: "#ffee99",
        lozenge1: "#ab5656",
        lozenge2: "#aba356",
        lozenge3: "#658f4f",
        trapezoid1: "#59658e",
        trapezoid2: "#9fdedb",
        trapezoid1_vertical_a: "#98b68a",
        trapezoid1_vertical_b: "#98b68a",
        trapezoid2_vertical_a: "#9fdedb",
        trapezoid2_vertical_b: "#98b68a",
        hexagon: "#9fdedb",
        parallelogram1: "#a3c4e9",
        parallelogram2: "#a3aee9",
        parallelogram1_vertical_a: "#98b68a",
        parallelogram2_vertical_a: "#59658e",
        parallelogram1_vertical_b: "#98b68a",
        parallelogram2_vertical_b: "#59658e",
        semiHexagon1: "#b269b9",
        semiHexagon2: "#a17cba",
        semiHexagon3: "#f3b9da",
        semiHexagon4: "#d5e6a7",
        semiHexagon5: "#54cdc3",
    };




    // Função para selecionar aleatoriamente uma forma
    const getRandomShape = () => {
        const randomIndex = Math.floor(Math.random() * shapes.length);
        return shapes[randomIndex];
    };
    const generateNewPieces = () => {
        const randomShapes = [getRandomShape(), getRandomShape(), getRandomShape()];
        setPieceShapes(randomShapes);

        setNewPieces([0, 1, 2]);
        setResetKey((prevKey) => prevKey + 1);
    };

    useEffect(() => {
        generateNewPieces();  // Gera as 3 peças iniciais
    }, []);

    useEffect(() => {
        if (pieceShapes.every(shape => shape === null)) {
            generateNewPieces();
        }
    }, [pieceShapes]);



    // Função para verificar se uma peça pode ser colocada no tabuleiro
    const isPiecePlaceable = (pieceCoords, occupiedCoords) => {
        return pieceCoords.every((coord) => !occupiedCoords.includes(coord));
    };

    // Função para verificar se o jogo acabou
    const checkGameOver = (occupiedCoords, availablePieceShapes) => {
        for (let pieceName of availablePieceShapes) {
            // Ignorar peças já utilizadas ou inexistentes (null)
            if (!pieceName) continue;

            const pieceConfigs = piecesMap[pieceName];

            // Verifica se pelo menos uma configuração da peça pode ser colocada
            const canPlacePiece = pieceConfigs.some(config => isPiecePlaceable(config, occupiedCoords));

            // Se ao menos uma peça pode ser colocada, o jogo continua
            if (canPlacePiece) {
                return false; // O jogo não acabou
            }
        }

        console.log('Game Over');
        return true; // O jogo acabou
    };

    useEffect(() => {
        const timeoutId = setTimeout(() => {
            // Verifica se todas as peças estão carregadas corretamente
            if (!pieceShapes || pieceShapes.every(shape => shape === null)) {
                console.log("Skipping game over check: pieceShapes is not fully loaded.");
                return;
            }

            const occupiedCoords = Object.keys(droppedTriangleColors);

            // Passa apenas as peças disponíveis no estado pieceShapes
            if (checkGameOver(occupiedCoords, pieceShapes)) {
                // Redireciona ou sinaliza que o jogo acabou
                console.log("Redirecting to Game Over screen...");
            }
        }, 100); // Delay de 100ms

        // Limpa o timeout ao desmontar ou quando as dependências mudam
        return () => clearTimeout(timeoutId);
    }, [droppedTriangleColors, pieceShapes]);






    const handlePieceDrop = (index) => {
        if (highlightedTriangles.length > 0) {
            const pieceColor = shapeColors[pieceShapes[index]]; // Obtém a cor da peça
            const newColors = highlightedTriangles.reduce((acc, triangle) => {
                acc[triangle] = pieceColor;
                return acc;
            }, {});

            // Atualiza as cores dos triângulos dropados e verifica linhas completas imediatamente após isso
            setDroppedTriangleColors((prevColors) => {
                const updatedColors = { ...prevColors, ...newColors };

                // Verifica linhas completas usando o estado atualizado
                checkForCompleteLines(updatedColors);

                return updatedColors;
            });

            // Atualiza a lista de triângulos que foram dropados
            setDroppedTriangles((prev) => [...prev, ...highlightedTriangles]);
            setHighlightedTriangles([]);

            const scoreSound = new Audio("/place_sound.wav")
            scoreSound.play()

            // Adiciona 1 ponto ao score por colocar uma peça
            setScore((prevScore) => prevScore + highlightedTriangles.length / 2);

            // Remove a peça da lista
            setPieceShapes((prevShapes) => {
                const updatedShapes = [...prevShapes];
                updatedShapes[index] = null; // Remove a peça
                return updatedShapes;
            });
            setResetKey((prevKey) => prevKey + 1);

        } else {
            // Se a peça não foi dropada em uma área válida, volta para a posição original
            setResetKey((prevKey) => prevKey + 1);
        }
    };


    // Função para verificar se uma linha, coluna ou diagonal foi completada
    const checkForCompleteLines = (currentColors) => {
        // eslint-disable-next-line no-unused-vars
        let completedLines = 0;

        const rowPointSound = new Audio("/row_point.wav")


        const resetCompletedTriangles = (triangles) => {
            // Marcar os triângulos que serão animados
            setAnimatedPieces((prev) => [...prev, ...triangles]);

            // Aplicar o estado de animação nos triângulos
            setTimeout(() => {
                setDroppedTriangleColors((prevColors) => {
                    const resetColors = { ...prevColors };
                    triangles.forEach((index) => {
                        delete resetColors[index];
                    });
                    return resetColors;
                });

                setDroppedTriangles((prevTriangles) =>
                    prevTriangles.filter((index) => !triangles.includes(index))
                );

                // Remover a classe de animação após o tempo da animação
                setAnimatedPieces((prev) => prev.filter(item => !triangles.includes(item)));
            }, 200);  // Tempo para a animação de escala (em ms)
        };

        // Verifica linhas horizontais
        for (let row = 0; row < rows; row++) {
            const rowIndex = Array.from({ length: triangleCounts[row] }, (_, colIndex) => `${row}-${colIndex}`);

            if (rowIndex.every((index) => currentColors[index])) {

                resetCompletedTriangles(rowIndex);
                setScore((prevScore) => prevScore + 3 * rowIndex.length / 4);
                rowPointSound.play()
            }
        }

        // Verifica diagonais ascendentes (DiagonalsUp)
        DiagonalsUp.forEach((diagonal) => {
            if (diagonal.every((index) => currentColors[index])) {
                completedLines += 1;

                resetCompletedTriangles(diagonal);
                setScore((prevScore) => prevScore + 3 * diagonal.length / 4);
                rowPointSound.play()
            }
        });

        // Verifica diagonais descendentes (DiagonalsDown)
        DiagonalsDown.forEach((diagonal) => {
            if (diagonal.every((index) => currentColors[index])) {
                completedLines += 1;

                resetCompletedTriangles(diagonal);
                setScore((prevScore) => prevScore + 3 * diagonal.length / 4);
                rowPointSound.play()
            }
        });
    };



    const getUniqueIndex = (rowIndex, colIndex) => {
        return `${rowIndex}-${colIndex}`;
    };


    // Gera os triângulos
    const generateTriangles = () => {
        const triangles = [];

        let yOffset = 0; // Deslocamento vertical para cada fileira
        let xOffset = 0; // Deslocamento horizontal

        triangleCounts.forEach((count, rowIndex) => {
            const rowWidth = count * (size / 2); // Largura total da fileira
            const rowCenterOffset = (triangleCounts[4] * size) / 2 - rowWidth / 2; // Centraliza a fileira com base na fileira central

            xOffset = rowCenterOffset;

            for (let colIndex = 0; colIndex < count; colIndex++) {
                const shouldInvert = count === 11 || count === 15;
                const isUp = shouldInvert
                    ? (rowIndex + colIndex) % 2 !== 0 // Inverte o padrão
                    : (rowIndex + colIndex) % 2 === 0; // Padrão original

                const x1 = xOffset + colIndex * (size / 2); // Posição x1 do triângulo
                const x2 = x1 + size; // Posição x2 do triângulo
                const yBase = yOffset; // Posição y da fileira

                const uniqueIndex = getUniqueIndex(rowIndex, colIndex);

                const isHighlighted = highlightedTriangles.includes(uniqueIndex);
                const isDropped = droppedTriangles.includes(uniqueIndex);
                const fillColor = isDropped ? droppedTriangleColors[uniqueIndex] : "";

                const isAnimating = animatedPieces.includes(uniqueIndex);

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
                        className={`
                            triangles 
                            ${isAnimating ? 'scaling' : ''}
                            ${isUp ? "up" : "down"} 
                            ${isHighlighted ? "highlighted" : ""} 
                         
                        `}
                        style={{ fill: fillColor }}
                        data-unique-index={uniqueIndex}
                    // onMouseOver={() => console.log(uniqueIndex)}
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




        const triangleMap = new Map(boardTriangles
            .map(triangle => [triangle.uniqueIndex, triangle]));






        const trianglesToHighlight = shape
            .map(({ x, y, orientation, uniqueIndex }) => {

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
                } else {
                    targetRow = centralRow + y;
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

                    if (
                        targetTriangle &&
                        targetTriangle.isUp === (orientation === "up") &&
                        !droppedTriangles.includes(`${targetRow}-${targetCol}`)
                    ) {
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
        // console.log(trianglesToHighlight);
    };



    useEffect(() => {
        setAnimatedPieces((prev) => {
            // Marque como não animadas apenas as novas peças
            const newIndices = pieceShapes
                .map((_, index) => (!prev.includes(index) ? index : null))
                .filter((index) => index !== null);
            return [...prev, ...newIndices];
        });
    }, [pieceShapes]);
    useEffect(() => {
        if (newPieces.length > 0) {
            const timeout = setTimeout(() => setNewPieces([]), 300); // Limpa após 300ms
            return () => clearTimeout(timeout);
        }
    }, [newPieces]);

    // Atualiza o estado isMobile com base na largura da tela
    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth <= 600);
        };

        window.addEventListener("resize", handleResize);
        return () => {
            window.removeEventListener("resize", handleResize);
        };
    }, []);


    return (
        <>
            <div
                ref={boardRef}
                className="container"
                style={{ height: `${rows * height}px` }}
            >
                <svg
                    className="boardDiv"
                    width={triangleCounts[3] * size + size / 2} // Calcula a largura para incluir a maior fileira e centralizar
                    height={(rows) * height} // Adiciona espaço para as fileiras
                >
                    {generateTriangles()}
                </svg>
            </div>
            <div className="piece_container">
                {pieceShapes.length > 0 && pieceShapes.map((shape, index) => {

                    const positionY = isMobile ? 0 : 90 * index;
                    const positionX = isMobile ? 130 * index : 0;

                    return (
                        <Piece
                            key={`${resetKey}-${index}`}
                            shape={shape}
                            size={size}
                            scaleFactor={1}
                            onDrop={() => handlePieceDrop(index)}
                            onHover={(triangles) => handlePieceHover(triangles)}
                            isNew={newPieces.includes(index)}
                            index={index}
                            positionY={positionY}
                            positionX={positionX}
                        />
                    );
                })}
            </div>
            <div className="scoreboard">
                <h3>Score:</h3>
                <p>{score}</p>
            </div>
        </>
    );
};

export default Board;
