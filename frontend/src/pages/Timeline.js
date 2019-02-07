import React, { Component } from "react";
import api from "../services/api";
import socket from "socket.io-client";
import twitterLogo from "../twitter.svg";
import Tweet from "../components/Tweet";
import "./Timeline.css";

export default class Timeline extends Component {
  state = {
    tweets: [],
    newTwitter: ""
  };

  async componentDidMount() {
    this.subscribeToEvents();

    const response = await api.get("tweets");
    console.log("response", response);
    this.setState({ tweets: response.data });
  }

  subscribeToEvents = () => {
    const io = socket("http://localhost:3001");
    io.on("tweet", data => {
      this.setState({ tweets: [data, ...this.state.tweets] });
    });

    io.on("like", data => {
      console.log("like", data);
      this.setState({
        tweets: this.state.tweets.map(
          tweet => (tweet._id === data._id ? data : tweet)
        )
      });
    });
  };

  handleInputChange = e => {
    this.setState({ newTwitter: e.target.value });
  };

  handleNewTwitte = async e => {
    if (e.keyCode !== 13) return;

    const content = this.state.newTwitter;
    const author = localStorage.getItem("@GoTwitter:username");

    await api.post("tweets", { content, author });

    this.setState({ newTwitter: "" });
  };

  render() {
    return (
      <div className="timeline-wrapper">
        <img height={24} src={twitterLogo} alt="GoTwitter" />

        <form>
          <textarea
            value={this.state.newTwitter}
            onChange={this.handleInputChange}
            onKeyDown={this.handleNewTwitte}
          />
        </form>

        <ul className="tweet-list">
          {this.state.tweets.map(tweet => (
            <Tweet key={tweet._id} tweet={tweet} />
          ))}
        </ul>
      </div>
    );
  }
}
