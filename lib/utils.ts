import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { SubjectManifest } from "./types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function mapCredentialSubject(credentialSubject: Record<string, unknown>, manifest: SubjectManifest): Record<string, unknown> {
  const mapped: Record<string, unknown> = {};

  for (const [displayName, jsonPath] of Object.entries(manifest)) {
    // Simple JSONPath implementation for basic paths like "$.credentialSubject.givenName"
    const path = jsonPath.replace('$.credentialSubject.', '');
    const value = credentialSubject[path];
    if (value !== undefined) {
      mapped[displayName] = value;
    }
  }

  return mapped;
}

export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}