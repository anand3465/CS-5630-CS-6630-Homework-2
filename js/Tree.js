/** Class representing a Tree. */
class Tree {
  constructor(json) {
      this.Tree_nodes = [];

      // Create nodes and link them to their parent
      for (let i = 0; i < json.length; i++) {
          let node = new Node(json[i].name, json[i].parent);

          // Find parent node
          if (node.parentName !== "root") {
              node.parentNode = this.findNode(node.parentName);
              if (node.parentNode) {
                  node.parentNode.addChild(node);
              }
          }

          this.Tree_nodes.push(node);
      }
  }

  findNode(nodeName) {
      for (let i = 0; i < this.Tree_nodes.length; i++) {
          if (this.Tree_nodes[i].name === nodeName) {
              return this.Tree_nodes[i];
          }
      }
      return null;
  }

  buildTree() {
      let root = this.Tree_nodes.find(node => node.parentName === "root");

      if (root) {
          this.assignLevel(root, 0);  
          this.assignPosition(root, 0); 
      }
  }

  /**
   * Recursive function to assign levels to each node.
   * @param {Node} node - The current node.
   * @param {number} level - The level to assign to the node.
   */
  assignLevel(node, level) {
      node.level = level;
      node.children.forEach(child => {
          this.assignLevel(child, level + 1);
      });
  }

  /**
   * Recursive function to assign positions to nodes based on sibling order.
   * @param {Node} node - The current node to assign position to.
   * @param {number} position - The position of this node relative to its siblings.
   */
  assignPosition (node, position) {
      node.position = position;
    

      // Perform DFS for each child 
      node.children.forEach((child,index) => {
          position = this.assignPosition(child, position);
          
          if(index+1 != node.children.length){
          position++;
          }
         
          
      });
      
      return position;
  }
  
  renderTree() {
    const svgWidth = 1200;
    const svgHeight = 1200;
    const nodeRadius = 50;

    // Append SVG to the body
    const svg = d3.select("body")
        .append("svg")
        .attr("width", svgWidth)
        .attr("height", svgHeight);

    // Scaling factors for positioning
    const xScale = d3.scaleLinear()
        .domain([0, d3.max(this.Tree_nodes, d => d.level)])  // max levels range
        .range([100, svgWidth - 50]);  // x-axis

    const yScale = d3.scaleLinear()
        .domain([0, d3.max(this.Tree_nodes, d => d.position)])  // max positions range
        .range([100, svgHeight - 50]);  // y-axis

   
        this.Tree_nodes.forEach(node => {
          if (node.parentNode) {
              svg.append("line")
                  .attr("x1", xScale(node.parentNode.level))
                  .attr("y1", yScale(node.parentNode.position))
                  .attr("x2", xScale(node.level))
                  .attr("y2", yScale(node.position))
          }
      });

    // Render the nodes (grouped with labels)
    const nodeGroups = svg.selectAll("g.nodeGroup")
        .data(this.Tree_nodes)
        .enter()
        .append("g")
        .attr("class", "nodeGroup")
        .attr("transform", d => `translate(${xScale(d.level)}, ${yScale(d.position)})`);

    // Add circles to the node group
    nodeGroups.append("circle")
        .attr("r", nodeRadius);

    // Add text (labels) to the node group
    nodeGroups.append("text")
        .attr("class", "label")
        .attr("dy", 5)  
        .attr("x", 0)  
        .text(d => d.name);

    
}
}