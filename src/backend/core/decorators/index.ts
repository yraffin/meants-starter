import * as Metadata from './metadata';
import { Class, initializeProperties, initializeStaticProperties } from './Utils';

/**
 * Represents the @MongoCollection(name: {string}) decorator.
 * @function
 * @param {string} name The mongodb collection name.
 */
export function MongoCollection(name: string) {
  return initializeProperties('collectionName', name);
}

/**
 * Represents the @MongoCollection(name: {string}) decorator.
 * @function
 * @param {string} name The mongodb collection name.
 */
export function Right(name: string) {
  const baseRights = new Map<string, string>([
    ['CREATE', `R_API_${name.toUpperCase()}_C`],
    ['READ', `R_API_${name.toUpperCase()}_R`],
    ['UPDATE', `R_API_${name.toUpperCase()}_U`],
    ['DELETE', `R_API_${name.toUpperCase()}_D`],
  ]);

  return initializeStaticProperties(baseRights);
}

export * from './metadata';
export { METADATA_KEY, Class } from './Utils';
