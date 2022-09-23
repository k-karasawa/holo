import React, { useEffect, useMemo, useState } from 'react'
import { Scene, Matrix4 } from 'three'
import {animate, state} from '../holo'

const Holo = () => {
  useEffect(() => {
    animate(state());
  }, []);
  return (
    <div id="holo-container">
    </div>
  );
};

export default Holo;
