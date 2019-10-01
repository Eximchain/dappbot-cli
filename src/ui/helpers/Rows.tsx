import React, { FC } from 'react';
import { Box } from 'ink';


export const Rows: FC = ({ children }) => {
    
  return (
    <Box margin={1} flexDirection='column'>
      {
        React.Children.map(children, (child, i) => {
          return <Box key={`${i}`} marginBottom={1} flexDirection='row'>{child}</Box>
        })
      }
    </Box>
  )
}

export default Rows;