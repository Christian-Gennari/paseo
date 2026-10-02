import { open, stat, type FileHandle } from "node:fs/promises";

const MAX_VARINT_BYTES = 10;
const MAX_TOP_LEVEL_FIELDS = 4096;

const WIRE_VARINT = 0;
const WIRE_FIXED64 = 1;
const WIRE_LENGTH_DELIMITED = 2;
const WIRE_FIXED32 = 5;

async function readVarint(
  handle: FileHandle,
  position: number,
): Promise<{ value: bigint; nextPosition: number } | null> {
  const buffer = Buffer.alloc(MAX_VARINT_BYTES);
  const { bytesRead } = await handle.read(buffer, 0, MAX_VARINT_BYTES, position);
  let value = 0n;
  for (let index = 0; index < bytesRead; index++) {
    const byte = buffer[index];
    value |= BigInt(byte & 0x7f) << BigInt(7 * index);
    if ((byte & 0x80) === 0) {
      return { value, nextPosition: position + index + 1 };
    }
  }
  return null;
}

/**
 * An ONNX file is one serialized protobuf message. Walk its top-level fields
 * and require them to end exactly at the end of the file. This reads a few
 * bytes per field, so it stays cheap for multi-hundred-megabyte models, and it
 * rejects the corruption that makes the native loader abort the process:
 * truncated extractions and non-model content such as an HTML error page.
 */
export async function isStructurallyValidOnnxFile(filePath: string): Promise<boolean> {
  let handle: FileHandle;
  try {
    handle = await open(filePath, "r");
  } catch {
    return false;
  }
  try {
    const { size } = await handle.stat();
    if (size === 0) {
      return false;
    }
    let position = 0;
    for (let fields = 0; position < size; fields++) {
      if (fields >= MAX_TOP_LEVEL_FIELDS) {
        return false;
      }
      const tag = await readVarint(handle, position);
      if (!tag || tag.value >> 3n === 0n) {
        return false;
      }
      position = tag.nextPosition;
      const wireType = Number(tag.value & 7n);
      if (wireType === WIRE_VARINT) {
        const value = await readVarint(handle, position);
        if (!value) {
          return false;
        }
        position = value.nextPosition;
      } else if (wireType === WIRE_FIXED64) {
        position += 8;
      } else if (wireType === WIRE_FIXED32) {
        position += 4;
      } else if (wireType === WIRE_LENGTH_DELIMITED) {
        const length = await readVarint(handle, position);
        if (!length || length.value > BigInt(size)) {
          return false;
        }
        position = length.nextPosition + Number(length.value);
      } else {
        return false;
      }
    }
    return position === size;
  } catch {
    return false;
  } finally {
    await handle.close().catch(() => undefined);
  }
}

/**
 * Whether a required model artifact is present and usable. Directories only
 * need to exist, `.onnx` files must be structurally valid, and anything else
 * must be a non-empty file.
 */
export async function isUsableLocalModelFile(filePath: string): Promise<boolean> {
  try {
    const fileStat = await stat(filePath);
    if (fileStat.isDirectory()) {
      return true;
    }
    if (!fileStat.isFile() || fileStat.size === 0) {
      return false;
    }
  } catch {
    return false;
  }
  if (filePath.endsWith(".onnx")) {
    return isStructurallyValidOnnxFile(filePath);
  }
  return true;
}
