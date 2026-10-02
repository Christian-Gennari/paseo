import { describe, expect, test } from "vitest";
import { mkdtempSync, mkdirSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import pino from "pino";

import { ensureSherpaOnnxModel, getSherpaOnnxModelDir } from "./model-downloader.js";
import { isStructurallyValidOnnxFile } from "./onnx-file-check.js";

function makeTmpDir(): string {
  return mkdtempSync(path.join(tmpdir(), "paseo-speech-models-"));
}

const logger = pino({ level: "silent" });

// ModelProto { ir_version: 7 }
const MINIMAL_ONNX = Buffer.from([0x08, 0x07]);
// ir_version, then a `graph` field declaring 16 bytes with only 2 present.
const TRUNCATED_ONNX = Buffer.from([0x08, 0x07, 0x3a, 0x10, 0x01, 0x02]);

describe("sherpa model downloader", () => {
  test("getSherpaOnnxModelDir maps modelId to extractedDir", () => {
    const modelsDir = "/tmp/models";
    expect(getSherpaOnnxModelDir(modelsDir, "parakeet-tdt-0.6b-v2-int8")).toContain(
      "sherpa-onnx-nemo-parakeet-tdt-0.6b-v2-int8",
    );
    expect(getSherpaOnnxModelDir(modelsDir, "kokoro-en-v0_19")).toContain("kokoro-en-v0_19");
  });

  test("ensureSherpaOnnxModel succeeds without downloading when files exist", async () => {
    const modelsDir = makeTmpDir();
    const modelDir = getSherpaOnnxModelDir(modelsDir, "kokoro-en-v0_19");

    mkdirSync(path.join(modelDir, "espeak-ng-data"), { recursive: true });
    writeFileSync(path.join(modelDir, "model.onnx"), MINIMAL_ONNX);
    writeFileSync(path.join(modelDir, "voices.bin"), "x");
    writeFileSync(path.join(modelDir, "tokens.txt"), "x");

    const out = await ensureSherpaOnnxModel({
      modelsDir,
      modelId: "kokoro-en-v0_19",
      logger,
    });

    expect(out).toBe(modelDir);
  });

  test("ensureSherpaOnnxModel treats a truncated onnx file as missing", async () => {
    const modelsDir = makeTmpDir();
    const modelDir = getSherpaOnnxModelDir(modelsDir, "kokoro-en-v0_19");

    mkdirSync(path.join(modelDir, "espeak-ng-data"), { recursive: true });
    writeFileSync(path.join(modelDir, "model.onnx"), TRUNCATED_ONNX);
    writeFileSync(path.join(modelDir, "voices.bin"), "x");
    writeFileSync(path.join(modelDir, "tokens.txt"), "x");

    const controller = new AbortController();
    controller.abort();

    // Falling through to the download is what proves the file was rejected; the
    // pre-aborted signal stops it before any network request.
    await expect(
      ensureSherpaOnnxModel({
        modelsDir,
        modelId: "kokoro-en-v0_19",
        logger,
        signal: controller.signal,
      }),
    ).rejects.toThrow();
  });
});

describe("isStructurallyValidOnnxFile", () => {
  function writeTmpFile(content: Buffer | string): string {
    const filePath = path.join(makeTmpDir(), "model.onnx");
    writeFileSync(filePath, content);
    return filePath;
  }

  test("accepts a complete protobuf message", async () => {
    expect(await isStructurallyValidOnnxFile(writeTmpFile(MINIMAL_ONNX))).toBe(true);
  });

  test("rejects a truncated message", async () => {
    expect(await isStructurallyValidOnnxFile(writeTmpFile(TRUNCATED_ONNX))).toBe(false);
  });

  test("rejects non-model content", async () => {
    expect(await isStructurallyValidOnnxFile(writeTmpFile("<html>Not Found</html>"))).toBe(false);
  });

  test("rejects empty and missing files", async () => {
    expect(await isStructurallyValidOnnxFile(writeTmpFile(""))).toBe(false);
    expect(await isStructurallyValidOnnxFile(path.join(makeTmpDir(), "absent.onnx"))).toBe(false);
  });
});
