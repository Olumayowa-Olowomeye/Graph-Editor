import React,{Component} from "react";
import cytoscape from "cytoscape";
import CytoscapeComponent from "react-cytoscapejs";
import popper from 'cytoscape-popper';

cytoscape.use(popper);

export default class App extends Component{
  constructor(){
    super();
    this.state = {nodes: [], edges:[]};
    this.addEdge = this.addEdge.bind(this);
    this.addNode = this.addNode.bind(this);
    this.clearGraph = this.clearGraph.bind(this);
    this.inputData = this.inputData.bind(this);
  };
  componentDidMount(){
    this.setState({nodes: [], edges:[]});
  }
  componentDidUpdate(){
    console.log(this.state);
  }
  componentWillUnmount(){
    console.log('UnInitializing elements');
  }
  inputData(data){
    this.setState(data);
    console.log("Changed graph to inputed data", this.state);
  }
  addNode(node){
    console.log(node)
    if(node.data.id === "" || node.data.label === ""){
      console.log("Invalid data");
    }else{
      console.log("Creating new node");
      console.log(!this.state.nodes.includes(node))
      if(!this.state.nodes.includes(node)){
        this.setState({nodes: [...this.state.nodes,node],edges : this.state.edges});
      }else{
        console.log(node, " is already in the graph");
      }
    }
  };
  addEdge(edge){
    console.log(edge)
    if(edge.data.source === "" || edge.data.target === "" || edge.data.label === ""){
      console.log("Invalid data");
    }else{
      console.log("Creating new edge");
      console.log(!this.state.nodes.includes(edge));
      if(!this.state.nodes.includes(edge)){
        this.setState({nodes: this.state.nodes,edges : [...this.state.edges,edge]});
      }else{
        console.log(edge, " is already in the graph");
      }
    }
  };
  clearGraph(){
    this.setState({nodes: [], edges:[]});
    console.log("All data has been cleared");
  }
  render(){
    const layout = {
      name: "breadthfirst",
      fit: true,
      directed: true,
      padding: 50,
      animate: true,
      animationDuration: 1000,
      avoidOverlap: true,
      nodeDimensionsIncludeLabels: false
    }
    const styleSheet = [
      {
        selector: "node",
        style: {
          backgroundColor: "#4a56a6",
          width: 30,
          height: 30,
          label: "data(label)",
          "overlay-padding": "6px",
          "z-index": "10",
          "text-outline-color": "#4a56a6",
          "text-outline-width": "2px",
          color: "red",
          fontSize: 20
        }
      },
      {
        selector: "node:selected",
        style: {
          "border-width": "6px",
          "border-color": "#AAD8FF",
          "border-opacity": "0.5",
          "background-color": "#77828C",
          width: 50,
          height: 50,
          "text-outline-color": "#77828C",
          "text-outline-width": 8
        }
      },
      {
        selector: "edge",
        style: {
          width: 3,
          "line-color": "#AAD8FF",
          "target-arrow-color": "#6774cb",
          "target-arrow-shape": "triangle",
          "curve-style": "bezier"
        }
      }
    ];

    let pop = document.createElement("div");

    return(<div>
      <h1>Graph Editor</h1>
      <div style={{border: "1px solid",backgroundColor: "#3f3f3f"}}>
        <CytoscapeComponent 
        elements={CytoscapeComponent.normalizeElements(this.state)} 
        layout={layout} style={ { width: '1600px', height: '800px' }} 
        styleSheet={styleSheet} 
        zoomingEnabled={true}
        maxZoom={3}
        minZoom={0.1}
        autounselectify={false}
        boxSelectionEnabled={true}
        cy={cy => {
          console.log("EVT", cy);
          console.log(cy.data)
          
          // display info on node on click (currently does not dissapear)
          cy.on("dbltap", "node", evt =>{
            let target = evt.target;
            target.popperref = evt.target.popper({
              content: () => {
                pop.innerHTML = "label: " + evt.target.data("label") ;
                pop.style = "background-color: black;color: #fff;text-align: left; padding: 0 5px;border-radius: 6px";
                pop.className = "tooltiptext";
                document.body.appendChild(pop);
                return pop;
              },
              popper: {
                placement: "top-start",
                removeOnDestroy: true
              },
            });
          });
          cy.on("tapstart",evt=>{
            var paras = document.getElementsByClassName("tooltiptext")
            while(paras[0]) {
              paras[0].parentNode.removeChild(paras[0])
            }    
          });
          cy.on("add",evt=>{        
            cy.center();
          }); 
        }}/>
      </div>
      <form>
        <label>
          Node Id:
          <input type="text" name="id" id ="nid"/>
        </label>
        <label>
          Node Label:
          <input type="text" name="label" id="nlabel"/>
        </label>
      </form>
      <p>
        To add an edge between 2 nodes use the node id for source and target and then give the edge a label.
      </p>
      <button onClick={() => this.addNode({data:{id:document.getElementById("nid").value,label:document.getElementById("nlabel").value}})}>Add node</button>
      <form>
        <label>
          Edge Source:
          <input type="text" name="id" id ="esource"/>
        </label>
        <label>
          Edge Target:
          <input type="text" name="id" id ="etarget"/>
        </label>
        <label>
          Edge Label:
          <input type="text" name="label" id="elabel"/>
        </label>
      </form>
      <button onClick={() => this.addEdge({data:{source:document.getElementById("esource").value,target:document.getElementById("etarget").value,label:document.getElementById("elabel").value}})}>Add edge</button>
      <button onClick={() => this.clearGraph()}>Clear Graph</button>
    </div> 
  )};
};