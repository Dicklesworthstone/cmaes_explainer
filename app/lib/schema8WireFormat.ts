// Schema-8 (v068) High-Throughput Wire Format Engine (cmaes-feat-ph7-schema8).
//
// Implements zero-copy Float64Array contiguous packed binary ABI for Frankensim multi-body
// dynamic physics kernel (v068) communication between WebAssembly/Rust and TypeScript/Three.js.
//
// Binary Header Layout (8 words / 64 bytes):
//   [0]: Magic (0x534348454d413038 = 'SCHEMA08')
//   [1]: Schema Version (8.0)
//   [2]: Status (0 = Success, 1 = Refusal / Collision Fault)
//   [3]: Sequence Frame Index
//   [4]: Total Word Count (Float64 elements)
//   [5]: Rigid Body Count (N)
//   [6]: Articulated Joint Count (J)
//   [7]: Contact Manifold Count (C)
//
// Body Block (N x 13 words):
//   Position [x, y, z] (3), Quaternion [qx, qy, qz, qw] (4), Linear Vel [vx, vy, vz] (3), Angular Vel [wx, wy, wz] (3)
//
// Joint Block (J x 4 words):
//   Position [theta] (1), Velocity [dtheta] (1), Torque [tau] (1), Limit Force [f_limit] (1)
//
// Contact Manifold Block (C x 8 words):
//   Position [x, y, z] (3), Normal [nx, ny, nz] (3), Penetration Depth [depth] (1), Normal Impulse [lambda_n] (1)
//
// SOTA References:
//   - FlatBuffers / Protobuf Packed Numeric Vectors
//   - Frankensim CMA-ES Packed Numeric ABI (v068 Spec)

export const SCHEMA_8_MAGIC = 0x534348454d413038; // 'SCHEMA08' as 64-bit integer
export const SCHEMA_8_VERSION = 8;
export const HEADER_WORDS = 8;
export const BODY_STRIDE = 13;
export const JOINT_STRIDE = 4;
export const CONTACT_STRIDE = 8;

export interface RigidBodyState8 {
  position: [number, number, number];
  quaternion: [number, number, number, number]; // [qx, qy, qz, qw]
  linearVelocity: [number, number, number];
  angularVelocity: [number, number, number];
}

export interface JointState8 {
  position: number;
  velocity: number;
  torque: number;
  limitForce: number;
}

export interface ContactPoint8 {
  position: [number, number, number];
  normal: [number, number, number];
  depth: number;
  normalImpulse: number;
}

export interface Schema8Frame {
  sequenceIndex: number;
  status: number;
  bodies: RigidBodyState8[];
  joints: JointState8[];
  contacts: ContactPoint8[];
}

export interface Schema8ZeroCopyView {
  sequenceIndex: number;
  status: number;
  numBodies: number;
  numJoints: number;
  numContacts: number;
  bodyData: Float64Array; // N * 13 slice
  jointData: Float64Array; // J * 4 slice
  contactData: Float64Array; // C * 8 slice
  getBody(index: number): {
    position: Float64Array;
    quaternion: Float64Array;
    linearVelocity: Float64Array;
    angularVelocity: Float64Array;
  };
  getJoint(index: number): {
    position: number;
    velocity: number;
    torque: number;
    limitForce: number;
  };
  getContact(index: number): {
    position: Float64Array;
    normal: Float64Array;
    depth: number;
    normalImpulse: number;
  };
}

/**
 * Packs a high-level Schema8Frame into a contiguous Float64Array.
 */
