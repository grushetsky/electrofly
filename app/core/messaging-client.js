import socketIoClient from 'socket.io-client'

export default class RemoteMessengerClient {
  static CreateSocketIoClient(options) {
    return new RemoteMessengerSocketIoClient(options.port)
  }

  connect() {}
  on(eventName) {}
  send(eventName, data) {}
}

class RemoteMessengerSocketIoClient extends RemoteMessengerClient {
  constructor(port) {
    super()
    this._connectionTimeout = 2000
    this._port = port
  }

  connect() {
    return new Promise((resolve, reject) => {
      // console.log(`Socket.IO client tries to connect to server on port ${this._port}.`)
      this._socket = socketIoClient.connect(`ws://localhost:${this._port}`)
      this._socket.on('connect', () => {
        resolve()
      })
      this._socket.on('disconnect', (socket) => {
        this._socket.close();
        this._socket = null
      })
      this._socket.on('ping', (data) => {
        console.log('Got pingggeeeeeddd')
        this._socket.emit('pong', data)
      })

      this._socket.on('navigation.navigate-url', (data) => {
        this._socket.emit('pong', data)
      })

      this._socket.emit('navigation.open-site-intent', { url: 'fsfs fff' })
      setTimeout(() => {

        // TODO: Pass timeout error
        reject()
      }, this._connectionTimeout)
    })
  }

  on(eventName) {
    return new Promise((resolve, reject) => {
      this._socket.on(eventName, (data) => {
        resolve(data)
      })
    })
  }

  send(eventName, data) {
    console.log('Send:', data, eventName)
    // this._socket.io.engine.send(eventName, JSON.stringify(data), (eve) => {
    //   console.log('eve', eve)
    // })
    this._socket.emit('echo', {url: 'fsf'})
  }
}
