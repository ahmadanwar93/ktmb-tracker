import protobuf from "protobufjs";

// root is the type registry. It is similar to types.ts file in typescript
// it is a registry of all protobuf message types
// we want to load the schema
let root: protobuf.Root | null = null;

export const initProtobuf = async () => {
  if (root) return root;

  try {
    // this is the blueprint that we need to decode protobuf
    // protobuf is a data serialization format (alternative to json and xml)
    // but much smaller message size
    root = await protobuf.load("/gtfs-realtime.proto");
    // protobuf.load reads the file that specify how to interpret the bytes
    return root;
  } catch (error) {
    throw error;
  }
};

export const decodeGTFSRealtime = async (arrayBuffer: ArrayBuffer) => {
  try {
    if (!root) {
      await initProtobuf();
    }

    // Get the FeedMessage type from the loaded schema (a specific type)
    // FeedMessage is the top level container we received. Use that to decode
    // lookupType returns an object with type information and also methods to use on the data (decode, encode...)
    const FeedMessage = root!.lookupType("transit_realtime.FeedMessage");
    // transit_realtime is a package in the proto file. It is to create namespace

    // Convert ArrayBuffer to Uint8Array
    // Need Uint8Array to access individual bytes of the array buffer
    const uint8Array = new Uint8Array(arrayBuffer);

    const message = FeedMessage.decode(uint8Array);
    // after decoding it, message is an instance of FeedMessage (conforms to the FeedMessage structure)

    const object = FeedMessage.toObject(message, {
      longs: String, // Convert 64-bit integers to strings
      enums: String, // Convert enum values to string names
      bytes: String, // Convert byte arrays to strings
    });

    return object;
  } catch (error) {
    console.error("❌ Failed to decode protobuf:", error);
    throw error;
  }
};
