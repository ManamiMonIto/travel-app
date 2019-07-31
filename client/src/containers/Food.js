import React, { Component } from 'react'
import axios from 'axios'

import Sidebar from '../components/Food/Sidebar';
import { loadGoogleMaps, loadPlaces } from '../utils';
import { category, activityType } from '../constants';

export class Food extends Component {
  constructor(props) {
    super(props);
    this.state = {
      query: ''
    }
  }

  componentDidMount() {
    let mapPromise = loadGoogleMaps();
    let foodPromise = loadPlaces('Berlin', category.FOOD);
    let excursionPromise = loadPlaces('Berlin', category.OUTDOORS);
    let accommodationPromise = loadPlaces('Berlin', category.HOTEL);

    Promise.all([
      mapPromise,
      foodPromise,
      excursionPromise,
      accommodationPromise
    ])
    .then(values => {
      let maps = values[0];
      this.restaurants = values[1].response.venues;
      this.excursions = values[2].response.venues;
      this.accommodations = values[3].response.venues;

      this.google = maps;
      this.markers = [];

      this.infowindow = new maps.maps.InfoWindow();
      this.map = new maps.maps.Map(document.getElementById('map'), {
        zoom: 12,
        scrollwheel: true,
        center: { lat: this.restaurants[0].location.lat, lng: this.restaurants[0].location.lng }
      });

      this.loadMarkers(this.restaurants, activityType.FOOD);
      this.loadMarkers(this.excursions, activityType.EXCURSION);
      this.loadMarkers(this.accommodations, activityType.ACCOMMODATION);
    })
  }

  loadMarkers = (venues, type) => {
    venues.forEach(venue => {
      venue.type = type;
      let marker = new this.google.maps.Marker({
        position: { lat: venue.location.lat, lng: venue.location.lng },
        map: this.map,
        venue: venue,
        id: venue.id,
        name: venue.name,
        type: type,
        animation: this.google.maps.Animation.DROP
      });

      marker.addListener('click', () => {
        if (marker.getAnimation() !== null) { marker.setAnimation(null); }
        else { marker.setAnimation(this.google.maps.Animation.BOUNCE); }
        setTimeout(() => { marker.setAnimation(null) }, 1500);
      });
      this.google.maps.event.addListener(marker, 'click', () => {
         this.infowindow.setContent(marker.name);
         this.map.setCenter(marker.position);
         this.infowindow.open(this.map, marker);
         this.map.panBy(0, -125);
      });
      this.markers.push(marker);
    });

    this.setState({ filteredVenues: this.restaurants });

  }

  listItemClick = (venue) => {
    let marker = this.markers.filter(m => m.id === venue.id)[0];
    this.infowindow.setContent(marker.name);
    this.map.setCenter(marker.position);
    this.infowindow.open(this.map, marker);
    this.map.panBy(0, -125);
    if (marker.getAnimation() !== null) { marker.setAnimation(null); }
    else { marker.setAnimation(this.google.maps.Animation.BOUNCE); }
    setTimeout(() => { marker.setAnimation(null) }, 1500);
  }

  selectVenue = (venue) => {
    axios
    .post("/api/draftActivities", {
      title: venue.name,
      description: '',
      type: venue.type,
      expenses: 0,
      date: new Date(),
      tripId: `${localStorage.getItem('tripId')}` //TODO: get trip id for the current trip
     })
    .then(response => response.data);
  }

  filter = (query, venues, type) => {
    let f = venues.filter(venue => venue.name.toLowerCase().includes(query.toLowerCase()));
    this.markers.forEach(marker => {
      marker.type === type && marker.name.toLowerCase().includes(query.toLowerCase()) === true ?
        marker.setVisible(true) : marker.setVisible(false);
    });
    this.setState({ filteredVenues: f, query: query });
    return f;
  }

  filterRestaurants = (query) => {
    this.filter(query, this.restaurants, activityType.FOOD);
  }

  filterExcursions = (query) => {
    this.filter(query, this.excursions, activityType.EXCURSION);
  }

  filterAccommodations = (query) => {
    this.filter(query, this.accommodations, activityType.ACCOMMODATION);
  }

  render() {
    return (
      <div style={{display: "flex", height: "100vh"}}>
        <div id="map"></div>
        <div>
          <h3>Foods and Drinks</h3>
          <Sidebar
            filterRestaurants={this.filterRestaurants}
            filterExcursions={this.filterExcursions}
            filterAccommodations={this.filterAccommodations}
            filteredVenues={this.state.filteredVenues}
            listItemClick={this.listItemClick}
            selectVenue={this.selectVenue} />
        </div>
      </div>
    )
  }
}

export default Food
