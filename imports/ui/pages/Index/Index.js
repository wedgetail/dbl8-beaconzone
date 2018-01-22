import React from 'react';
import { Button } from 'react-bootstrap';

import './Index.scss';

const Index = () => (
  <div className="Index">

      <div>
          <img
              src="../Ace.jpg"
              alt="Ace!"
          />

          <p>How about some live dashboard controls here.</p>
    </div>
    <footer>
      <p>Alert!  XX readers have not reported in the last hour!</p>
    </footer>
  </div>
);

export default Index;


