// Augments the generated backendInterface and Backend class to include the
// authorization method expected by the generated useActor hook.
import type {} from "../backend";

declare module "../backend" {
  interface backendInterface {
    _initializeAccessControlWithSecret(secret: string): Promise<void>;
  }
  // Class-interface merge so Backend satisfies the augmented backendInterface.
  interface Backend {
    _initializeAccessControlWithSecret(secret: string): Promise<void>;
  }
}
