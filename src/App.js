import React, { Component } from "react";
import './App.css';
import Navigation from "./components/Navigation/Navigation";
import Logo from "./components/Logo/Logo";
import ImageLinkForm from "./components/ImageLinkForm/ImageLinkForm";
import Rank from "./components/Rank/Rank";
import FaceRecognition from "./components/FaceRecognition/FaceRecognition";
import Clarifai from 'clarifai';

const app = new Clarifai.App({
    apiKey: '3425de138cec49018b2e4e98e247422b'
});

class App extends Component {
    constructor() {
        super();

        this.state = {
            input: "",
            imageUrl: "",
            box: {}
        };
    }

    calculateFaceLocation = (data) => {
        const clarifaiFace = data.outputs[0].data.regions[0].region_info.bounding_box;
        const image = document.getElementById("inputimage");
        const width = Number(image.width);
        const height = Number(image.height);
        return {
            leftCol: clarifaiFace.left_col * width,
            topRow: clarifaiFace.top_row * height,
            rightCol: width - (clarifaiFace.right_col * width),
            bottomRow: height - (clarifaiFace.bottom_row * height)
        };
    };

    displayFaceBox = (box) => {
        this.setState({ box: box });
    };

    onInputChange = (event) => {
        this.setState({ input: event.target.value });
    };

    onButtonSubmit = () => {
        this.setState({ imageUrl: this.state.input })
        app.models.predict(Clarifai.FACE_DETECT_MODEL, this.state.input)
            .then(response => this.displayFaceBox(this.calculateFaceLocation(response)))
            .catch(err => console.log("oh no, ran into an error: " + err));
    };

    render() {
        return (
            <div className="App">
                <h1>SmartBrain</h1>
                <Navigation />
                <Logo />
                <Rank />
                <ImageLinkForm onInputChange={this.onInputChange} onButtonSubmit={this.onButtonSubmit} />
                <FaceRecognition box={this.state.box} imageUrl={this.state.imageUrl} />
            </div>
        );
    }
}

export default App;

// clarifai api key: 3425de138cec49018b2e4e98e247422b
// bounding_box: bottom_row, left_col, right_col, top_row

// from the clarifai website:
// app.models.predict(Clarifai.FACE_DETECT_MODEL, this.state.input)
//     .then(
//         function (response) {
//             // console.log(response);
//             // console.log(response.outputs[0].data.regions[0].region_info.bounding_box);
//             this.calculateFaceLocation(response);
//         },
//         function (err) {
//             console.log("oh no, ran into an error: " + err);
//         }
//     );