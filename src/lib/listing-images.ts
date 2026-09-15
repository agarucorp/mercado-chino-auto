/**
 * Almacenamiento local de las fotos del aviso.
 *
 * Los blobs viven en IndexedDB (localStorage no soporta binario y se llena con
 * 3 fotos). El borrador en localStorage solo guarda la metadata de cada imagen.
 * Cuando exista Supabase Storage, `saveImages` pasa a subir y el resto del
 * wizard no cambia.
 */

export interface DraftImage {
  id: string;
  name: string;
  size: number;
  type: string;
}

const DB_NAME = "auchar-listing-images";
const DB_VERSION = 1;
const STORE = "images";

export const ACCEPTED_TYPES = ["image/jpeg", "image/png", "image/webp"];
export const MAX_IMAGE_BYTES = 8 * 1024 * 1024;

export interface RejectedImage {
  name: string;
  reason: string;
}

function hasIndexedDb(): boolean {
  return typeof indexedDB !== "undefined";
}

function openDb(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORE)) {
        db.createObjectStore(STORE, { keyPath: "id" });
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

function tx<T>(
  mode: IDBTransactionMode,
  run: (store: IDBObjectStore) => IDBRequest<T>,
): Promise<T> {
  return openDb().then(
    (db) =>
      new Promise<T>((resolve, reject) => {
        const transaction = db.transaction(STORE, mode);
        const request = run(transaction.objectStore(STORE));
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
        transaction.oncomplete = () => db.close();
      }),
  );
}

function newId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `img-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

/** Separa los archivos aceptables de los que no cumplen tipo o peso. */
export function screenFiles(files: File[]): {
  accepted: File[];
  rejected: RejectedImage[];
} {
  const accepted: File[] = [];
  const rejected: RejectedImage[] = [];

  for (const file of files) {
    if (!ACCEPTED_TYPES.includes(file.type)) {
      rejected.push({ name: file.name, reason: "formato no admitido (usá JPG, PNG o WebP)" });
    } else if (file.size > MAX_IMAGE_BYTES) {
      rejected.push({ name: file.name, reason: "supera los 8 MB" });
    } else {
      accepted.push(file);
    }
  }

  return { accepted, rejected };
}

/** Guarda los blobs y devuelve la metadata para el borrador. */
export async function saveImages(files: File[]): Promise<DraftImage[]> {
  const saved: DraftImage[] = [];

  for (const file of files) {
    const meta: DraftImage = {
      id: newId(),
      name: file.name,
      size: file.size,
      type: file.type,
    };

    if (hasIndexedDb()) {
      try {
        await tx("readwrite", (store) =>
          store.put({ ...meta, blob: file }) as IDBRequest<IDBValidKey>,
        );
      } catch {
        // Sin persistencia disponible la imagen sigue usable en esta sesión.
      }
    }

    saved.push(meta);
  }

  return saved;
}

/** Recupera los blobs guardados, salteando los que ya no estén. */
export async function loadImageBlobs(ids: string[]): Promise<Map<string, Blob>> {
  const result = new Map<string, Blob>();
  if (!hasIndexedDb()) return result;

  for (const id of ids) {
    try {
      const record = await tx<{ id: string; blob: Blob } | undefined>(
        "readonly",
        (store) => store.get(id) as IDBRequest<{ id: string; blob: Blob } | undefined>,
      );
      if (record?.blob) result.set(id, record.blob);
    } catch {
      // Ignorada: la imagen se muestra como no disponible.
    }
  }

  return result;
}

export async function deleteImage(id: string): Promise<void> {
  if (!hasIndexedDb()) return;
  try {
    await tx("readwrite", (store) => store.delete(id) as unknown as IDBRequest<undefined>);
  } catch {
    // Sin efecto: la metadata igual se saca del borrador.
  }
}

export async function clearImages(): Promise<void> {
  if (!hasIndexedDb()) return;
  try {
    await tx("readwrite", (store) => store.clear() as unknown as IDBRequest<undefined>);
  } catch {
    // Sin efecto.
  }
}
