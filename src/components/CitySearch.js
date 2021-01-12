import React, { Component } from 'react'
import "../App.css"

class CitySearch extends Component {
    constructor() {
        super();
        this.state = {
            cityName: "",
            cityData: [],
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
        }).then(data => {
            console.log(data)
            this.setState({
                isLoading: false,
                cityData: data,
                error: false
            })
        }).catch(e => {
            this.setState({
                error: true
            })
        })
    }

    render(){
        console.log("state data: ", this.state.zipData)
        return(
            <main>
                <header id ="main-header">City Search App</header>
                <form>
                    <input type="text" name="cityName" placeholder="City Name" onChange={this.onChange}></input>
                </form>
                {this.state.error===true ? <div className="error">No Results</div> : 
                <div className = "dataContainer"> 
                    <header className="headerContainer">Zip Codes</header>
                        {this.state.cityData.map( (item,index) => (
                            <div>
                                <div className ="innerDataContainer">
                                <ul>
                                    <li>{item}</li>
                                </ul>
                                </div>
                            </div>
                        ))}
                </div>
                }
            </main>
        )
    }
}

export default CitySearch