/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as worker from 'monaco-editor-core/esm/vs/editor/editor.worker';
import { JstWorker } from './jstWorker';

self.onmessage = () => {
	// ignore the first message
	worker.initialize((ctx, createData) => {
		return new JstWorker(ctx, createData);
	});
};
