import React, { FC, useState } from 'react';
import { Box } from 'ink';
import TextInput from 'ink-text-input';

export interface ArgSpec {
  key: string
  name?: string
  description?: string
  valueType?: 'string' | 'number' | 'enum'

  /**
   * Only to be used when the valueType is 'enum',
   * array of possible values.
   */
  options?: string[]


  /**
   * Validator function should return true if the
   * value is correct, false for incorrect, or string
   * if it's an incorrect and there's an error we
   * can provide.
   */
  isValid?: (val:any) => boolean | string
}

export interface CompletedArgMap {
  [key:string]: string | number
}

export interface ArgPromptProps {
  args: ArgSpec[]
  withResult: (vals:CompletedArgMap) => void
}

export const ArgPrompt:FC<ArgPromptProps> = ({ args: inputs }) => {
  return (
    <Box>

    </Box>
  )
}