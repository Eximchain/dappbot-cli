import React, { FC } from 'react';
import { Color, Text, Box } from 'ink';
import SelectInput, { InkSelectInputProps, ItemProps, IndicatorProps } from 'ink-select-input';
import figures from 'figures';
import { LIGHT_BLUE, LabeledContent } from '.';


const LightBlue:FC = ({ children }) => <Color hex={LIGHT_BLUE}>{ children }</Color>

function Item(props:ItemProps) {
  const { isSelected, label } = props;
  return isSelected ? (
    <LightBlue>{ label }</LightBlue>
  ) : (
    <Text>{ label }</Text>
  )
}

function Indicator(props:IndicatorProps) {
  const { isSelected } = props;
  return (
    <Box marginRight={1}>
		{isSelected ? (
			<LightBlue>
				{figures.pointer}
			</LightBlue>
		) : ' '}
	</Box>
  )
}

export interface SelectProps extends InkSelectInputProps {
  label?: string|string[]
}

export const Select:FC<SelectProps> = (props) => {
  let body = (
    <SelectInput {...props} 
      indicatorComponent={Indicator}
      itemComponent={Item} />
  )
  if (!props.label) return body;
  return (
    <LabeledContent label={props.label} content={body} />
  )
}

export default Select;