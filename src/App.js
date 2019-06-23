import React from "react";
import Textarea from "react-textarea-autosize";
import axios from "axios";

import "./App.css";

import dict from "./dict.json";

const API = process.env.REACT_APP_API_URL;
class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      originText: "",
      translatedText: "",
      audioUrl: undefined
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  async componentDidMount() {
    // await this.handleSubmit();
  }

  handleChange(e) {
    const origin = e.target.value.trim();
    const arrayWord = origin.split(/\s+/g);

    let translateArray = [];
    let translate;

    for (const word of arrayWord) {
      const tmp = (word.match(/\w+/) && word.match(/\w+/)[0]) || word;
      const suffix = tmp.length < word.length ? word.slice(-1) : "";
      translateArray.push((dict[tmp.toLowerCase()] || word) + suffix);
    }
    translate = translateArray.join(" ");

    this.setState({
      originText: origin,
      translatedText: translate
    });
  }

  handleSubmit = async e => {
    let response;
    const data = {
      voice: "Joanna",
      text: e.target.value
    };
    const postOption = {
      method: "POST",
      headers: { "content-type": "application/json" },
      data: JSON.stringify(data),
      url: API
    };
    try {
      response = await axios(postOption);
      console.log(response);
      setTimeout(() => {
        this.setState({
          audioUrl: `https://s3-ap-southeast-1.amazonaws.com/text-to-speech-english/${
            response.data
          }.mp3`
        });
        this.refs.audio.pause();
        this.refs.audio.load();
        this.refs.audio.play();
      }, 1100);
    } catch (error) {
      console.log(error);
    }
  };

  render() {
    let audio;
    let displaying = "none";
    if (this.state.audioUrl) {
      audio = (
        <audio controls>
          <source src={this.state.audioUrl} type="audio/mpeg" />
        </audio>
      );
      displaying = true;
    }
    return (
      <center className="container">
        <Textarea
          className="originText"
          onChange={this.handleChange}
          minRows={3}
          maxRows={6}
          style={{boxSizing: 'border-box'}}
        />
        <br />
        <Textarea
          className="translatedText"
          value={this.state.translatedText}
          minRows={3}
          maxRows={6}
          style={{boxSizing: 'border-box'}}
          readOnly
        />
        <br />
        <button
          type="submit"
          onClick={this.handleSubmit}
          value={this.state.originText}
        >
          Speak it
        </button>
        <br />
        <h3>Pass your text in the text area, example: My name is Giang</h3>
        <br />
        <audio controls style={{ display: displaying }} ref="audio">
          <source src={this.state.audioUrl} type="audio/mpeg" />
        </audio>
        <br />
      </center>
    );
  }
}

export default App;
