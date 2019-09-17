'use strict';
import React, { FC } from 'react';
import { Argv } from 'yargs';
import { Text, Color, Static } from 'ink';


interface EchoProps {
	argv : Argv
}

const Echo:FC<EchoProps> = ({argv}:EchoProps) => (
	<Static>
	<Text>
		Args: <Color green>{argv.arguments}</Color>
	</Text>
	<Text>
		Caller: <Color green>{argv.caller}</Color>
	</Text>
	<Text>
		Full Argv: <Color green>{argv}</Color>
	</Text>
	</Static>
);

export default Echo;
