/**
 * This file contains yup extensions and defaults. This file should be
 * the one imported in order to use these extensions.
 */
import * as yup from 'yup';

yup.addMethod(yup.array, 'oneOfSchemas', function (schemas) {
  return this.test(
    'one-of-schemas',
    'Not all items in ${path} match one of the allowed schemas',
    (items) =>
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      items!.every((item) => {
        return schemas.some((schema: any) =>
          schema.isValidSync(item, { strict: true }),
        );
      }),
  );
});

declare module 'yup' {
  // tslint:disable-next-line: interface-name
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  export interface ArraySchema<T> {
    /**
     * Allows you to define mutliple disparate types which should
     * be considered valid within a single array. You can tell the method
     * what types of schemas to expect by passing the schema types:
     *
     * ```
     * // Array of object schemas
     * yup.array().oneOfSchemas<yup.ObjectSchema>([
     *     yup.object().shape({ ... })
     * ]);
     *
     * // Array of object or string schemas
     * yup.array().oneOfSchemas<yup.ObjectSchema | yup.StringSchema>([
     *     yup.object().shape({ ... }),
     *     yup.string()
     * ]);
     * ```
     *
     * @param schemas A list of yup schema definitions
     * @param message The message to display when a schema is invalid
     */
    oneOfSchemas<U>(schemas: U[], message?: string): this;
  }
}

export * from 'yup';
