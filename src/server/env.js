// @ts-check
/**
 * This file is included in `/next.config.js` which ensures the app isn't built with invalid env vars.
 * It has to be a `.js`-file to be imported there.
 */
/* eslint-disable @typescript-eslint/no-var-requires */
const yup = require('yup');

/*eslint sort-keys: "error"*/
const envSchema = yup.object().shape({
  DATABASE_URL: yup.string().required(),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: yup.string().required(),
  NEXT_PUBLIC_SUPABASE_URL: yup.string().required(),
  NODE_ENV: yup
    .string()
    .oneOf(['development', 'preview', 'production'])
    .required(),
  PORT: yup.number().default(3000),
  VERCEL_URL: yup.string(),
});

try {
  const env = envSchema.validateSync(process.env);
  module.exports.env = env;
} catch (error) {
  /** @type {yup.ValidationError} */
  // @ts-expect-error necessary typing
  const typedError = error;
  console.error(
    '❌ Invalid environment variables:',
    JSON.stringify(typedError.errors, null, 4),
  );
  process.exit(1);
}
