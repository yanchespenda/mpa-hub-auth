export function capitalize(input: string): string {
  return input.charAt(0).toUpperCase() + input.slice(1);
}

export function actionGenerator(input: string): string {
  return input.replace('-', '_').toUpperCase();
}
