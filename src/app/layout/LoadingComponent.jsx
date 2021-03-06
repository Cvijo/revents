import React from 'react'
import { Loader, Dimmer } from 'semantic-ui-react';


const LoadingComponent = ({inverted}) => {
  return (
    <Dimmer inverted = {inverted || false} active={true}>
        <Loader content='Loading ...'>

        </Loader>
    </Dimmer>
  )
}

export default LoadingComponent;