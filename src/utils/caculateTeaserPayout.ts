/**
 * This function will calculate teaser odds. All teasers currently pay -110 meaning to make 100
 * dollars you have to bet 110.
 *
 * @param stake the amount to bet on the teaser
 */
export function calculateTeaserPayout(stake: number) {
  return Number((stake * 0.9).toFixed(2));
}
