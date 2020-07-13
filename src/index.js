import React from 'react';
import ReactDOM from 'react-dom';
import Fastclick from 'fastclick';
import * as serviceWorker from './serviceWorker';
import Router from './router/index';
import { Provider } from "react-redux";
import { AppContainer } from 'react-hot-loader'
import store from "@/store";
import "lib-flexible";
import '@/assets/css/base.scss';
import '@/assets/css/main.scss';
import 'weui';
import 'react-weui/build/packages/react-weui.css';
Fastclick.attach(document.body);

const render = Component =>{
  ReactDOM.render(
    <Provider store={store}>
      <AppContainer>
        <Component />
      </AppContainer>
    </Provider>,
    document.getElementById("root")
  );  
};

render(Router);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
