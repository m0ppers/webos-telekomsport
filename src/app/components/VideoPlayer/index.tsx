import * as React from 'react';
// @ts-ignore
import videojs from 'video.js';
// @ts-ignore
import * as hls from 'videojs-http-streaming';

import * as style from './style.css';

export namespace VideoPlayer {
    export interface Props {
        autoplay?: boolean;
        src: string;
        controls?: boolean;
        type?: string;
    }
}

export class VideoPlayer extends React.Component<VideoPlayer.Props> {
    private video: React.RefObject<HTMLVideoElement>;
    private player?: videojs.Player;

    constructor(props: VideoPlayer.Props) {
        super(props);
        this.video = React.createRef();
    }

    componentDidMount() {
        const props = {
            ...this.props,
            html5: {
                hls: {
                  withCredentials: true
                }
            }
        };
        // instantiate Video.js
        this.player = videojs(this.video.current, props, function onPlayerReady() {
        });
    }

    // destroy player on unmount
    componentWillUnmount() {
        if (this.player) {
            this.player.dispose()
        }
    }

    // wrap the player in a div with a `data-vjs-player` attribute
    // so videojs won't create additional wrapper in the DOM
    // see https://github.com/videojs/video.js/pull/3856
    render() {
        const className = style.video + " video-js";
        return (
            <div>
                <div data-vjs-player>
                    <video ref={this.video} className={className}>
                        <source src={ this.props.src } />
                    </video>
                </div>
            </div>
        )
    }
}