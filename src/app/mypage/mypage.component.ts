/// <reference types="@types/googlemaps"/>
import { Conditional } from "@angular/compiler";
import { Component, OnInit, OnChanges, AfterViewInit } from "@angular/core";

@Component({
	selector: "app-mypage",
	templateUrl: "./mypage.component.html",
	styleUrls: ["./mypage.component.scss"],
})
export class MypageComponent implements AfterViewInit {
	map!: google.maps.Map;
	directionsService!: google.maps.DirectionsService;
	directionsRenderer!: google.maps.DirectionsRenderer;
	direction: any;
	constructor() {
		console.log("check");
		(window as any).initMap = this.initMap;
		this.loadScript();
		// this.calculateDirection();
		// declare global {
		//   interface Window {
		//     initMap: () => void;
		//   }
		// }
		// (window as any).initMap = this.initMap;
	}

	ngAfterViewInit(): void {}

	loadScript() {
		return new Promise((resolve, reject) => {
			//load script
			const script = document.createElement("script");
			script.src =
				"https://maps.googleapis.com/maps/api/js?key=AIzaSyDdzBpJxo34zgg7MLWAV5WHBC0SnmqxsBM&libraries=places&callback=initMap&v=weekly";
			script.async = true;
			script.defer = true;
			script.onload = resolve;
			script.onerror = reject;
			document.head.appendChild(script);
		});
	}

	initMap(): void {
		const office = { lat: 32.2, lng: 34.9 };

		const start = new google.maps.LatLng(31.8, 35.5);
		const end = new google.maps.LatLng(32.2, 34.9);

		this.map = new google.maps.Map(
			document.getElementById("map") as HTMLElement,
			{
				center: { lat: 31, lng: 35 },
				zoom: 8,
			}
		);

		const marker = new google.maps.Marker({
			position: office,
			map: this.map,
		});

		const marker2 = new google.maps.Marker({
			position: start,
			map: this.map,
		});
		const marker3 = new google.maps.Marker({
			position: end,
			map: this.map,
		});

		let autocomplete = new google.maps.places.Autocomplete(
			document.getElementById("autocomplete") as HTMLInputElement,
			{
				types: ["establishment"],
				componentRestrictions: { country: ["IL"] },
				fields: ["place_id", "geometry", "name"],
			}
		);

		const options = {
			fields: ["address_components", "geometry", "icon", "name"],
			strictBounds: false,
			types: ["establishment"],
		};

		autocomplete.addListener("place_changed", onPlaceChanged);

		function onPlaceChanged() {
			let place = autocomplete.getPlace();
			console.log(place);

			marker.setPosition(place.geometry!.location);
			marker.setVisible(true);
		}
	}

	calculateDirection() {
		const start = new google.maps.LatLng(31.8, 35.5);
		const end = new google.maps.LatLng(32.2, 34.9);
		// const start = { lat: 31.8, lng: 35.5 };
		// const end = { lat: 32.2, lng: 34.9 };
		const directionRequest = {
			origin: start,
			destination: end,
			travelMode: google.maps.TravelMode["DRIVING"],
			unitSystem: google.maps.UnitSystem.METRIC,
		};

		// this.directionsService = new google.maps.DirectionsService();
		// this.directionsRenderer = new google.maps.DirectionsRenderer(
		// 	{
		// 	map:this.map
		// }
		// );
		console.log(this.map);
		const directionsService = new google.maps.DirectionsService();
		const directionsRenderer = new google.maps.DirectionsRenderer({
			map: this.map,
		});

		directionsRenderer.setMap(this.map);

		// console.log(this.directionsService);
		directionsService.route(
			{
				origin: { lat: 31.945047, lng: 34.888965 },
				destination: { lat: 32.064781, lng: 34.7716326 },
				travelMode: google.maps.TravelMode["DRIVING"],
			},
			(result, status) => {
				console.log(result);
				console.log(this.map);
				directionsRenderer.setDirections(result);

				if (status == google.maps.DirectionsStatus.OK) {
					console.log("succses");
					console.log(this.directionsService);
					console.log(result);

					// console.log(this.directionsRenderer.setDirections(result));
				}
			}
		);
	}
}
