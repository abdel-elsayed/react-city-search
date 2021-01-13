import React, { Component } from 'react'
import "../App.css"

class CitySearch extends Component {
    constructor() {
        super();
        this.state = {
            cityName: "",
            zipCodes: [],
            stateData: [],
            error: false,
        }
    }

    componentDidMount(){
       this.fetchNewData(this.state.cityName)
    }

    onChange = (event) => {
        this.setState({ isLoading:true, 
            [event.target.name]: event.target.value
        })
        this.fetchNewData(event.target.value)
    }

    fetchNewData = (cityName) => {
        cityName = cityName.split(" ").join("").toUpperCase();
        const url = "http://ctp-zip-api.herokuapp.com/city/" + cityName
        fetch(url).then(response => {
            if(response.ok)
            {
                return response.json()
            }
            else{
                throw new Error("Unable to fetch data!!")
            }
        }).then(zipCodes => {
            //console.log(zipCodes)
            let allData =this.state.stateData;
            let seen = {};

            zipCodes.forEach(zip=>{
                fetch("http://ctp-zip-api.herokuapp.com/zip/" + zip).then(response=>{
                return response.json()
                }).then(data=>{
                    data.forEach((item) => {
                        console.log("seen",seen)
                        if(!seen[item.State]){
                            seen[item.State] = true
                            allData.push(item);
                        }
                    });
                    this.setState({stateData:allData})
                })
                this.setState({
                    isLoading: false,
                    zipCodes: zipCodes,
                    error: false
                })
            })  
           
        }).catch(e => {
            this.setState({
                error: true
            })
        })
    }
        
    
    render(){
        return(
            <main>
                <header id ="main-header">City Search App</header>
                <form>
                    <input type="text" name="cityName" placeholder="Enter City..." onChange={this.onChange}></input>
                </form>
                <div style={{display: "flex", flexDirection:"row"}}>
                    {this.state.error===true ? <div className="error">No Results</div> : 
                    
                    <div className = "dataContainer"> 
                            <header className="headerContainer">Zip Codes</header>
                                {this.state.zipCodes.map( (item,index) => (
                                    <div key ={index}>
                                        <div className ="innerDataContainer">
                                        <ul>
                                            <li>{item}</li>
                                        </ul>
                                        </div>
                                    </div>
                                ))}
                        </div>
                        }

                        {this.state.error===true ? <div className="error">No Results</div> : 
                        <div className = "dataContainer"> 
                            <header className="headerContainer">States were city is found</header>
                                {this.state.stateData.map( (item,index) => (

                                    <div key ={index}>
                                        <div className ="innerDataContainer">
                                        <ul>
                                            <li >{item.State}</li>
                                        </ul>
                                        </div>
                                    </div>
                                ))}
                        </div>
                    }
                </div> 
            </main>
        )
    }
}

export default CitySearch