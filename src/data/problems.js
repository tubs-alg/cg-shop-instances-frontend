const Problems = {
    MaximumPolygonPacking: {
        name: "Maximum Polygon Packing",
        endpoint: "max_poly_packing/",
        id: "mpp",
        minimization: false,
        visualizationComponent: "MaximumPolygonPackingVisualization",
        labels: {
            "num_items": "items",
        },
        instanceCardAttributes: ["num_items"],
    },
    MinimumConvexPartition: {
        name: "Minimum Convex Partition",
        endpoint: "min_conv_partition/",
        id: "mcp",
        minimization: true,
        visualizationComponent: "MinimumConvexPartitionVisualization",
        labels: {
            "num_points": "points",
            "num_triangs": "triangles",
        },
        instanceCardAttributes: ["num_points", "num_triangs"]
    },
    MinimumPlaneSubgraphPartition: {
        name: "Minimum Partition into Plane Subgraphs",
        endpoint: "min_plane_subgraph_partition/",
        id: "mpsp",
        visualizationComponent: "MinimumSubgraphPartitionVisualization",
        minimization: true,
        labels: {
            "num_points": "points",
            "num_edges": "edges",
        },
        instanceCardAttributes: ["num_points", "num_edges"]
    },
    MinimumConvexPolygonCoverage: {
        name: "Minimum Convex Polygon Coverage",
        endpoint: "min_conv_poly_coverage/",
        id: "mcpc",
        minimization: true,
        labels: {
            "num_points": "points",
            "num_holes": "holes",
        },
        instanceCardAttributes: ["num_points", "num_holes"]
    }
}
export default Problems;