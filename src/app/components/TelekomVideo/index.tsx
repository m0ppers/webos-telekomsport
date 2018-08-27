import * as React from 'react';
import { telekomClient } from 'app/services/telekomclient';
import { RouteComponentProps } from 'react-router';
import { RootState } from 'app/reducers';
import { connect } from 'react-redux';
import { VideoPlayer } from 'app/components/VideoPlayer';

export namespace TelekomVideo {
    interface RouteParams {
        videoId: number;
    }

    export interface Props extends RouteComponentProps<RouteParams> {
        jwt: string;
    }

    export interface State {
        url: string;
    }
}

@connect(
    (state: RootState): Pick<TelekomVideo.Props, 'jwt'> => {
      return { jwt: state.auth.jwt || '' };
    }
)
export class TelekomVideo extends React.Component<TelekomVideo.Props, TelekomVideo.State> {
    constructor(props: TelekomVideo.Props) {
        super(props);
        this.state = {
            url: '',
        }
    }

    componentDidMount() {
        // instantiate Video.js

        telekomClient('getVideoStream', [this.props.jwt, this.props.match.params.videoId])
        .then((params) => {
            console.log(params.data['stream-access'][0]);
            const playlistUrl = 'https:' + params.data['stream-access'][1]; // + '?hdnea=' + this.props.jwt;
            fetch(playlistUrl)
            .then((response) => response.text())
            .then(xmlString => {
                const parser = new DOMParser();
                const xmlDoc = parser.parseFromString(xmlString, 'application/xml');
                const url = xmlDoc.evaluate( '//data/token/@url', xmlDoc, null, XPathResult.STRING_TYPE, null).stringValue;
                const auth = xmlDoc.evaluate( '//data/token/@auth', xmlDoc, null, XPathResult.STRING_TYPE, null).stringValue;
                return url + '?hdnea=' + auth;
            })
            .then(url => {
                this.setState({
                    url,
                })
            });
        })
    }

    render() {
        console.log(this.state);
        let element;
        if (!this.state.url) {
            element = <div>LOADING</div>
        } else {
            element = <VideoPlayer autoplay controls src={this.state.url} type="application/vnd.apple.mpegurl"/>
        }

        return (
            element
        )
    }
}