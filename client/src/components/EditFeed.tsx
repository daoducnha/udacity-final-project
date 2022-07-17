import * as React from 'react'
import { Form, Button } from 'semantic-ui-react'
import { patchFeed } from '../api/feeds-api'
import Auth from '../auth/Auth'
import { History } from 'history'

interface UpdateContentFeedProps {
    history: History,
    match: {
        params: {
            feedId: string
        }
    }
    auth: Auth
}

interface UpdateContentFeedState {
    content: string
}

export class EditFeed extends React.PureComponent<
    UpdateContentFeedProps,
    UpdateContentFeedState
> {

    state: UpdateContentFeedState = {
        content: ''
    }

    handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const content = event.target.value
        if (!content) return

        this.setState({
            content: content
        })
    }

    handleSubmit = async (event: React.SyntheticEvent) => {
        event.preventDefault()
        await patchFeed(this.props.auth.idToken, this.props.match.params.feedId, this.state)
        this.props.history.push('/')
    }

    handleCancle =async () => {
        this.props.history.push('/')
    }

    render() {
        return (
            <div>
                <h1>Update new content for feed</h1>

                <Form onSubmit={this.handleSubmit}>
                    <Form.Field>
                        <label>Content</label>
                        <input
                            type="text"
                            accept="application/json"
                            placeholder="Input new content"
                            onChange={this.handleFileChange}
                        />
                    </Form.Field>

                    {this.renderButton()}
                </Form>
            </div>
        )
    }

    renderButton() {

        return (
            <div>
               
                <Button
                    type="submit"
                >
                    Update
                </Button>
                <Button type='button'
                    onClick={this.handleCancle}
                >
                    Cancle
                </Button>
            </div>
        )
    }
}
