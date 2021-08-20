import { ITawkCommand } from './i-tawk-command';

/**
 * Standardize an key-value objet to configure TAWK installation.
 */
export interface ITawkSettings {
  /** Is mandatory to provide a tracking code folks... */
  projectId: string;
  /** You can inject custom initialization commands like UserId or other e-commerce features. */
  initCommands?: Array<ITawkCommand>;
  /** If Tawk changes the uri and I die, you can survive! */
  uri?: string;
  /** If true, trace TAWK tracking errors in production mode */
  enableTracing?: boolean;
  /** If has a value, nonce will be added to script tag **/
  nonce?: string;
}
