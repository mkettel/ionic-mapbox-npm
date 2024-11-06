import { MapboxPlugin } from 'ionic-mapbox';

window.testEcho = () => {
    const inputValue = document.getElementById("echoInput").value;
    MapboxPlugin.echo({ value: inputValue })
}
