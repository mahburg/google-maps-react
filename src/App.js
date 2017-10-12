import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import config from './config';

import MarkerCard from './components/MarkerCard'

import {withGoogleMap, GoogleMap, Marker} from 'react-google-maps';

const googleMapURL="https://maps.googleapis.com/maps/api/js?v=3.27&libraries=places,geometry&key=" + config.mapsAPIkey;

const GettingStartedGoogleMap = withGoogleMap(props => (
  <GoogleMap
    ref={props.onMapLoad}
    defaultZoom={15}
    center={props.center}
    googleMapURL={googleMapURL}
  >
    {props.markers.map(marker => (
      <Marker
        {...marker}
      />
    ))}
  </GoogleMap>
));

class App extends Component {
  constructor(){
    super();
    this.state = {
      catagory: null,
      sortByVotes: false,
      sortByDist: false,
      disp: [],
      center: { lat: 40.226, lng: -111.661},
      markers: [{
        position: { lat: 40.22602, lng: -111.6607},
        key: `DevMountain`,
        defaultAnimation: 2,
        votes: 0,
        catagory: 'Home Base'
      },{
        position: { lat: 40.227218, lng: -111.662017},
        key: `Taqueria San Marcos`,
        defaultAnimation: 2,
        votes: 3,
        catagory: 'food'
      },{
        position: { lat: 40.233932, lng: -111.660050},
        key: `Two Jacks Pizza`,
        defaultAnimation: 2,
        votes: 2,
        catagory: 'food'
      },{
        position: { lat: 40.234110, lng: -111.658443},
        key: `Rocco's Big City Deli`,
        defaultAnimation: 2,
        votes: 5,
        catagory: 'food'
      },{
        position: { lat: 40.226105, lng: -111.659744},
        key: `Food Truck RoundUp (Thursdays)`,
        defaultAnimation: 2,
        votes: 32,
        catagory: 'food'
      },{
        position: { lat: 40.217610, lng: -111.663062},
        key: `Provo Mall Food Court`,
        defaultAnimation: 2,
        votes: 7,
        catagory: 'shopping'
      },{
        position: { lat: 40.219585, lng: -111.659373},
        key: `Wendy's`,
        defaultAnimation: 2,
        votes: 6,
        catagory: 'food'
      }],
    }
    this.handleMapLoad = this.handleMapLoad.bind(this);
    this.handleMapClick = this.handleMapClick.bind(this);
    this.handleMarkerRightClick = this.handleMarkerRightClick.bind(this)
    this.recenter = this.recenter.bind(this);
  }
  recenter(lat, lng){
    console.log(lat,lng)
    this.setState({
      center: {lat:lat,lng:lng}
    })
  }
  handleMapLoad(map) {
    this._mapComponent = map;
    if (map) {
      console.log(map.getZoom());
    }
  }
  handleMapClick(event) {
    console.log(event.latLng.lat());
    const nextMarkers = [
      ...this.state.markers,
      {
        position: event.latLng,
        defaultAnimation: 2,
        key: Date.now(), // Add a key property for: http://fb.me/react-warning-keys
      },
    ];
    this.setState({
      markers: nextMarkers,
    });

    // if (nextMarkers.length === 3) {
    //   this.props.toast(
    //     `Right click on the marker to remove it`,
    //     `Also check the code!`
    //   );
    // }
  }

  handleMarkerRightClick(targetMarker) {
    /*
     * All you modify is data, and the view is driven by data.
     * This is so called data-driven-development. (And yes, it's now in
     * web front end and even with google maps API.)
     */
    const nextMarkers = this.state.markers.filter(marker => marker !== targetMarker);
    this.setState({
      markers: nextMarkers,
    });
  }
  catagoryFilter(cat){
    this.setState({
      catagory: cat
    })
  }

  sortByDist(){
    this.setState({
      sortByDist: !this.state.sortByDist
    })
  }
  sortByVotes(){
    this.setState({
      sortByVotes: !this.state.sortByVotes
    })
  }

  sortBy(val){
    if (val === this.state.sortBy){
      this.setState({
        sortBy: false
      })
    } else{
      this.setState({
        sortBy: val
      })
    }
  }

  render() {
    let options = this.state.markers.slice().map(c=>c.catagory);
    options = options.filter((c,i,a)=> !a.slice(i+1).includes(c));
    options = options.map((c,i)=>
      <option key={i} value={c}>{c}</option>
    )
    
    let dispMarkers = this.state.disp.length ? this.state.disp : this.state.markers.slice();
    if (this.state.sortByVotes){
      dispMarkers.sort((a,b)=>b.votes - a.votes)
    }
    if(this.state.catagory){
      dispMarkers = dispMarkers.filter(c=>this.state.catagory===c.catagory)
    }
    const markers = dispMarkers.map((c,i)=>
      <MarkerCard key={i} marker={c} recenter={this.recenter} />
    )
    
    return (
      <div className="App">
        <div className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h2>React Google Maps</h2>
        </div>
        <div className="bottom-sec">
          <div className="sidebar scrollbar" >
            <div className="sort">
              <select className="sort-tag" style={{border: this.state.catagory ? '2px solid red': 'none'}} onChange={_=>this.catagoryFilter(_.target.value)}>
                <option value=''>All</option>
                {options}
              </select>
              {/* <div className="sort-tag" style={{border: this.state.sortByDist ? '2px solid red': 'none'}} onClick={_=>this.sortByDist()}>Distance</div> */}
              <button className="sort-tag" style={{border: this.state.sortByVotes ? '2px solid red': 'none'}} onClick={_=>this.sortByVotes()}>Votes</button>
            </div>
            {markers}
          </div>
          <GettingStartedGoogleMap
            containerElement={
              <div style={{ height: `100vh` }} />
            }
            mapElement={
              <div style={{ height: `100%` }} />
            }
            markers={dispMarkers}
            center={this.state.center}
          />
        </div>
      </div>
    );
  }
}

export default App;
