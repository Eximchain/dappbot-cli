import React, { FC } from 'react';
import { Box, Text } from 'ink';
import TextBox from './TextBox';

export interface ItemListProps {
  items : { [key:string]: string }
}

export const ItemList: FC<ItemListProps> = ({ items }) => {
  return (
    <Box margin={1}>
      {
        Object.keys(items).map(itemName => (
          <TextBox><Text bold>{itemName}{': '}</Text>{items[itemName]}</TextBox>
        ))
      }
    </Box>
  )
}

export default ItemList;