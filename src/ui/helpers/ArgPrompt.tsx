import React, { FC, useState, ReactElement, PropsWithChildren } from 'react';
import { Box } from 'ink';
import TextInput, { InkTextInputProps } from 'ink-text-input';
import { BoxPads } from '.';


export type ArgPromptProps = {
  name: string
  withResult:(val:string) => void
  
  defaultValue?: string
  description?: string
  hideVal?: boolean

  /**
   * Validator function should return null if the
   * value is correct, or an error string if it's
   * incorrect.
   */
  isValid?: (val:any) => null | string
}

export const ArgPrompt:FC<ArgPromptProps> = (props) => {
  const { name, defaultValue, withResult } = props;
  const [value, setValue] = useState(defaultValue || '');
  let basePrompt = `${name}`;
  if (defaultValue) basePrompt += ' (Press enter to accept default)';
  basePrompt += ':';
  let inputProps:InkTextInputProps = {
    value: value,
    onChange: setValue,
    onSubmit: withResult
  };
  if (props.hideVal) inputProps.mask = '*';
  inputProps.onSubmit = !props.isValid ? withResult : (val:string) => {

  }
  return (
    <BoxPads>
      <Box marginRight={1}>{ basePrompt }</Box>
      <TextInput {...inputProps} />
    </BoxPads>
  )
}

export default ArgPrompt;