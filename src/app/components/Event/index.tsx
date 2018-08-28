import * as React from 'react';
import { RouteComponentProps } from 'react-router';
import { telekomClient } from 'app/services/telekomclient';
import { Panel, Header } from '@enact/moonstone/Panels';
import { Item } from '@enact/moonstone/Item';
import { history } from 'app/utils/history';

export interface EventVideo {
    id: number;
    title: string;
    image: string;
}

export namespace Event {
    export interface RouteParams {
        eventId: number;
    }

    export interface Props extends RouteComponentProps<RouteParams> {
    }

    export interface State {
        error?: string;
        eventVideos?: EventVideo[];
    }
}

export class Event extends React.Component<Event.Props, Event.State> {
    constructor(props: Event.Props) {
        super(props);
        this.state = {
        }
    }

    componentDidMount() {
        telekomClient('getEventVideos', [this.props.match.params.eventId])
        .then((result: any) => {
            const eventVideos = result.data.content.reduce((videos: any, contentElement: any) => {
                return contentElement.group_elements.reduce((videos: any, groupElement: any) => {
                    if (groupElement.type == 'eventVideos') {
                        videos = videos.concat(groupElement.data.map((video: any) => {
                            return {
                                id: video.videoID,
                                title: video.title,
                                image: 'https://www.telekomsport.de' + (video.images.editoral || video.images.fallback),
                            }
                        }))
                    }
                    return videos;
                }, videos);
            }, []);
            this.setState({
                eventVideos,
            });
        })
        .catch((e) => {
            this.setState({
                error: e.toString(),
            })
        })
    }

    clickItem(videoId: number) {
        history.push('/videos/' + videoId);
    }

    render() {
        let element;
        if (this.state.eventVideos) {
            element = (
                <Panel>
                    <Header title="Games" />
                    {this.state.eventVideos.map(video => <Item key={video.id} onClick={this.clickItem.bind(this, video.id)}>{video.title}</Item>)}
                </Panel>
            )
        } else if (this.state.error) {
            element = <div>{this.state.error}</div>
        } else {
            element = <div>LOADING</div>
        }
        return element;
    }
}