/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useRef, useEffect } from "react";
import styles from './Piece.module.css';
import { motion } from "framer-motion";

const Piece = ({
  shape,
  size,
  scaleFactor = 1,
  onHover,
  onDrop,
  index,
  isNew,
  pieceIndex,
  positionY,
  positionX,
}) => {
  const [position, setPosition] = useState({ x: 0, y: 0 }); // Posição da peça
  const [isDragging, setIsDragging] = useState(false); // Estado de arrasto
  const [draggingStates, setDraggingStates] = useState([]);


  const pieceRef = useRef(null);

  // Validando o tamanho
  const validSize = typeof size === "number" && !isNaN(size) ? size : 50;
  const scaledSize = validSize * scaleFactor;

  const height = (Math.sqrt(3) / 2) * scaledSize;

  // Definição das formas
  const shapesSVG = {
    triangle1: (
      <g className={styles.triangle1}>
        <path
          d={`M0,0 L${scaledSize},0 L${scaledSize / 2},${height} Z`}
          fill="#ff9999"
          stroke="#222"
          strokeWidth="1"
        />
        <path
          d={`M${scaledSize},0 L${scaledSize * 1.5},${height} L${scaledSize / 2},${height} Z`}
          fill="#ff9999"
          stroke="#222"
          strokeWidth="1"
        />
        <path
          d={`M${scaledSize * 1.5},${height} L${scaledSize},${height * 2} L${scaledSize / 2},${height} Z`}
          fill="#ff9999"
          stroke="#222"
          strokeWidth="1"
        />
        <path
          d={`M${scaledSize * 2},0 L${scaledSize},0 L${scaledSize * 1.5},${height} Z`}
          fill="#ff9999"
          stroke="#222"
          strokeWidth="1"
        />

      </g>
    ),
    triangle2: (
      <g className={styles.hexagono}>
        <path
          d={`M0,${height * 2} L${scaledSize},${height * 2} L${scaledSize / 2},${height} Z`}
          fill="#ffcc99"
          stroke="#222"
          strokeWidth="1"
        />
        <path
          d={`M${scaledSize},${height * 2} L${scaledSize * 1.5},${height} L${scaledSize / 2},${height} Z`}
          fill="#ffcc99"
          stroke="#222"
          strokeWidth="1"
        />
        <path
          d={`M${scaledSize * 1.5},${height} L${scaledSize},0 L${scaledSize / 2},${height} Z`}
          fill="#ffcc99"
          stroke="#222"
          strokeWidth="1"
        />
        <path
          d={`M${scaledSize * 2},${height * 2} L${scaledSize},${height * 2} L${scaledSize * 1.5},${height} Z`}
          fill="#ffcc99"
          stroke="#222"
          strokeWidth="1"
        />
      </g>
    ),

    unique1: (
      <g className={styles.unique1}>
        <path
          d={`M${scaledSize},0 L${scaledSize * 1.5},${height} L${scaledSize / 2},${height} Z`}
          fill="#9eb38b"
          stroke="#222"
          strokeWidth="1"
        />

      </g>
    ),
    unique2: (
      <g className={styles.unique2}>
        <path
          d={`M${scaledSize},0 L${scaledSize * 2},0 L${scaledSize * 1.5},${height} Z`}
          fill="#ffee99"
          stroke="#222"
          strokeWidth="1"
        />
      </g>
    ),

    trapezoid1: (
      <g className={styles.paralelogramo2}
        transform={`scale(-1, 1) translate(-${scaledSize * 1.5 + 15}, 0)`}>
        <path
          d={`M0,0 L${scaledSize},0 L${scaledSize / 2},${height} Z`}
          fill="#59658e"
          stroke="#222"
          strokeWidth="1"
        />
        <path
          d={`M${scaledSize},0 L${scaledSize * 1.5},${height} L${scaledSize / 2},${height} Z`}
          fill="#59658e"
          stroke="#222"
          strokeWidth="1"
        />
        <path
          d={`M${scaledSize},0 L${scaledSize * 2},0 L${scaledSize * 1.5},${height} Z`}
          fill="#59658e"
          stroke="#222"
          strokeWidth="1"
        />
      </g>
    ),
    trapezoid2: (
      <g className={styles.trapezoid2}
        transform={`scale(-1, 1) translate(-${scaledSize * 1.5 + 15}, 0)`}>
        <path
          d={`M${scaledSize},0 L${scaledSize * 1.5},${height} L${scaledSize / 2},${height} Z`}
          fill="#9fdedb"
          stroke="#222"
          strokeWidth="1"
        />
        <path
          d={`M${scaledSize},0 L${scaledSize * 2},0 L${scaledSize * 1.5},${height} Z`}
          fill="#9fdedb"
          stroke="#222"
          strokeWidth="1"
        />
        <path
          d={`M${scaledSize * 1.5},${height} L${scaledSize * 2},0 L${scaledSize * 2.5},${height} Z`}
          fill="#9fdedb"
          stroke="#222"
          strokeWidth="1"
        />
      </g>
    ),
    trapezoid1_vertical_a: (
      <g className={styles.trapezoid1_vertical_a}>
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
      </g>
    ),
    trapezoid2_vertical_a: (
      <g
        className={styles.trapezoid2_vertical}
        transform={`scale(-1, 1) translate(-${scaledSize * 2.5}, 0)`}
      >
        <path
          d={`M${scaledSize / 1},0 L${scaledSize * 2},0 L${scaledSize * 1.5},${height} Z`}
          fill="#9fdedb"
          stroke="#222"
          strokeWidth="1"
        />
        <path
          d={`M${scaledSize},0 L${scaledSize * 1.5},${height} L${scaledSize / 2},${height} Z`}
          fill="#9fdedb"
          stroke="#222"
          strokeWidth="1"
        />
        <path
          d={`M${scaledSize * 1.5},${height} L${scaledSize},${height * 2} L${scaledSize / 2},${height} Z`}
          fill="#9fdedb"
          stroke="#222"
          strokeWidth="1"
        />

      </g>
    ),
    trapezoid1_vertical_b: (
      <g className={styles.trapezoid1_vertical_b}>
        <path
          d={`M${scaledSize / 1},0 L${scaledSize * 2},0 L${scaledSize * 1.5},${height} Z`}
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
      </g>
    ),
    trapezoid2_vertical_b: (
      <g
        className={styles.trapezoid2_vertical_b}
        transform={`scale(-1, 1) translate(-${scaledSize * 1.8}, -20)`}
      >
        <path
          d={`M${scaledSize},0 L${scaledSize * 1.5},${height} L${scaledSize / 2},${height} Z`}
          fill="#9fdedb"
          stroke="#222"
          strokeWidth="1"
        />
        <path
          d={`M${scaledSize * 1.5},${height} L${scaledSize},${height * 2} L${scaledSize / 2},${height} Z`}
          fill="#9fdedb"
          stroke="#222"
          strokeWidth="1"
        />
        <path
          d={`M0,${height * 2} L${scaledSize / 2},${height} L${scaledSize},${height * 2} Z`}
          fill="#9fdedb"
          stroke="#222"
          strokeWidth="1"
        />

      </g>
    ),

    lozenge1: (
      <g className={styles.lozango1}>
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
    lozenge2: (
      <g className={styles.lozango2}
        transform={`scale(-1, 1) translate(-${scaledSize * 1.5}, 0)`}>
        <path
          d={`M0,0 L${scaledSize},0 L${scaledSize / 2},${height} Z`}
          fill="#aba356"
          stroke="#222"
          strokeWidth="1"
        />
        <path
          d={`M${scaledSize},0 L${scaledSize * 1.5},${height} L${scaledSize / 2},${height} Z`}
          fill="#aba356"
          stroke="#222"
          strokeWidth="1"
        />
      </g>
    ),
    lozenge3: (
      <g className={styles.lozango3}>
        <path
          d={`M0,${height * 2} L${-scaledSize / 2},${height} L${scaledSize / 2},${height} Z`}
          fill="#658f4f"
          stroke="#222"
          strokeWidth="1"
        />
        <path
          d={`M0,0 L${-scaledSize / 2},${height} L${scaledSize / 2},${height} Z`}
          fill="#658f4f"
          stroke="#222"
          strokeWidth="1"
        />
      </g>
    ),

    parallelogram1: (
      <g className={styles.paralelogramo1}>
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
    parallelogram2: (
      <g className={styles.paralelogramo2}
        transform={`scale(-1, 1) translate(-${scaledSize * 1.5 + 15}, 0)`}>
        <path
          d={`M0,0 L${scaledSize},0 L${scaledSize / 2},${height} Z`}
          fill="#59658e"
          stroke="#222"
          strokeWidth="1"
        />
        <path
          d={`M${scaledSize},0 L${scaledSize * 1.5},${height} L${scaledSize / 2},${height} Z`}
          fill="#59658e"
          stroke="#222"
          strokeWidth="1"
        />
        <path
          d={`M${scaledSize},0 L${scaledSize * 2},0 L${scaledSize * 1.5},${height} Z`}
          fill="#59658e"
          stroke="#222"
          strokeWidth="1"
        />
        <path
          d={`M${scaledSize * 1.5},${height} L${scaledSize * 2},0 L${scaledSize * 2.5},${height} Z`}
          fill="#59658e"
          stroke="#222"
          strokeWidth="1"
        />
      </g>
    ),
    parallelogram1_vertical_a: (
      <g className={styles.parallelogram1_vertical_a}>
        <path
          d={`M${scaledSize / 1},0 L${scaledSize * 2},0 L${scaledSize * 1.5},${height} Z`}
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
      </g>
    ),
    parallelogram2_vertical_a: (
      <g
        className={styles.paralelogramoVerticalFlipped}
        transform={`scale(-1, 1) translate(-${scaledSize * 2.5}, 0)`} // Espelha horizontalmente
      >
        <path
          d={`M${scaledSize / 1},0 L${scaledSize * 2},0 L${scaledSize * 1.5},${height} Z`}
          fill="#59658e"
          stroke="#222"
          strokeWidth="1"
        />
        <path
          d={`M${scaledSize},0 L${scaledSize * 1.5},${height} L${scaledSize / 2},${height} Z`}
          fill="#59658e"
          stroke="#222"
          strokeWidth="1"
        />
        <path
          d={`M${scaledSize * 1.5},${height} L${scaledSize},${height * 2} L${scaledSize / 2},${height} Z`}
          fill="#59658e"
          stroke="#222"
          strokeWidth="1"
        />
        <path
          d={`M0,${height * 2} L${scaledSize / 2},${height} L${scaledSize},${height * 2} Z`}
          fill="#59658e"
          stroke="#222"
          strokeWidth="1"
        />
      </g>
    ),
    parallelogram1_vertical_b: (
      <g className={styles.paralelogramoVertical}>
        <path
          d={`M${scaledSize * 2},0 L${scaledSize * 1.5},${-height} L${scaledSize},0 Z`}
          fill="#98b68a"
          stroke="#222"
          strokeWidth="1"
        />
        <path
          d={`M${scaledSize / 1},0 L${scaledSize * 2},0 L${scaledSize * 1.5},${height} Z`}
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
      </g>
    ),
    parallelogram2_vertical_b: (
      <g className={styles.paralelogramoVertical}
      transform={`scale(-1, 1) translate(-${scaledSize * 2.0}, -10)`}>
        
        <path
          d={`M${scaledSize * 2},0 L${scaledSize * 1.5},${-height} L${scaledSize},0 Z`}
          fill="#59658e"
          stroke="#222"
          strokeWidth="1"
        />
        <path
          d={`M${scaledSize / 1},0 L${scaledSize * 2},0 L${scaledSize * 1.5},${height} Z`}
          fill="#59658e"
          stroke="#222"
          strokeWidth="1"
        />
        <path
          d={`M${scaledSize},0 L${scaledSize * 1.5},${height} L${scaledSize / 2},${height} Z`}
          fill="#59658e"
          stroke="#222"
          strokeWidth="1"
        />
        <path
          d={`M${scaledSize * 1.5},${height} L${scaledSize},${height * 2} L${scaledSize / 2},${height} Z`}
          fill="#59658e"
          stroke="#222"
          strokeWidth="1"
        />
      </g>
    ),

    hexagon: (
      <g className={styles.hexagono}>
        <path
          d={`M0,0 L${scaledSize},0 L${scaledSize / 2},${height} Z`}
          fill="#9fdedb"
          stroke="#222"
          strokeWidth="1"
        />
        <path
          d={`M${scaledSize},0 L${scaledSize * 1.5},${height} L${scaledSize / 2},${height} Z`}
          fill="#9fdedb"
          stroke="#222"
          strokeWidth="1"
        />
        <path
          d={`M${scaledSize * 1.5},${height} L${scaledSize},${height * 2} L${scaledSize / 2},${height} Z`}
          fill="#9fdedb"
          stroke="#222"
          strokeWidth="1"
        />
        <path
          d={`M0,${height * 2} L${scaledSize / 2},${height} L${scaledSize},${height * 2} Z`}
          fill="#9fdedb"
          stroke="#222"
          strokeWidth="1"
        />
        <path
          d={`M0,${height * 2} L${-scaledSize / 2},${height} L${scaledSize / 2},${height} Z`}
          fill="#9fdedb"
          stroke="#222"
          strokeWidth="1"
        />
        <path
          d={`M0,0 L${-scaledSize / 2},${height} L${scaledSize / 2},${height} Z`}
          fill="#9fdedb"
          stroke="#222"
          strokeWidth="1"
        />
      </g>
    ),

    semiHexagon1: (
      <g className={styles.hexagono}>
        <path
          d={`M${scaledSize * 1.5},${height} L${scaledSize},${height * 2} L${scaledSize / 2},${height} Z`}
          fill="#b269b9"
          stroke="#222"
          strokeWidth="1"
        />
        <path
          d={`M0,${height * 2} L${scaledSize / 2},${height} L${scaledSize},${height * 2} Z`}
          fill="#b269b9"
          stroke="#222"
          strokeWidth="1"
        />
        <path
          d={`M0,${height * 2} L${-scaledSize / 2},${height} L${scaledSize / 2},${height} Z`}
          fill="#b269b9"
          stroke="#222"
          strokeWidth="1"
        />
        <path
          d={`M0,0 L${-scaledSize / 2},${height} L${scaledSize / 2},${height} Z`}
          fill="#b269b9"
          stroke="#222"
          strokeWidth="1"
        />
      </g>
    ),
    semiHexagon2: (
      <g className={styles.hexagono}>
        <path
          d={`M0,0 L${scaledSize},0 L${scaledSize / 2},${height} Z`}
          fill="#a17cba"
          stroke="#222"
          strokeWidth="1"
        />
        <path
          d={`M${scaledSize},0 L${scaledSize * 1.5},${height} L${scaledSize / 2},${height} Z`}
          fill="#a17cba"
          stroke="#222"
          strokeWidth="1"
        />
        <path
          d={`M${scaledSize * 1.5},${height} L${scaledSize},${height * 2} L${scaledSize / 2},${height} Z`}
          fill="#a17cba"
          stroke="#222"
          strokeWidth="1"
        />
        <path
          d={`M0,${height * 2} L${scaledSize / 2},${height} L${scaledSize},${height * 2} Z`}
          fill="#a17cba"
          stroke="#222"
          strokeWidth="1"
        />
      </g>
    ),
    semiHexagon3: (
      <g className={styles.hexagono}>
        <path
          d={`M0,0 L${scaledSize},0 L${scaledSize / 2},${height} Z`}
          fill="#f3b9da"
          stroke="#222"
          strokeWidth="1"
        />
        <path
          d={`M${scaledSize},0 L${scaledSize * 1.5},${height} L${scaledSize / 2},${height} Z`}
          fill="#f3b9da"
          stroke="#222"
          strokeWidth="1"
        />
        <path
          d={`M0,${height * 2} L${-scaledSize / 2},${height} L${scaledSize / 2},${height} Z`}
          fill="#f3b9da"
          stroke="#222"
          strokeWidth="1"
        />
        <path
          d={`M0,0 L${-scaledSize / 2},${height} L${scaledSize / 2},${height} Z`}
          fill="#f3b9da"
          stroke="#222"
          strokeWidth="1"
        />
      </g>
    ),
    semiHexagon4: (
      <g className={styles.hexagono}>
        <path
          d={`M${scaledSize},0 L${scaledSize * 1.5},${height} L${scaledSize / 2},${height} Z`}
          fill="#d5e6a7"
          stroke="#222"
          strokeWidth="1"
        />
        <path
          d={`M${scaledSize * 1.5},${height} L${scaledSize},${height * 2} L${scaledSize / 2},${height} Z`}
          fill="#d5e6a7"
          stroke="#222"
          strokeWidth="1"
        />
        <path
          d={`M0,${height * 2} L${scaledSize / 2},${height} L${scaledSize},${height * 2} Z`}
          fill="#d5e6a7"
          stroke="#222"
          strokeWidth="1"
        />
        <path
          d={`M0,${height * 2} L${-scaledSize / 2},${height} L${scaledSize / 2},${height} Z`}
          fill="#d5e6a7"
          stroke="#222"
          strokeWidth="1"
        />
      </g>
    ),
    semiHexagon5: (
      <g className={styles.hexagono}>
        <path
          d={`M0,0 L${scaledSize},0 L${scaledSize / 2},${height} Z`}
          fill="#54cdc3"
          stroke="#222"
          strokeWidth="1"
        />

        <path
          d={`M0,${height * 2} L${scaledSize / 2},${height} L${scaledSize},${height * 2} Z`}
          fill="#54cdc3"
          stroke="#222"
          strokeWidth="1"
        />
        <path
          d={`M0,${height * 2} L${-scaledSize / 2},${height} L${scaledSize / 2},${height} Z`}
          fill="#54cdc3"
          stroke="#222"
          strokeWidth="1"
        />
        <path
          d={`M0,0 L${-scaledSize / 2},${height} L${scaledSize / 2},${height} Z`}
          fill="#54cdc3"
          stroke="#222"
          strokeWidth="1"
        />
      </g>
    ),
  };

  const shapes = {
    triangle1: [
      { x: 0, y: 0, orientation: "down" },
      { x: -1, y: 0, orientation: "up" },
      { x: -1, y: 1, orientation: "down" },
      { x: -2, y: 0, orientation: "down" },
    ],
    triangle2: [

      { x: -1, y: 0, orientation: "up" },
      { x: -1, y: 1, orientation: "down" },
      { x: -2, y: 1, orientation: "up" },
      { x: 0, y: 1, orientation: "up" },

    ],
    unique1: [
      { x: 0, y: 0, orientation: "up" },
    ],
    unique2: [
      { x: 0, y: 0, orientation: "down" },
    ],
    trapezoid1: [
      { x: -1, y: 0, orientation: "down" },
      { x: 0, y: 0, orientation: "up" },
      { x: 1, y: 0, orientation: "down" },

    ],
    trapezoid2: [

      { x: 0, y: 0, orientation: "up" },
      { x: 1, y: 0, orientation: "down" },
      { x: 2, y: 0, orientation: "up" },
    ],
    trapezoid1_vertical_a: [
      { x: -1, y: 0, orientation: "up" },
      { x: -1, y: 1, orientation: "down" },
      { x: -2, y: 1, orientation: "up" },
    ],
    trapezoid2_vertical_a: [
      { x: -2, y: 0, orientation: "down" },
      { x: -1, y: 0, orientation: "up" },
      { x: -1, y: 1, orientation: "down" },
    ],
    trapezoid1_vertical_b: [
      { x: -1, y: 0, orientation: "down" },
      { x: -2, y: 0, orientation: "up" },
      { x: -2, y: 1, orientation: "down" },
    ],
    trapezoid2_vertical_b: [
      { x: -1, y: 0, orientation: "up" },
      { x: -1, y: 1, orientation: "down" },
      { x: 0, y: 1, orientation: "up" },
    ],
    parallelogram1: [
      { x: -1, y: 0, orientation: "down" },
      { x: 0, y: 0, orientation: "up" },
      { x: 1, y: 0, orientation: "down" },
      { x: 2, y: 0, orientation: "up" },
    ],
    parallelogram2: [
      { x: 1, y: 0, orientation: "down" },
      { x: -0, y: 0, orientation: "up" },
      { x: -1, y: 0, orientation: "down" },
      { x: -2, y: 0, orientation: "up" },
    ],
    parallelogram1_vertical_a: [
      { x: 0, y: 0, orientation: "down" },
      { x: -1, y: 0, orientation: "up" },
      { x: -1, y: 1, orientation: "down" },
      { x: -2, y: 1, orientation: "up" },
    ],
    parallelogram2_vertical_a: [
      { x: -2, y: 0, orientation: "down" },
      { x: -1, y: 0, orientation: "up" },
      { x: -1, y: 1, orientation: "down" },
      { x: 0, y: 1, orientation: "up" },
    ],
    parallelogram1_vertical_b: [
      { x: -2, y: 0, orientation: "up" },
      { x: -1, y: 0, orientation: "down" },
      { x: -1, y: -1, orientation: "up" },
      { x: -2, y: 1, orientation: "down" },
    ],
    parallelogram2_vertical_b: [
      { x: -2, y: -1, orientation: "up" },
      { x: -2, y: 0, orientation: "down" },
      { x: -1, y: 0, orientation: "up" },
      { x: -1, y: 1, orientation: "down" },
    ],
    lozenge1: [
      { x: 0, y: 0, orientation: "down" },
      { x: 1, y: 0, orientation: "up" },
    ],
    lozenge2: [
      { x: 1, y: 0, orientation: "down" },
      { x: 0, y: 0, orientation: "up" },
    ],
    lozenge3: [
      { x: -1, y: 0, orientation: "up" },
      { x: -1, y: 1, orientation: "down" },
    ],
    hexagon: [
      { x: -1, y: 0, orientation: "up" },
      { x: -2, y: 0, orientation: "down" },
      { x: -3, y: 0, orientation: "up" },
      { x: -1, y: 1, orientation: "down" },
      { x: -2, y: 1, orientation: "up" },
      { x: -3, y: 1, orientation: "down" },
    ],
    semiHexagon1: [
      { x: -3, y: 0, orientation: "up" },
      { x: -1, y: 1, orientation: "down" },
      { x: -2, y: 1, orientation: "up" },
      { x: -3, y: 1, orientation: "down" },
    ],
    semiHexagon2: [
      { x: -1, y: 0, orientation: "up" },
      { x: -2, y: 0, orientation: "down" },
      { x: -1, y: 1, orientation: "down" },
      { x: -2, y: 1, orientation: "up" },

    ],
    semiHexagon3: [
      { x: -1, y: 0, orientation: "up" },
      { x: -2, y: 0, orientation: "down" },
      { x: -3, y: 0, orientation: "up" },
      { x: -3, y: 1, orientation: "down" },
    ],
    semiHexagon4: [
      { x: -1, y: 0, orientation: "up" },


      { x: -1, y: 1, orientation: "down" },
      { x: -2, y: 1, orientation: "up" },
      { x: -3, y: 1, orientation: "down" },
    ],
    semiHexagon5: [
      { x: -2, y: 0, orientation: "down" },
      { x: -3, y: 0, orientation: "up" },
      { x: -2, y: 1, orientation: "up" },
      { x: -3, y: 1, orientation: "down" },
    ],
  };

  const handleMouseDown = (event) => {
    setIsDragging(true);
    pieceRef.current.dragStartX = event.clientX - position.x;
    pieceRef.current.dragStartY = event.clientY - position.y;
  };

  const handleMouseMove = (event) => {
    if (!isDragging) return;

    const newX = event.clientX - pieceRef.current.dragStartX;
    const newY = event.clientY - pieceRef.current.dragStartY;

    setPosition({ x: newX, y: newY });

    const { top, left, width, height } = pieceRef.current.getBoundingClientRect();

    // Obtemos a transformação do elemento pai, se houver
    const groupElement = pieceRef.current.parentElement;
    const transform = window.getComputedStyle(groupElement).transform;

    let centerX, centerY;

    const hasYOne = shapes[shape].some((point) => point.y === 1);

    if (hasYOne) {
      const matrix = new DOMMatrix(transform); // Cria a matriz de transformação
      centerX = left + width / 2 + 45 + matrix.e;  // Ajusta o centro considerando a transformação
      centerY = top + height / 2 - 15 + matrix.f;
    } else {
      // Caso não tenha transformação, usamos as coordenadas do bounding rect
      const matrix = new DOMMatrix(transform); // Cria a matriz de transformação
      centerX = left + width / 2 + matrix.e;
      centerY = top + height / 2 + matrix.f;
    }

    // Aplique aqui qualquer ajuste extra para corrigir o deslocamento
    // Por exemplo, você pode tentar uma compensação de pixels manual para corrigir

    onHover({
      center: { x: centerX, y: centerY },
      shape: shapes[shape],
    });
  };



  const handleMouseUp = () => {
    setIsDragging(false);

    if (onDrop) {
      onDrop(index);
    } else {
      setPosition({ x: 0, y: 0 });
    }
  };

  const handleDragStart = (index) => {
    setDraggingStates((prev) => {
      const updated = [...prev];
      updated[index] = true; // Define como arrastando
      return updated;
    });
  };

  const handleDragEnd = (index) => {
    setDraggingStates((prev) => {
      const updated = [...prev];
      updated[index] = false; // Define como não arrastando
      return updated;
    });
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
    <motion.div

      dragMomentum={false}


      initial={isNew ? { scale: 0.5 } : false}
      animate={{
        scale: isDragging ? 1 : 0.8,
        opacity: isDragging ? 0.7 : 1,
      }}
      whileDrag={{
        scale: 0.8,
        opacity: 0.7,
      }}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onMouseUp={handleMouseUp}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className="svg-container"
      ref={pieceRef}
      style={{
        position: "absolute",
        top: position.y + positionY,
        left: position.x + positionX,
        cursor: isDragging ? "grabbing" : "grab",
      }}
      onMouseDown={handleMouseDown}
    >
      <svg
        className="svg"
        onMouseUp={handleMouseUp}
        viewBox={`${-scaledSize / 2} ${-height / 2} ${scaledSize * 2.5} ${height * 2}`}
        style={{
          width: scaledSize * 2.5,
        }}
      >
        {shapesSVG[shape]}
      </svg>
    </motion.div>
  );
};

export default Piece;
