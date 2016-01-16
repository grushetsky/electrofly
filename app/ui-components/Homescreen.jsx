import ipc from 'ipc'
import React from 'react'
import ReactDOM from 'react-dom'

class MainMenu extends React.Component {
  constructor() {
    super()
    this.state = {
      sites: []
    }
  }

  componentWillMount() {
    ipc.on('navigation.navigate-home', (sitesList) => {
      this.setState({
        sites: sitesList
      })
    })
  }

  render() {
    var entries = this.state.sites.map((site) => {
      var key = Math.random(0,1) * Date.now()
      return <MainMenuEntry key={key} name={site.name} url={site.url} />
    })
    return (
      <ul>
        {entries}
      </ul>
    )
  }
}

class MainMenuEntry extends React.Component {
  render() {
    return (
      <li>
        <a href={this.props.url} onClick={this._handleClick}>{this.props.name}</a>
      </li>
    )
  }

  _handleClick(event) {
    event.preventDefault()
    ipc.send('navigation.open-site-intent', {
      url: event.target.href
    })
  }
}

ReactDOM.render(<MainMenu />, document.getElementById('main'))
