import * as React from 'react';
import { telekomClient } from 'app/services/telekomclient';
import { Panel, Header } from '@enact/moonstone/Panels';
import { Item } from '@enact/moonstone/Item';
import { history } from 'app/utils/history';

export interface ProgramEntry {
    id: number;
    title: string;
    isoDate: Date;
    localDateString: string;
}

export namespace Home {
    export interface Props {
    }

    export interface State {
        error?: string;
        program?: {
            entries: ProgramEntry[];
        }
    }
}

export class Home extends React.Component<Home.Props, Home.State> {
    constructor(props: Home.Props) {
        super(props);
        this.state = {
        }
    }

    componentDidMount() {
        telekomClient('getNavigation', [])
        .then((result: any) => {
            const entries: ProgramEntry[] = result.data.elements.reduce((entries: any, element: any) => {
                return entries.concat(element.slots.reduce((slotEntries: any, slot: any) => {
                    const isoDate = new Date(slot.iso_date);
                    return slotEntries.concat(slot.events.map((event: any) => {
                        return {
                            id: event.metadata.id,
                            title: event.metadata.name,
                            isoDate,
                            localDateString: slot.original,
                        }
                    }));
                }, []));
            }, []);
            this.setState({
                program: {
                    entries,
                }
            });
        })
        .catch((e) => {
            this.setState({
                error: e.toString(),
            })
        })
    }

    renderItem(index: number, ...rest: any[]) {
        return (
            <div></div>
        )
    }

    clickItem(eventId: number) {
        history.push('/events/' + eventId);
    }

    render() {
        if (this.state.error) {
            return (
                <div>{this.state.error}</div>
            )
        } else if (this.state.program) {
            return (
                <Panel>
                    <Header title="Games" />
                    {this.state.program.entries.map(entry => <Item key={entry.id} onClick={this.clickItem.bind(this, entry.id)}>{entry.title}</Item>)}
                </Panel>
            )
        } else {
            return (
                <div></div>
            )
        }
    }
}