import React, { FC } from 'react';
import { Box, Text } from 'ink';
import TextBox from './TextBox';

export interface ItemListProps {
  items : { [key:string]: string }
}

export const ItemList: FC<ItemListProps> = ({ items }) => {
  return (
    <Box margin={1} flexDirection='column'>
      {
        Object.keys(items).map((itemName, i) => (
          <TextBox key={i}><Text underline>{itemName}</Text>{': '}{items[itemName]}</TextBox>
        ))
      }
    </Box>
  )
}

export default ItemList;