// Handles all D3.js visualization logic

const ThoughtMazeViz = (function() {
    // Private variables
    let svgData = null;
    
    // Initialize the visualization
    function init() {
        const svg = d3.select('#maze-svg');
        svg.selectAll("*").remove();
        
        // Calculate center point based on SVG dimensions
        const svgElement = document.getElementById('maze-svg');
        const svgWidth = svgElement.clientWidth;
        const svgHeight = svgElement.clientHeight;
        
        const centerX = svgWidth / 2;
        const centerY = svgHeight / 2;
        
        // Create initial node
        svg.append("circle")
            .attr("cx", centerX)
            .attr("cy", centerY)
            .attr("r", 20)
            .attr("fill", "#4a90e2");

        svg.append("text")
            .attr("x", centerX)
            .attr("y", centerY)
            .attr("text-anchor", "middle")
            .attr("dy", ".35em")
            .attr("fill", "white")
            .attr("font-size", "14px")
            .text("התחלה");
            
        // Store the center coordinates for future reference
        svgData = { centerX, centerY, width: svgWidth, height: svgHeight };
        svg.datum(svgData);
        
        return svgData;
    }

    // Update visualization with new node
    function update(pathLength) {
        if (pathLength <= 1) return; // No visualization needed for just the starting point
        
        const svg = d3.select('#maze-svg');
        const { centerX, centerY, width, height } = svgData;
        
        // Calculate scaling factors based on screen size
        const scaleFactor = Math.min(width, height) / 500;
        const nodeRadius = 20 * scaleFactor;
        const nodeSpacing = Math.min(60 * scaleFactor, width / 8);
        
        // Use a circular or spiral layout that works on smaller screens
        const angle = (pathLength - 1) * 0.7;
        const newX = centerX + ((pathLength - 1) * nodeSpacing * Math.cos(angle));
        const newY = centerY + ((pathLength - 1) * nodeSpacing * Math.sin(angle));
        
        // Add a line from the previous node to this one
        const prevX = pathLength > 2 
            ? centerX + ((pathLength - 2) * nodeSpacing * Math.cos((pathLength - 2) * 0.7))
            : centerX;
        const prevY = pathLength > 2 
            ? centerY + ((pathLength - 2) * nodeSpacing * Math.sin((pathLength - 2) * 0.7))
            : centerY;
        
        svg.append("line")
            .attr("x1", prevX)
            .attr("y1", prevY)
            .attr("x2", newX)
            .attr("y2", newY)
            .attr("stroke", "#6b7a8f")
            .attr("stroke-width", 2);
            
        // Add a new node for this step
        svg.append("circle")
            .attr("cx", newX)
            .attr("cy", newY)
            .attr("r", nodeRadius)
            .attr("fill", "#4a90e2");
            
        // Add the step number to the node
        svg.append("text")
            .attr("x", newX)
            .attr("y", newY)
            .attr("text-anchor", "middle")
            .attr("dy", ".35em")
            .attr("fill", "white")
            .attr("font-size", `${12 * scaleFactor}px`)
            .text(pathLength);
            
        // Scroll visualization into view
        const vizContainer = document.getElementById('visualization');
        if (vizContainer) {
            vizContainer.scrollIntoView({ behavior: 'smooth', block: 'end' });
        }
    }

    // Redraw all nodes based on path
    function redrawAllNodes(pathLength) {
        init();
        for (let i = 2; i <= pathLength; i++) {
            update(i);
        }
    }

    // Public API
    return {
        initialize: init,
        updateVisualization: update,
        redrawAll: redrawAllNodes
    };
})();