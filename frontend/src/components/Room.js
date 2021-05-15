import React, { Component } from "react";
import { Grid, Button, Typography, TextField } from "@material-ui/core";
import CreateRoomPage from "./CreateRoomPage";
import MusicPlayer from "./MusicPlayer";
import { w3cwebsocket as W3CWebSocket } from "websocket";


export default class Room extends Component {
	constructor(props) {
		super(props);
		
		this.state = {
			votesToSkip: 2,
			guestCanPause: false,
			isHost: false,
			showSettings: false,
			spotifyAuthenticated: false,
			song: {},
			songSuggested: null,
			songList: [],
		};

		this.roomCode = this.props.match.params.roomCode;
		this.leaveButtonPressed = this.leaveButtonPressed.bind(this);
		this.updateShowSettings = this.updateShowSettings.bind(this);
		this.renderSettingsButton = this.renderSettingsButton.bind(this);
		this.renderSettings = this.renderSettings.bind(this);
		this.getRoomDetails = this.getRoomDetails.bind(this);
		this.authenticateSpotify = this.authenticateSpotify.bind(this);
		this.getCurrentSong = this.getCurrentSong.bind(this);

		this.client = new W3CWebSocket('ws://127.0.0.1:8000/ws/chat/'+this.roomCode+ '/');

		this.getRoomDetails();
	}

	handleTextChange = (e)=>{
		this.setState({
			songSuggested: e.target.value,
		})
	}
	
	sendMessage = (e)=>{
		e.preventDefault();
		if(!this.state.songSuggested || !this.state.songSuggested.length)
			return;
		this.client.send(JSON.stringify({
			"type" : "message",
			"message": this.state.songSuggested,
		}));
		this.setState({
			songSuggested: null,
		})
	}

	componentDidMount() {
		this.interval = setInterval(this.getCurrentSong, 1000);

		this.client.onopen = ()=>{
			console.log('WebSocket Client Connected');
		}

		this.client.onmessage = (message)=>{
			const dataFromServer = JSON.parse(message.data);
			if(dataFromServer){
				this.setState({
					songList: [...this.state.songList, dataFromServer.message],
				});
			}
		}
	}

	componentWillUnmount() {
		clearInterval(this.interval);
	}

	getRoomDetails() {
		return fetch("/api/get-room" + "?code=" + this.roomCode)
			.then((response) => {
				if (!response.ok) {
					this.props.leaveRoomCallback;
					this.props.history.push("/");
				}
				return response.json();
			})
			.then((data) => {
				this.setState({
					votesToSkip: data.votes_to_skip,
					guestCanPause: data.guest_can_pause,
					isHost: data.is_host,
				});
				if (this.state.isHost) {
					this.authenticateSpotify();
				}
		});
	}

	authenticateSpotify() {
		fetch("/spotify/is-authenticated")
			.then((response) => response.json())
			.then((data) => {
				this.setState({ spotifyAuthenticated: data.status });
				// console.log(data.status);
				if (!data.status) {
					fetch("/spotify/get-auth-url")
					.then((response) => response.json())
					.then((data) => {
						window.location.replace(data.url);
					});
				}
		});
	}

	getCurrentSong() {
		fetch("/spotify/current-song")
			.then((response) => {
				if (!response.ok) {
					return {};
				} else {
					return response.json();
				}
				}).then((data) => {
					this.setState({ song: data });
			});
	}

	leaveButtonPressed() {
		const requestOptions = {
			method: "POST",
			headers: { "Content-Type": "application/json" },
	};

	fetch("/api/leave-room", requestOptions).then((_response) => {
			this.props.leaveRoomCallback;
			this.props.history.push("/");
		});
	}

	updateShowSettings(value) {
		this.setState({
			showSettings: value,
		});
	}

	renderSettings() {
		return (
			<Grid container spacing={1}>
				<Grid item xs={12} align="center">
					<CreateRoomPage
						update={true}
						votesToSkip={this.state.votesToSkip}
						guestCanPause={this.state.guestCanPause}
						roomCode={this.roomCode}
						updateCallback={this.getRoomDetails}
					/>
				</Grid>
				<Grid item xs={12} align="center">
					<Button
						variant="contained"
						color="secondary"
						onClick={() => this.updateShowSettings(false)}
					>
					Close
					</Button>
				</Grid>
			</Grid>
		);
	}

	renderMessages = ()=>{
		const { songList } = this.state;
		if(!songList.length)
			return null;
		const renderList = (
			songList.map(
				(data)=>{
					return(
						<li><Typography>{data}</Typography></li>
					)
				}
			)
		)
		return renderList;
	}
	
	renderSettingsButton() {
		return (
			<Grid item xs={12} align="center" style={{ paddingTop: "30px"}}>
			<Button
				variant="contained"
				color="primary"
				onClick={() => this.updateShowSettings(true)}
			>
				Settings
			</Button>
			</Grid>
		);
	}

	render() {
		if (this.state.showSettings) {
			return this.renderSettings();
		}
		return (
			<Grid container spacing={2}>
				<Grid item xs = {8}>
					<Grid container spacing={1}>
						<Grid item xs={12} align="center">
							<Typography variant="h4" component="h4"  style={{ paddingBottom: "20px"}}>
								Code: {this.roomCode}
							</Typography>
						</Grid>
						<MusicPlayer {...this.state.song}/>

						{this.state.isHost ? this.renderSettingsButton() : null}

						<Grid item xs={12} align="center" style={{ paddingTop: "20px"}}>
							<Button
								variant="contained"
								color="secondary"
								onClick={this.leaveButtonPressed}
							>
							Leave Room
							</Button>
						</Grid>
					</Grid>
				</Grid>

				<Grid item xs = {4}>
					<Typography variant="h6" component="h6">Suggestions</Typography>
					<div className="chatWindow" align="left">
						{this.state.songList.length ? <ul>
							{this.renderMessages()}
						</ul> : null}
						
					</div>

					<TextField
						error={this.state.error}
						label="Start Typing"
						placeholder="Suggest Songs"
						helperText={this.state.error}
						variant="standard"
						size="medium"
						onChange={this.handleTextChange}
					/>
					<div style={{ paddingTop: "10px"}}>
						<Button
							color="primary"
							variant="contained"
							//onClick={this.handleUpdateButtonPressed}
							size ="small"
							onClick={this.sendMessage}
						>
							Send
						</Button>
					</div>

				</Grid>
			</Grid>
		);
	}
}