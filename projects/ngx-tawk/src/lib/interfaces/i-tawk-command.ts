/**
 * Standardizes a common command protocol :)
 */
export interface ITawkCommand {
  command: string;
  values: Array<any>;
}
