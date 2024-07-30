const Problems = {
    MaximumPolygonPacking: {
        name: "Maximum Polygon Packing",
        endpoint: "max_poly_packing/",
        id: "mpp",
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
        name: "Minimum Non-Obtuse Triangulations\n",
        endpoint: "min_nonobt_triang/",
        id: "nonobt_triang",
        visualizationComponent: "MinimumNonObtuseTriangulationVisualization",
        labels: {
            "num_points": "points",
            "num_constraints": "constraints",
        },
        objectives: [
            {
                key: "makespan",
                minimization: true,
            }
        ],
        instanceCardAttributes: []
    },
}
export default Problems;