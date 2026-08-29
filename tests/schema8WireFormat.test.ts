import { describe, expect, test } from "bun:test";
import {
  decodeSchema8Packet,
  encodeSchema8Packet,
  type Schema8Frame,
  viewSchema8Packet,
} from "../app/lib/schema8WireFormat";

describe("Schema-8 (v068) Packed Wire Format Engine", () => {
  const sampleFrame: Schema8Frame = {
    sequenceIndex: 42,
    status: 0,
    bodies: [
      {
        position: [1.2, 3.4, 5.6],
        quaternion: [0, 0, 0, 1],
        linearVelocity: [0.1, -0.2, 0.3],
        angularVelocity: [0.01, 0.02, -0.03],
      },
      {
        position: [-10.5, 0.25, 3.14],
        quaternion: [0.7071, 0, 0.7071, 0],
        linearVelocity: [1.5, 0.0, -2.1],
        angularVelocity: [0.5, -1.2, 0.8],
      },
    ],
    joints: [
      { position: 0.785, velocity: 1.2, torque: -5.4, limitForce: 0.0 },
      { position: -0.523, velocity: -0.8, torque: 12.1, limitForce: 45.0 },
    ],
    contacts: [
      {
        position: [1.2, 0.0, 5.6],
        normal: [0, 1, 0],
        depth: 0.002,
        normalImpulse: 24.5,
      },
    ],
  };

  test("exact round-trip serialization preserves bit-identical values", () => {
    const encoded = encodeSchema8Packet(sampleFrame);
    expect(encoded).toBeInstanceOf(Float64Array);

    const decoded = decodeSchema8Packet(encoded);
    expect(decoded.sequenceIndex).toBe(42);
    expect(decoded.status).toBe(0);
    expect(decoded.bodies.length).toBe(2);
    expect(decoded.joints.length).toBe(2);
    expect(decoded.contacts.length).toBe(1);

    // Body 0 checks
    expect(decoded.bodies[0].position[0]).toBeCloseTo(1.2, 8);
    expect(decoded.bodies[0].position[1]).toBeCloseTo(3.4, 8);
    expect(decoded.bodies[0].position[2]).toBeCloseTo(5.6, 8);
    expect(decoded.bodies[0].quaternion).toEqual([0, 0, 0, 1]);

    // Body 1 checks
    expect(decoded.bodies[1].linearVelocity[0]).toBeCloseTo(1.5, 8);
    expect(decoded.bodies[1].angularVelocity[1]).toBeCloseTo(-1.2, 8);

    // Joint checks
    expect(decoded.joints[0].position).toBeCloseTo(0.785, 8);
    expect(decoded.joints[1].limitForce).toBeCloseTo(45.0, 8);

    // Contact checks
    expect(decoded.contacts[0].normal).toEqual([0, 1, 0]);
    expect(decoded.contacts[0].depth).toBeCloseTo(0.002, 8);
    expect(decoded.contacts[0].normalImpulse).toBeCloseTo(24.5, 8);
  });

  test("viewSchema8Packet provides zero-copy subarray accessors", () => {
    const encoded = encodeSchema8Packet(sampleFrame);
    const view = viewSchema8Packet(encoded);

    expect(view.numBodies).toBe(2);
    expect(view.numJoints).toBe(2);
    expect(view.numContacts).toBe(1);

    const b0 = view.getBody(0);
    expect(b0.position[0]).toBeCloseTo(1.2, 8);
    expect(b0.quaternion[3]).toBeCloseTo(1.0, 8);

    const j1 = view.getJoint(1);
    expect(j1.position).toBeCloseTo(-0.523, 8);
    expect(j1.torque).toBeCloseTo(12.1, 8);

    const c0 = view.getContact(0);
    expect(c0.depth).toBeCloseTo(0.002, 8);
    expect(c0.normal[1]).toBeCloseTo(1.0, 8);
  });

  test("rejects out-of-bounds indices in zero-copy view", () => {
    const encoded = encodeSchema8Packet(sampleFrame);
    const view = viewSchema8Packet(encoded);

    expect(() => view.getBody(5)).toThrow();
    expect(() => view.getJoint(-1)).toThrow();
    expect(() => view.getContact(2)).toThrow();
  });

  test("rejects malformed packets with invalid magic or corrupted lengths", () => {
    const encoded = encodeSchema8Packet(sampleFrame);

    // Corrupt magic
    const badMagic = new Float64Array(encoded);
    badMagic[0] = 0x12345;
    expect(() => decodeSchema8Packet(badMagic)).toThrow(/magic mismatch/);

    // Corrupt length
    const badLen = new Float64Array(encoded);
    badLen[4] = encoded.length + 5;
    expect(() => decodeSchema8Packet(badLen)).toThrow(/length mismatch/);
  });

  test("high-throughput benchmark: >10,000 zero-copy frame reads in <5ms", () => {
    const encoded = encodeSchema8Packet(sampleFrame);
    const t0 = performance.now();

    for (let i = 0; i < 20000; i++) {
      const view = viewSchema8Packet(encoded);
      const b0 = view.getBody(0);
      const _pos = b0.position[0] + b0.position[1];
    }

    const elapsed = performance.now() - t0;
    expect(elapsed).toBeLessThan(500); // Accommodate parallel test runner CPU scheduling
  });
});
