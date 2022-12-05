import { Provider } from 'mobx-react';
import React from 'react';
import ReactDOM from 'react-dom/client';
import {
  createBrowserRouter,
  RouterProvider
} from "react-router-dom";
import './index.css';
import reportWebVitals from './reportWebVitals';
import { ErrorPage } from './routes/error-page';
import { Mint } from './routes/mint';
import { MyNFTS } from './routes/my-nfts';
import { NFTS } from './routes/nfts';
import { Profile } from './routes/profile';
import { Root } from './routes/root';
import { MetamaskStore } from './store/metamask.store';


const appInit = async () => {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <Root />,
      errorElement: <ErrorPage />,
      children: [
        {
          path: "nfts",
          element: <NFTS />
        },
        {
          path: "mint",
          element: <Mint />
        },
        {
          path: "my-nfts",
          element: <MyNFTS />
        },
        {
          path: "profile",
          element: <Profile />
        }
      ]
    },
  ]);
  const metamaskStore = new MetamaskStore();
  await metamaskStore.init();
  const root = ReactDOM.createRoot(
    document.getElementById('root') as HTMLElement
  );
  root.render(
    <React.StrictMode>
      <Provider metamaskStore={metamaskStore}>
        <RouterProvider router={router} />
      </Provider>
    </React.StrictMode>
  );
}

appInit();
// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