export function encodeSchema8Packet(frame: Schema8Frame): Float64Array {
  const numBodies = frame.bodies.length;
  const numJoints = frame.joints.length;
  const numContacts = frame.contacts.length;

  const totalWords =
    HEADER_WORDS +
    numBodies * BODY_STRIDE +
    numJoints * JOINT_STRIDE +
    numContacts * CONTACT_STRIDE;

  const buffer = new Float64Array(totalWords);

  // 1. Header
  buffer[0] = SCHEMA_8_MAGIC;
  buffer[1] = SCHEMA_8_VERSION;
  buffer[2] = frame.status;
  buffer[3] = frame.sequenceIndex;
  buffer[4] = totalWords;
  buffer[5] = numBodies;
  buffer[6] = numJoints;
  buffer[7] = numContacts;

  let offset = HEADER_WORDS;

  // 2. Bodies
  for (let i = 0; i < numBodies; i++) {
    const b = frame.bodies[i];
    buffer[offset + 0] = b.position[0];
    buffer[offset + 1] = b.position[1];
    buffer[offset + 2] = b.position[2];

    buffer[offset + 3] = b.quaternion[0];
    buffer[offset + 4] = b.quaternion[1];
    buffer[offset + 5] = b.quaternion[2];
    buffer[offset + 6] = b.quaternion[3];

    buffer[offset + 7] = b.linearVelocity[0];
    buffer[offset + 8] = b.linearVelocity[1];
    buffer[offset + 9] = b.linearVelocity[2];

    buffer[offset + 10] = b.angularVelocity[0];
    buffer[offset + 11] = b.angularVelocity[1];
    buffer[offset + 12] = b.angularVelocity[2];

    offset += BODY_STRIDE;
  }

  // 3. Joints
  for (let j = 0; j < numJoints; j++) {
    const jt = frame.joints[j];
    buffer[offset + 0] = jt.position;
    buffer[offset + 1] = jt.velocity;
    buffer[offset + 2] = jt.torque;
    buffer[offset + 3] = jt.limitForce;
    offset += JOINT_STRIDE;
  }

  // 4. Contacts
  for (let c = 0; c < numContacts; c++) {
    const ct = frame.contacts[c];
    buffer[offset + 0] = ct.position[0];
    buffer[offset + 1] = ct.position[1];
    buffer[offset + 2] = ct.position[2];

    buffer[offset + 3] = ct.normal[0];
    buffer[offset + 4] = ct.normal[1];
    buffer[offset + 5] = ct.normal[2];

    buffer[offset + 6] = ct.depth;
    buffer[offset + 7] = ct.normalImpulse;
    offset += CONTACT_STRIDE;
  }

  return buffer;
}

/**
 * Validates and decodes a Schema-8 Float64Array into a Schema8Frame object.
 */
export function decodeSchema8Packet(buffer: Float64Array): Schema8Frame {
  validateSchema8Buffer(buffer);

  const status = buffer[2];
  const sequenceIndex = buffer[3];
  const numBodies = buffer[5];
  const numJoints = buffer[6];
  const numContacts = buffer[7];

  const bodies: RigidBodyState8[] = new Array(numBodies);
  let offset = HEADER_WORDS;

  for (let i = 0; i < numBodies; i++) {
    bodies[i] = {
      position: [buffer[offset + 0], buffer[offset + 1], buffer[offset + 2]],
      quaternion: [buffer[offset + 3], buffer[offset + 4], buffer[offset + 5], buffer[offset + 6]],
      linearVelocity: [buffer[offset + 7], buffer[offset + 8], buffer[offset + 9]],
      angularVelocity: [buffer[offset + 10], buffer[offset + 11], buffer[offset + 12]],
    };
    offset += BODY_STRIDE;
  }

  const joints: JointState8[] = new Array(numJoints);
  for (let j = 0; j < numJoints; j++) {
    joints[j] = {
      position: buffer[offset + 0],
      velocity: buffer[offset + 1],
      torque: buffer[offset + 2],
      limitForce: buffer[offset + 3],
    };
    offset += JOINT_STRIDE;
  }

  const contacts: ContactPoint8[] = new Array(numContacts);
  for (let c = 0; c < numContacts; c++) {
    contacts[c] = {
      position: [buffer[offset + 0], buffer[offset + 1], buffer[offset + 2]],
      normal: [buffer[offset + 3], buffer[offset + 4], buffer[offset + 5]],
      depth: buffer[offset + 6],
      normalImpulse: buffer[offset + 7],
    };
    offset += CONTACT_STRIDE;
  }

  return {
    sequenceIndex,
    status,
    bodies,
    joints,
    contacts,
  };
}

