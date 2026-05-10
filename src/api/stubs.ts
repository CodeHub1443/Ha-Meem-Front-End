// All functions in this file are STUBS that return mock data.
// TODO: Replace each with a real backend endpoint when implemented.

import { API_BASE_URL } from "./config";
import type { Person } from "@/types/surveillance";

const delay = (ms = 400) => new Promise((r) => setTimeout(r, ms));

// TODO: Replace with real backend endpoint when implemented.
export async function requestSnapshot(cameraId: string): Promise<{ image_base64: string; timestamp: string }> {
  void cameraId;
  await delay(800);
  // 1x1 transparent png placeholder
  return {
    image_base64:
      "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=",
    timestamp: new Date().toISOString(),
  };
}

// TODO: Replace with real backend endpoint when implemented.
export async function testCamera(cameraId: string): Promise<{ success: boolean; latency_ms: number }> {
  void cameraId;
  await delay(600);
  return { success: Math.random() > 0.2, latency_ms: Math.floor(50 + Math.random() * 200) };
}

// TODO: Replace with real backend endpoint when implemented.
export async function saveSettings(payload: unknown): Promise<{ success: boolean }> {
  void payload;
  await delay();
  return { success: true };
}

// TODO: Replace with real backend endpoint when implemented.
export async function fetchPersons(): Promise<Person[]> {
  await delay();
  return [
    { id: "p1", name: "John Doe", sample_count: 12, thumbnail_url: null },
    { id: "p2", name: "Jane Smith", sample_count: 8, thumbnail_url: null },
    { id: "p3", name: "Ahmed Hassan", sample_count: 15, thumbnail_url: null },
  ];
}

// TODO: Replace with real backend endpoint when implemented.
export async function createPerson(name: string, files: File[]): Promise<{ id: string; name: string }> {
  void files;
  await delay(700);
  return { id: `p${Date.now()}`, name };
}

// TODO: Replace with real backend endpoint when implemented.
export async function deletePerson(id: string): Promise<{ success: boolean }> {
  void id;
  await delay();
  return { success: true };
}

// TODO: Replace with real backend endpoint when implemented.
export async function buildGallery(): Promise<{ job_id: string }> {
  await delay();
  return { job_id: `job_${Date.now()}` };
}

let _buildProgress = 0;
// TODO: Replace with real backend endpoint when implemented.
export async function fetchBuildStatus(): Promise<{ status: "idle" | "running" | "done"; progress: number; message: string }> {
  await delay(150);
  _buildProgress = Math.min(100, _buildProgress + 12);
  const status = _buildProgress >= 100 ? "done" : "running";
  let message = "Processing face images...";
  if (_buildProgress > 30) message = "Generating embeddings...";
  if (_buildProgress > 65) message = "Clustering prototypes...";
  if (_buildProgress >= 100) {
    message = "Gallery ready!";
    setTimeout(() => (_buildProgress = 0), 1500);
  }
  return { status, progress: _buildProgress, message };
}

// TODO: Replace with real backend endpoint when implemented.
export async function fetchGalleryInfo(): Promise<{ person_count: number; embedding_count: number; last_built: string }> {
  await delay();
  return { person_count: 3, embedding_count: 35, last_built: new Date(Date.now() - 3600_000).toISOString() };
}

// TODO: Replace with real backend endpoint when implemented.
export async function fetchPipelineStatus(): Promise<{ running: boolean; cameras: { id: string; fps: number; active_tracks: number }[] }> {
  await delay();
  return {
    running: true,
    cameras: [{ id: "camera_01", fps: 22, active_tracks: 2 }],
  };
}

// TODO: Replace with real backend endpoint when implemented.
export async function fetchPipelineStats(): Promise<{ cameras: { id: string; fps: number; decisions_per_min: number; status: string; active_tracks: number }[] }> {
  await delay();
  return {
    cameras: [
      { id: "camera_01", fps: 22 + Math.random() * 4, decisions_per_min: 14, status: "running", active_tracks: 2 },
    ],
  };
}

// TODO: Replace with real backend endpoint when implemented.
export async function fetchSseSubscribers(): Promise<{ count: number }> {
  await delay();
  return { count: 1 };
}

// TODO: Replace with real backend endpoint when implemented.
export async function fetchLogs(type: "events" | "bot" | "system"): Promise<{ lines: string[] }> {
  await delay();
  const now = new Date().toISOString();
  return {
    lines: [
      `[${now}] INFO  ${type} log started`,
      `[${now}] INFO  pipeline initialized`,
      `[${now}] WARNING low light detected on camera_01`,
      `[${now}] INFO  recognition complete`,
    ],
  };
}

// TODO: Replace with real backend endpoint when implemented.
export async function sendWhatsAppTest(): Promise<{ success: boolean; message: string }> {
  await delay(900);
  return { success: true, message: "Test notification sent." };
}

export const _STUB_API_BASE = API_BASE_URL;
