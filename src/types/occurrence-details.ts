import type {
  OperationalPriority,
  OperationalStatus,
} from "@/types/operations";

export type OccurrenceDetailMedia = {
  id: string;
  mimeType: string;
  fileSizeBytes: number;
  type: string;
  uploadedAt: string;
  signedUrl: string | null;
  signedUrlExpiresAt: string | null;
};

export type OccurrenceDetail = {
  id: string;
  protocol: string;
  address: string;
  description: string;
  situationType: string | null;
  latitude: number | null;
  longitude: number | null;
  createdAt: string;
  updatedAt: string;
  status: OperationalStatus;
  priority: OperationalPriority | null;
  media: OccurrenceDetailMedia[];
};