/**
 * Zero-copy slice view into a Schema-8 Float64Array packet without allocating JS heap objects.
 */
export function viewSchema8Packet(buffer: Float64Array): Schema8ZeroCopyView {
  validateSchema8Buffer(buffer);

  const status = buffer[2];
  const sequenceIndex = buffer[3];
  const numBodies = buffer[5];
  const numJoints = buffer[6];
  const numContacts = buffer[7];

  const bodyStart = HEADER_WORDS;
  const jointStart = bodyStart + numBodies * BODY_STRIDE;
  const contactStart = jointStart + numJoints * JOINT_STRIDE;

  const bodyData = buffer.subarray(bodyStart, jointStart);
  const jointData = buffer.subarray(jointStart, contactStart);
  const contactData = buffer.subarray(contactStart, buffer.length);

  return {
    sequenceIndex,
    status,
    numBodies,
    numJoints,
    numContacts,
    bodyData,
    jointData,
    contactData,
    getBody(index: number) {
      if (index < 0 || index >= numBodies) throw new RangeError("Body index out of range");
      const base = index * BODY_STRIDE;
      return {
        position: bodyData.subarray(base + 0, base + 3),
        quaternion: bodyData.subarray(base + 3, base + 7),
        linearVelocity: bodyData.subarray(base + 7, base + 10),
        angularVelocity: bodyData.subarray(base + 10, base + 13),
      };
    },
    getJoint(index: number) {
      if (index < 0 || index >= numJoints) throw new RangeError("Joint index out of range");
      const base = index * JOINT_STRIDE;
      return {
        position: jointData[base + 0],
        velocity: jointData[base + 1],
        torque: jointData[base + 2],
        limitForce: jointData[base + 3],
      };
    },
    getContact(index: number) {
      if (index < 0 || index >= numContacts) throw new RangeError("Contact index out of range");
      const base = index * CONTACT_STRIDE;
      return {
        position: contactData.subarray(base + 0, base + 3),
        normal: contactData.subarray(base + 3, base + 6),
        depth: contactData[base + 6],
        normalImpulse: contactData[base + 7],
      };
    },
  };
}

function validateSchema8Buffer(buffer: Float64Array): void {
  if (!(buffer instanceof Float64Array) || buffer.length < HEADER_WORDS) {
    throw new Error("malformed Schema-8 packet: buffer too short for header");
  }
  if (buffer[0] !== SCHEMA_8_MAGIC) {
    throw new Error(`malformed Schema-8 packet: magic mismatch (expected 0x${SCHEMA_8_MAGIC.toString(16)}, got ${buffer[0]})`);
  }
  if (buffer[1] !== SCHEMA_8_VERSION) {
    throw new Error(`malformed Schema-8 packet: version mismatch (expected ${SCHEMA_8_VERSION}, got ${buffer[1]})`);
  }
  const totalWords = buffer[4];
  if (totalWords !== buffer.length) {
    throw new Error(`malformed Schema-8 packet: length mismatch (header claims ${totalWords}, buffer has ${buffer.length})`);
  }
  const numBodies = buffer[5];
  const numJoints = buffer[6];
  const numContacts = buffer[7];
  const expectedTotal = HEADER_WORDS + numBodies * BODY_STRIDE + numJoints * JOINT_STRIDE + numContacts * CONTACT_STRIDE;
  if (expectedTotal !== totalWords) {
    throw new Error(`malformed Schema-8 packet: layout size mismatch (expected ${expectedTotal}, got ${totalWords})`);
  }
}
