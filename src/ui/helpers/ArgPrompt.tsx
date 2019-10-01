import React, { FC, useState } from 'react';
import { Box, Text } from 'ink';
import TextInput, { InkTextInputProps } from 'ink-text-input';
import { BoxPads, Rows, ErrorLabel } from '.';
import { StringElt } from '..';


export type ArgPromptProps = {
  name: string
  withResult:(val:string) => void
  
  defaultValue?: string
  label?: StringElt | StringElt[]
  hideVal?: boolean

  /**
   * Validator function should return null if the
   * value is correct, or an error string if it's
   * incorrect.
   */
  isValid?: (val:string) => null | string
}

export const ArgPrompt:FC<ArgPromptProps> = (props) => {
  const { name, defaultValue, withResult } = props;
  const [value, setValue] = useState(defaultValue || '');
  const [error, setError] = useState('');

  let basePrompt = `${name}`;
  if (defaultValue) basePrompt += ' (Press enter to accept default)';
  basePrompt += ':';

  let inputProps:InkTextInputProps = {
    value: value,
    onChange: setValue,
    onSubmit: withResult
  };

  if (props.hideVal) inputProps.mask = '*';

  inputProps.onSubmit = (val:string) => {
    if (!props.isValid) return withResult(val);
    const errMsg = props.isValid(val);
    if (errMsg) {
      setError(errMsg)
    } else {
      withResult(val);
    }
  }

  inputProps.onChange = (val:string) => {
    if (error !== '') setError('');
    setValue(val);
  }

  let body = (
    <>
      <Box marginRight={1}>{ basePrompt }</Box>
      <TextInput {...inputProps} />
    </>
  );

  if (!props.label) return (
    <BoxPads>{body}</BoxPads>
  )

  let errMsg = error !== '' ? (
    <Text>
      <ErrorLabel errorType='validation' />
      {' '+error}
    </Text>
  ) : null;
  
  return (
    <Rows>
      { props.label }
      { body }
      { errMsg }
    </Rows>
  )
}

export default ArgPrompt;