import React from 'react';
import ReactSpeedometer from "react-d3-speedometer";
import { Button } from 'react-bootstrap';

import './Index.scss';

const Index = () => (
  <div className="Index">
    <ReactSpeedometer value={500} />
    <footer>
      <p>Alert!  XX readers have not reported in the last hour!</p>
    </footer>
  </div>
);

export default Index;


