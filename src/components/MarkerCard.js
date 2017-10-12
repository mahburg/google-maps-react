import React, { Component } from 'react';

class MarkerCard extends Component{
    
    render(){
        return(
            <div className="loc-card" onClick={_=>this.props.recenter(this.props.marker.position.lat, this.props.marker.position.lng)}>
                <h2>{this.props.marker.key}</h2>
                <br/>
                <p>Votes: {this.props.marker.votes}</p>
                <br/>
                <p>Category: {this.props.marker.catagory}</p>
            </div>
        )
    }
}

export default MarkerCard;