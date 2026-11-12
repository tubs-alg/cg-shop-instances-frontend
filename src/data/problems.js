import mppImg from "@/assets/problems/mpp.png";
import mcpImg from "@/assets/problems/mcp.png";
import mapfImg from "@/assets/problems/mapf.png";
import mcpcImg from "@/assets/problems/mcpc.png";
import mpspImg from "@/assets/problems/mpsp.png";
import nonobtTriangImg from "@/assets/problems/nonobt_triang.png";

/*
 * Single source of truth for all problems of the collection.
 * `year` is the year of the CG:SHOP challenge the problem was posed in.
 */
const Problems = {
    MaximumPolygonPacking: {
        name: "Maximum Polygon Packing",
        endpoint: "max_poly_packing/",
        id: "mpp",
        year: 2024,
        image: mppImg,
        description: "Pack a maximum-value subset of polygons into a given container.",
        visualizationComponent: "MaximumPolygonPackingVisualization",
        labels: {
            "num_items": "items",
        },
        objectives: [
            {
                key: "value",
                minimization: false,
            }
        ],
        instanceCardAttributes: ["num_items"],
    },
    MinimumConvexPartition: {
        name: "Minimum Convex Partition",
        endpoint: "min_conv_partition/",
        id: "mcp",
        year: 2020,
        image: mcpImg,
        description: "Partition the convex hull of a point set into the smallest number of convex faces.",
        visualizationComponent: "MinimumConvexPartitionVisualization",
        labels: {
            "num_points": "points",
            "num_triangs": "triangles",
        },
        objectives: [
            {
                key: "value",
                minimization: true
            }
        ],
        instanceCardAttributes: ["num_points", "num_triangs"]
    },
    MinimumPlaneSubgraphPartition: {
        name: "Minimum Partition into Plane Subgraphs",
        endpoint: "min_plane_subgraph_partition/",
        id: "mpsp",
        year: 2022,
        image: mpspImg,
        description: "Partition the edges of a geometric graph into a minimum number of plane subgraphs.",
        visualizationComponent: "MinimumSubgraphPartitionVisualization",
        labels: {
            "num_points": "points",
            "num_edges": "edges",
        },
        objectives: [
            {
                key: "objective",
                minimization: true
            }
        ],
        instanceCardAttributes: ["num_points", "num_edges"]
    },
    MinimumConvexPolygonCoverage: {
        name: "Minimum Coverage by Convex Polygons",
        endpoint: "min_conv_poly_coverage/",
        id: "mcpc",
        year: 2023,
        image: mcpcImg,
        description: "Cover a polygon with holes by a minimum number of convex polygons.",
        visualizationComponent: "MinimumCoverageByConvexPolygonsVisualization",
        labels: {
            "num_points": "points",
            "num_holes": "holes",
        },
        objectives: [
            {
                key: "objective",
                minimization: true
            }
        ],
        instanceCardAttributes: ["num_points", "num_holes"]
    },
    MultiAgentPathFinding: {
        name: "Multi Agent Path Finding",
        endpoint: "min_makespan_mapf/",
        id: "mapf",
        year: 2021,
        image: mapfImg,
        description: "Compute collision-free trajectories that move a set of robots to their targets.",
        visualizationComponent: "MultiAgentPathFindingVisualization",
        labels: {
            "num_agents": "agents",
            "num_obstacles": "obstacles",
        },
        objectives: [
            {
                key: "makespan",
                minimization: true,
            },
            {
                key: "energy",
                minimization: true
            }
        ],
        instanceCardAttributes: []
    },
    NonObtuseTriangulations: {
        name: "Minimum Non-Obtuse Triangulation",
        endpoint: "min_nonobt_triang/",
        id: "nonobt_triang",
        year: 2025,
        image: nonobtTriangImg,
        description: "Find a non-obtuse triangulation using a minimum number of Steiner points.",
        visualizationComponent: "MinimumNonObtuseTriangulationVisualization",
        labels: {
            "num_points": "points",
            "num_constraints": "constraints",
        },
        objectives: [
            {
                key: "num_steiner_points",
                minimization: true,
            }
        ],
        instanceCardAttributes: ["num_points", "num_constraints"]
    },
}

/** All problems, most recent challenge first. */
export const problemList = Object.values(Problems).sort((a, b) => b.year - a.year);

export function findProblem(id) {
    return problemList.find((p) => p.id === id);
}

export default Problems;
