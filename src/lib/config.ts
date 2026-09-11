function hasGoogleCredentials(): boolean {
  return Boolean(
    process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL &&
      process.env.GOOGLE_PRIVATE_KEY
  );
}

export function isGoogleSheetsConfigured(): boolean {
  return hasGoogleCredentials() && Boolean(process.env.GOOGLE_SHEET_ID);
}

export function isGoogleDriveConfigured(): boolean {
  return hasGoogleCredentials() && Boolean(process.env.GOOGLE_DRIVE_FOLDER_ID);
}

export function isGoogleConfigured(): boolean {
  return isGoogleSheetsConfigured() && isGoogleDriveConfigured();
}
