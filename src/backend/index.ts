'use strict';

import 'ts-helpers';
import 'es6-shim';
import 'source-map-support/register';
import 'reflect-metadata';
import './types';

import { Application } from './config/Application';
export default new Application();