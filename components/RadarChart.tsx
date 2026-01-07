import React from 'react';

interface RadarChartProps {
    data: { axis: string; value: number }[];
    size?: number;
}

export const RadarChart: React.FC<RadarChartProps> = ({ data, size = 300 }) => {
    const total = data.length;
    const radius = size / 2.5;
    const center = size / 2;

    const points = data.map((item, i) => {
        const angle = (i / total) * 2 * Math.PI - Math.PI / 2;
        const valueRadius = (item.value / 100) * radius;
        const x = center + valueRadius * Math.cos(angle);
        const y = center + valueRadius * Math.sin(angle);
        return `${x},${y}`;
    }).join(' ');

    const axisPoints = Array.from({ length: total }, (_, i) => {
        const angle = (i / total) * 2 * Math.PI - Math.PI / 2;
        const x = center + radius * Math.cos(angle);
        const y = center + radius * Math.sin(angle);
        return { x, y };
    });

    const levelPolygons = [0.25, 0.5, 0.75, 1].map(level => {
        return Array.from({ length: total }, (_, i) => {
            const angle = (i / total) * 2 * Math.PI - Math.PI / 2;
            const x = center + level * radius * Math.cos(angle);
            const y = center + level * radius * Math.sin(angle);
            return `${x},${y}`;
        }).join(' ');
    });

    const labels = data.map((item, i) => {
        const angle = (i / total) * 2 * Math.PI - Math.PI / 2;
        const labelRadius = radius * 1.2;
        const x = center + labelRadius * Math.cos(angle);
        const y = center + labelRadius * Math.sin(angle);
        
        // FIX: Explicitly typed `textAnchor` to satisfy the SVG prop's type.
        let textAnchor: "middle" | "start" | "end" = "middle";
        if (x > center + 5) textAnchor = "start";
        if (x < center - 5) textAnchor = "end";

        return (
            <text
                key={i}
                x={x}
                y={y}
                dy="0.35em"
                textAnchor={textAnchor}
                fill="#c4b5fd"
                fontSize="12"
                fontWeight="bold"
            >
                {item.axis}
            </text>
        );
    });

    return (
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
            <g>
                {/* Background grid polygons */}
                {levelPolygons.reverse().map((poly, i) => (
                    <polygon
                        key={i}
                        points={poly}
                        fill={i % 2 === 0 ? "rgba(124, 58, 237, 0.05)" : "rgba(124, 58, 237, 0.1)"}
                        stroke="rgba(124, 58, 237, 0.2)"
                        strokeWidth="1"
                    />
                ))}
                
                {/* Axis lines */}
                {axisPoints.map((point, i) => (
                    <line
                        key={i}
                        x1={center}
                        y1={center}
                        x2={point.x}
                        y2={point.y}
                        stroke="rgba(124, 58, 237, 0.2)"
                        strokeWidth="1"
                    />
                ))}
                
                {/* Data polygon */}
                <polygon
                    points={points}
                    fill="rgba(167, 139, 250, 0.4)"
                    stroke="#a78bfa"
                    strokeWidth="2"
                />

                {/* Data points */}
                {points.split(' ').map((p, i) => {
                    const [x, y] = p.split(',');
                    return (
                        <circle key={i} cx={x} cy={y} r="4" fill="#a78bfa" />
                    )
                })}

                {/* Labels */}
                {labels}
            </g>
        </svg>
    );
};