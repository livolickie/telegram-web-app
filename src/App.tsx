import { ConfigProvider } from 'antd';
import React from 'react';
import {MainApp} from "./components/MainApp";

const App: React.FC = () => (
    <ConfigProvider theme={{ token: { colorPrimary: '#00b96b' } }}>
      <MainApp />
    </ConfigProvider>
);

export default App;