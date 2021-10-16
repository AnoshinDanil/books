import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'
import { Provider } from 'mobx-react'
import 'mobx-react/batchingForReactDom'
import BooksStoreService from './BooksStoreService'

ReactDOM.render(
  <React.StrictMode>
    <Provider bookStore={BooksStoreService}>
      <App />
    </Provider>
  </React.StrictMode>,
  document.getElementById('root')
)
