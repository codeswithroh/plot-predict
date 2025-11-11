'use strict';

var viem = require('viem');

// src/services/viem/index.ts
var w = class {
  constructor(e) {
    this.chainId = 0;
    this.client = e;
  }
  async getChainId() {
    return this.chainId === 0 && (this.chainId = await this.client.public.getChainId()), this.chainId;
  }
  getContract(e) {
    return viem.getContract({
      address: e.address,
      abi: e.abi,
      client: this.client.public
    });
  }
  async readContract(e, t, n, a = []) {
    return this.client.public.readContract({
      address: e,
      abi: t,
      functionName: n,
      args: a
    });
  }
  async writeContract(e, t, n, a = [], r = BigInt(0)) {
    if (!this.client.wallet)
      return null;
    let s = this.client.wallet.account ?? null;
    return this.client.wallet.writeContract({
      address: e,
      abi: t,
      functionName: n,
      args: a,
      value: r,
      account: s,
      chain: this.client.wallet.chain
    });
  }
  async waitForTransaction(e) {
    return this.client.public.waitForTransactionReceipt({
      hash: e
    });
  }
  async getCurrentAccounts() {
    if (!this.client.wallet)
      throw new Error("No wallet client");
    let e = [];
    if (this.client.wallet.account)
      e.push(this.client.wallet.account.address);
    else
      try {
        e = await this.client.wallet.getAddresses();
      } catch {
      }
    if (e.length === 0)
      throw new Error("No wallets detected");
    return e;
  }
};
var L = {
  "5031": viem.zeroAddress,
  "50312": viem.getAddress(
    "0x6AB397FF662e42312c003175DCD76EfF69D048Fc"
  )
}, V = {
  STREAMS: L
};
async function A(i) {
  if (i.internal && i.chainId)
    return V[i.internal][i.chainId.toString()] ?? null;
  if (i.address) {
    if (!viem.isAddress(i.address, { strict: false }))
      throw new Error("Invalid address supplied");
    return i.address;
  }
  return null;
}

// src/services/smart-contracts/abi/Streams/index.ts
async function x() {
  return [
    {
      inputs: [
        {
          internalType: "address",
          name: "initialOwner",
          type: "address"
        }
      ],
      stateMutability: "nonpayable",
      type: "constructor"
    },
    {
      inputs: [],
      name: "EventSchemaAlreadyRegistered",
      type: "error"
    },
    {
      inputs: [],
      name: "EventSchemaNotRegistered",
      type: "error"
    },
    {
      inputs: [],
      name: "EventTopicAlreadyRegistered",
      type: "error"
    },
    {
      inputs: [],
      name: "IDAlreadyUsed",
      type: "error"
    },
    {
      inputs: [],
      name: "IdentityAlreadyExists",
      type: "error"
    },
    {
      inputs: [],
      name: "IdentityDoesNotExist",
      type: "error"
    },
    {
      inputs: [],
      name: "IncorrectNumberOfTopics",
      type: "error"
    },
    {
      inputs: [],
      name: "InvalidArrayLength",
      type: "error"
    },
    {
      inputs: [],
      name: "InvalidDataLength",
      type: "error"
    },
    {
      inputs: [],
      name: "InvalidIdentity",
      type: "error"
    },
    {
      inputs: [],
      name: "InvalidIndex",
      type: "error"
    },
    {
      inputs: [],
      name: "InvalidRange",
      type: "error"
    },
    {
      inputs: [],
      name: "InvalidSelfReference",
      type: "error"
    },
    {
      inputs: [],
      name: "InvalidSize",
      type: "error"
    },
    {
      inputs: [],
      name: "MaxArrayLengthExceeded",
      type: "error"
    },
    {
      inputs: [],
      name: "NoCalldata",
      type: "error"
    },
    {
      inputs: [],
      name: "NoData",
      type: "error"
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "owner",
          type: "address"
        }
      ],
      name: "OwnableInvalidOwner",
      type: "error"
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "account",
          type: "address"
        }
      ],
      name: "OwnableUnauthorizedAccount",
      type: "error"
    },
    {
      inputs: [],
      name: "ParentSchemaNotRegistered",
      type: "error"
    },
    {
      inputs: [],
      name: "SchemaAlreadyRegistered",
      type: "error"
    },
    {
      inputs: [],
      name: "SchemaNotRegistered",
      type: "error"
    },
    {
      inputs: [],
      name: "TooManyIndexedParams",
      type: "error"
    },
    {
      inputs: [],
      name: "TooManyTopics",
      type: "error"
    },
    {
      inputs: [],
      name: "Unauthorized",
      type: "error"
    },
    {
      inputs: [],
      name: "ZeroValue",
      type: "error"
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: "bytes32",
          name: "schemaId",
          type: "bytes32"
        },
        {
          indexed: true,
          internalType: "address",
          name: "publisher",
          type: "address"
        },
        {
          indexed: true,
          internalType: "bytes32",
          name: "dataId",
          type: "bytes32"
        }
      ],
      name: "ESStoreEvent",
      type: "event"
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: "bytes32",
          name: "eventTopic",
          type: "bytes32"
        },
        {
          indexed: true,
          internalType: "address",
          name: "emitter",
          type: "address"
        },
        {
          indexed: false,
          internalType: "bool",
          name: "isEmitter",
          type: "bool"
        }
      ],
      name: "EmitterUpdated",
      type: "event"
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: "address",
          name: "wallet",
          type: "address"
        }
      ],
      name: "IdentityCreated",
      type: "event"
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: "address",
          name: "wallet",
          type: "address"
        }
      ],
      name: "IdentityDeleted",
      type: "event"
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: false,
          internalType: "enum RoleControl.Role",
          name: "role",
          type: "uint8"
        },
        {
          indexed: false,
          internalType: "bool",
          name: "isOpen",
          type: "bool"
        }
      ],
      name: "IsRoleOpenSet",
      type: "event"
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: "address",
          name: "previousOwner",
          type: "address"
        },
        {
          indexed: true,
          internalType: "address",
          name: "newOwner",
          type: "address"
        }
      ],
      name: "OwnershipTransferred",
      type: "event"
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: false,
          internalType: "bool",
          name: "bypassed",
          type: "bool"
        }
      ],
      name: "RoleChecksBypassToggled",
      type: "event"
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: "address",
          name: "wallet",
          type: "address"
        },
        {
          indexed: true,
          internalType: "enum RoleControl.Role",
          name: "role",
          type: "uint8"
        }
      ],
      name: "RoleGranted",
      type: "event"
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: "address",
          name: "wallet",
          type: "address"
        },
        {
          indexed: true,
          internalType: "enum RoleControl.Role",
          name: "role",
          type: "uint8"
        }
      ],
      name: "RoleRevoked",
      type: "event"
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: "bytes32",
          name: "schemaId",
          type: "bytes32"
        }
      ],
      name: "SchemaRegistered",
      type: "event"
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: "bytes32",
          name: "eventTopic",
          type: "bytes32"
        },
        {
          indexed: false,
          internalType: "string",
          name: "id",
          type: "string"
        }
      ],
      name: "SchemaRegistered",
      type: "event"
    },
    {
      inputs: [],
      name: "MAX_NUM_EVM_INDEXED_PARAMS",
      outputs: [
        {
          internalType: "uint256",
          name: "",
          type: "uint256"
        }
      ],
      stateMutability: "view",
      type: "function"
    },
    {
      inputs: [],
      name: "bypassRoleChecks",
      outputs: [
        {
          internalType: "bool",
          name: "",
          type: "bool"
        }
      ],
      stateMutability: "view",
      type: "function"
    },
    {
      inputs: [
        {
          internalType: "string",
          name: "schemaSpec",
          type: "string"
        }
      ],
      name: "computeSchemaId",
      outputs: [
        {
          internalType: "bytes32",
          name: "",
          type: "bytes32"
        }
      ],
      stateMutability: "pure",
      type: "function"
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "walletAddress",
          type: "address"
        },
        {
          internalType: "enum RoleControl.Role[]",
          name: "initialRoles",
          type: "uint8[]"
        }
      ],
      name: "createWalletIdentity",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function"
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "wallet",
          type: "address"
        }
      ],
      name: "deleteIdentity",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function"
    },
    {
      inputs: [
        {
          components: [
            {
              internalType: "string",
              name: "id",
              type: "string"
            },
            {
              internalType: "bytes32[]",
              name: "argumentTopics",
              type: "bytes32[]"
            },
            {
              internalType: "bytes",
              name: "data",
              type: "bytes"
            }
          ],
          internalType: "struct EventSource.EventData[]",
          name: "events",
          type: "tuple[]"
        }
      ],
      name: "emitEvents",
      outputs: [
        {
          internalType: "bool",
          name: "success",
          type: "bool"
        }
      ],
      stateMutability: "nonpayable",
      type: "function"
    },
    {
      inputs: [
        {
          components: [
            {
              internalType: "bytes32",
              name: "id",
              type: "bytes32"
            },
            {
              internalType: "bytes32",
              name: "schemaId",
              type: "bytes32"
            },
            {
              internalType: "bytes",
              name: "data",
              type: "bytes"
            }
          ],
          internalType: "struct DataSchemaLibrary.DataStream[]",
          name: "dataStreams",
          type: "tuple[]"
        }
      ],
      name: "esstores",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function"
    },
    {
      inputs: [
        {
          internalType: "bytes32",
          name: "topic",
          type: "bytes32"
        }
      ],
      name: "eventIdFromTopic",
      outputs: [
        {
          internalType: "string",
          name: "id",
          type: "string"
        }
      ],
      stateMutability: "view",
      type: "function"
    },
    {
      inputs: [],
      name: "getAllIdentities",
      outputs: [
        {
          components: [
            {
              internalType: "address",
              name: "walletAddress",
              type: "address"
            },
            {
              internalType: "enum RoleControl.Role[]",
              name: "roles",
              type: "uint8[]"
            }
          ],
          internalType: "struct RoleControl.IdentityView[]",
          name: "",
          type: "tuple[]"
        }
      ],
      stateMutability: "view",
      type: "function"
    },
    {
      inputs: [
        {
          internalType: "bytes32",
          name: "schemaId",
          type: "bytes32"
        },
        {
          internalType: "address",
          name: "publisher",
          type: "address"
        }
      ],
      name: "getAllPublisherDataForSchema",
      outputs: [
        {
          internalType: "bytes[]",
          name: "",
          type: "bytes[]"
        }
      ],
      stateMutability: "view",
      type: "function"
    },
    {
      inputs: [],
      name: "getAllRegisteredEventIds",
      outputs: [
        {
          internalType: "string[]",
          name: "",
          type: "string[]"
        }
      ],
      stateMutability: "view",
      type: "function"
    },
    {
      inputs: [],
      name: "getAllSchemas",
      outputs: [
        {
          internalType: "string[]",
          name: "",
          type: "string[]"
        }
      ],
      stateMutability: "view",
      type: "function"
    },
    {
      inputs: [],
      name: "getAllWallets",
      outputs: [
        {
          internalType: "address[]",
          name: "",
          type: "address[]"
        }
      ],
      stateMutability: "view",
      type: "function"
    },
    {
      inputs: [
        {
          internalType: "uint256",
          name: "idx",
          type: "uint256"
        }
      ],
      name: "getEventIdAtIndex",
      outputs: [
        {
          internalType: "string",
          name: "",
          type: "string"
        }
      ],
      stateMutability: "view",
      type: "function"
    },
    {
      inputs: [
        {
          internalType: "string[]",
          name: "ids",
          type: "string[]"
        }
      ],
      name: "getEventSchemasById",
      outputs: [
        {
          components: [
            {
              components: [
                {
                  internalType: "string",
                  name: "name",
                  type: "string"
                },
                {
                  internalType: "string",
                  name: "paramType",
                  type: "string"
                },
                {
                  internalType: "bool",
                  name: "isIndexed",
                  type: "bool"
                }
              ],
              internalType: "struct EventSource.Parameter[]",
              name: "params",
              type: "tuple[]"
            },
            {
              internalType: "bytes32",
              name: "eventTopic",
              type: "bytes32"
            }
          ],
          internalType: "struct EventSource.EventSchema[]",
          name: "schemas",
          type: "tuple[]"
        }
      ],
      stateMutability: "view",
      type: "function"
    },
    {
      inputs: [
        {
          internalType: "bytes32",
          name: "schemaId",
          type: "bytes32"
        },
        {
          internalType: "address",
          name: "publisher",
          type: "address"
        }
      ],
      name: "getLastPublishedDataForSchema",
      outputs: [
        {
          internalType: "bytes",
          name: "",
          type: "bytes"
        }
      ],
      stateMutability: "view",
      type: "function"
    },
    {
      inputs: [
        {
          internalType: "bytes32",
          name: "schemaId",
          type: "bytes32"
        },
        {
          internalType: "address",
          name: "publisher",
          type: "address"
        },
        {
          internalType: "uint256",
          name: "idx",
          type: "uint256"
        }
      ],
      name: "getPublisherDataForSchemaAtIndex",
      outputs: [
        {
          internalType: "bytes",
          name: "",
          type: "bytes"
        }
      ],
      stateMutability: "view",
      type: "function"
    },
    {
      inputs: [
        {
          internalType: "bytes32",
          name: "schemaId",
          type: "bytes32"
        },
        {
          internalType: "address",
          name: "publisher",
          type: "address"
        },
        {
          internalType: "uint256",
          name: "start",
          type: "uint256"
        },
        {
          internalType: "uint256",
          name: "end",
          type: "uint256"
        }
      ],
      name: "getPublisherDataForSchemaInRange",
      outputs: [
        {
          internalType: "bytes[]",
          name: "",
          type: "bytes[]"
        }
      ],
      stateMutability: "view",
      type: "function"
    },
    {
      inputs: [
        {
          internalType: "uint256",
          name: "idx",
          type: "uint256"
        }
      ],
      name: "getSchema",
      outputs: [
        {
          internalType: "bytes32",
          name: "schemaId",
          type: "bytes32"
        },
        {
          internalType: "bytes32",
          name: "parentSchemaId_",
          type: "bytes32"
        },
        {
          internalType: "string",
          name: "schema",
          type: "string"
        }
      ],
      stateMutability: "view",
      type: "function"
    },
    {
      inputs: [],
      name: "getTotalNumberOfRegisteredEventSchemas",
      outputs: [
        {
          internalType: "uint256",
          name: "",
          type: "uint256"
        }
      ],
      stateMutability: "view",
      type: "function"
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "wallet",
          type: "address"
        },
        {
          internalType: "enum RoleControl.Role",
          name: "role",
          type: "uint8"
        }
      ],
      name: "grantRole",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function"
    },
    {
      inputs: [
        {
          internalType: "string",
          name: "id",
          type: "string"
        }
      ],
      name: "idToSchemaId",
      outputs: [
        {
          internalType: "bytes32",
          name: "schemaId",
          type: "bytes32"
        }
      ],
      stateMutability: "view",
      type: "function"
    },
    {
      inputs: [
        {
          internalType: "bytes32",
          name: "topic",
          type: "bytes32"
        },
        {
          internalType: "address",
          name: "caller",
          type: "address"
        }
      ],
      name: "isCallerAuthorisedEmitter",
      outputs: [
        {
          internalType: "bool",
          name: "isEmitter",
          type: "bool"
        }
      ],
      stateMutability: "view",
      type: "function"
    },
    {
      inputs: [
        {
          internalType: "bytes32",
          name: "schemaId",
          type: "bytes32"
        }
      ],
      name: "isSchemaRegistered",
      outputs: [
        {
          internalType: "bool",
          name: "isRegistered",
          type: "bool"
        }
      ],
      stateMutability: "view",
      type: "function"
    },
    {
      inputs: [
        {
          internalType: "string",
          name: "id",
          type: "string"
        },
        {
          internalType: "address",
          name: "emitter",
          type: "address"
        },
        {
          internalType: "bool",
          name: "isEmitter",
          type: "bool"
        }
      ],
      name: "manageEventEmitter",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function"
    },
    {
      inputs: [],
      name: "owner",
      outputs: [
        {
          internalType: "address",
          name: "",
          type: "address"
        }
      ],
      stateMutability: "view",
      type: "function"
    },
    {
      inputs: [
        {
          internalType: "bytes32",
          name: "schemaId",
          type: "bytes32"
        }
      ],
      name: "parentSchemaId",
      outputs: [
        {
          internalType: "bytes32",
          name: "parent",
          type: "bytes32"
        }
      ],
      stateMutability: "view",
      type: "function"
    },
    {
      inputs: [
        {
          components: [
            {
              internalType: "bytes32",
              name: "id",
              type: "bytes32"
            },
            {
              internalType: "bytes32",
              name: "schemaId",
              type: "bytes32"
            },
            {
              internalType: "bytes",
              name: "data",
              type: "bytes"
            }
          ],
          internalType: "struct DataSchemaLibrary.DataStream[]",
          name: "dataStreams",
          type: "tuple[]"
        },
        {
          components: [
            {
              internalType: "string",
              name: "id",
              type: "string"
            },
            {
              internalType: "bytes32[]",
              name: "argumentTopics",
              type: "bytes32[]"
            },
            {
              internalType: "bytes",
              name: "data",
              type: "bytes"
            }
          ],
          internalType: "struct EventSource.EventData[]",
          name: "events",
          type: "tuple[]"
        }
      ],
      name: "publishDataAndEmitEvents",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function"
    },
    {
      inputs: [
        {
          internalType: "bytes32",
          name: "schemaId",
          type: "bytes32"
        },
        {
          internalType: "address",
          name: "publisher",
          type: "address"
        },
        {
          internalType: "bytes32",
          name: "key",
          type: "bytes32"
        }
      ],
      name: "publisherDataExists",
      outputs: [
        {
          internalType: "bool",
          name: "exists",
          type: "bool"
        }
      ],
      stateMutability: "view",
      type: "function"
    },
    {
      inputs: [
        {
          internalType: "bytes32",
          name: "schemaId",
          type: "bytes32"
        },
        {
          internalType: "address",
          name: "publisher",
          type: "address"
        },
        {
          internalType: "bytes32",
          name: "key",
          type: "bytes32"
        }
      ],
      name: "publisherDataIndex",
      outputs: [
        {
          internalType: "uint256",
          name: "index",
          type: "uint256"
        }
      ],
      stateMutability: "view",
      type: "function"
    },
    {
      inputs: [
        {
          internalType: "string[]",
          name: "ids",
          type: "string[]"
        },
        {
          components: [
            {
              components: [
                {
                  internalType: "string",
                  name: "name",
                  type: "string"
                },
                {
                  internalType: "string",
                  name: "paramType",
                  type: "string"
                },
                {
                  internalType: "bool",
                  name: "isIndexed",
                  type: "bool"
                }
              ],
              internalType: "struct EventSource.Parameter[]",
              name: "params",
              type: "tuple[]"
            },
            {
              internalType: "bytes32",
              name: "eventTopic",
              type: "bytes32"
            }
          ],
          internalType: "struct EventSource.EventSchema[]",
          name: "schemas",
          type: "tuple[]"
        }
      ],
      name: "registerEventSchemas",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function"
    },
    {
      inputs: [
        {
          components: [
            {
              internalType: "string",
              name: "id",
              type: "string"
            },
            {
              internalType: "string",
              name: "schema",
              type: "string"
            },
            {
              internalType: "bytes32",
              name: "parentSchemaId",
              type: "bytes32"
            }
          ],
          internalType: "struct DataSchemaLibrary.SchemaRegistration[]",
          name: "schemaRegistrations",
          type: "tuple[]"
        }
      ],
      name: "registerSchemas",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function"
    },
    {
      inputs: [],
      name: "renounceOwnership",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function"
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "wallet",
          type: "address"
        },
        {
          internalType: "enum RoleControl.Role",
          name: "role",
          type: "uint8"
        }
      ],
      name: "revokeRole",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function"
    },
    {
      inputs: [
        {
          internalType: "bytes32",
          name: "schemaId",
          type: "bytes32"
        }
      ],
      name: "schemaIdToId",
      outputs: [
        {
          internalType: "string",
          name: "id",
          type: "string"
        }
      ],
      stateMutability: "view",
      type: "function"
    },
    {
      inputs: [
        {
          internalType: "bytes32",
          name: "schemaId",
          type: "bytes32"
        }
      ],
      name: "schemaReverseLookup",
      outputs: [
        {
          internalType: "string",
          name: "schema",
          type: "string"
        }
      ],
      stateMutability: "view",
      type: "function"
    },
    {
      inputs: [
        {
          internalType: "bool",
          name: "bypass",
          type: "bool"
        }
      ],
      name: "setBypassRoleChecks",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function"
    },
    {
      inputs: [
        {
          internalType: "enum RoleControl.Role",
          name: "role",
          type: "uint8"
        },
        {
          internalType: "bool",
          name: "isOpen",
          type: "bool"
        }
      ],
      name: "setIsRoleOpen",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function"
    },
    {
      inputs: [
        {
          internalType: "bytes32",
          name: "topic",
          type: "bytes32"
        }
      ],
      name: "topicRegistrationOrigin",
      outputs: [
        {
          internalType: "address",
          name: "origin",
          type: "address"
        }
      ],
      stateMutability: "view",
      type: "function"
    },
    {
      inputs: [
        {
          internalType: "bytes32",
          name: "schemaId",
          type: "bytes32"
        },
        {
          internalType: "address",
          name: "publisher",
          type: "address"
        }
      ],
      name: "totalPublisherDataForSchema",
      outputs: [
        {
          internalType: "uint256",
          name: "",
          type: "uint256"
        }
      ],
      stateMutability: "view",
      type: "function"
    },
    {
      inputs: [],
      name: "totalSchemasRegistered",
      outputs: [
        {
          internalType: "uint256",
          name: "",
          type: "uint256"
        }
      ],
      stateMutability: "view",
      type: "function"
    },
    {
      inputs: [
        {
          internalType: "bytes32",
          name: "topic",
          type: "bytes32"
        }
      ],
      name: "totalTopicIndexedParams",
      outputs: [
        {
          internalType: "uint256",
          name: "indexedParams",
          type: "uint256"
        }
      ],
      stateMutability: "view",
      type: "function"
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "newOwner",
          type: "address"
        }
      ],
      name: "transferOwnership",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function"
    }
  ];
}
async function C(i) {
  if (i.internal)
    switch (i.internal) {
      case "STREAMS":
        return x();
    }
  else if (i.address)
    throw viem.isAddress(i.address, { strict: false }) ? new Error("Feature not implemented") : new Error("Invalid address supplied");
}

// src/types/utils/index.ts
function g(i) {
  let e = i.internal ? `${i.internal}` : "UnknownContract", t = i.address ? `${i.address}` : "InvalidAddress";
  return `${i.chainId}:${e}:${t}`;
}
async function c(i) {
  let e = await C(i);
  if (!e)
    throw new Error(`Unable to resolve ABI for ${g(i)}`);
  let t = await A(i);
  if (!t)
    throw new Error(`Unable to resolve contract address for ${g(i)}`);
  if (!viem.isAddress(t, { strict: false }))
    throw new Error(`Invalid contract address for ${g(i)}`);
  if (viem.isAddressEqual(t, viem.zeroAddress))
    throw new Error(`No contract connected for ${g(i)}`);
  return {
    abi: e,
    address: t
  };
}
function h(i, e) {
  let t = null;
  if (i instanceof viem.BaseError) {
    let n = i.walk(
      (a) => a instanceof viem.ContractFunctionRevertedError
    );
    if (n instanceof viem.ContractFunctionRevertedError) {
      let a = n.data?.errorName ?? "UnknownError";
      console.log({ errorType: "Contract Error", context: e, errorName: a }), t = new Error(a);
    }
  }
  return t;
}
var Z = "tuple", I = "bytes32", J = "address", Q = "bool", D = "ipfsHash";
function P(i) {
  return i.map((e) => "components" in e ? {
    type: e.type,
    components: P(e.components ?? [])
  } : { type: e.type });
}
var b = class i {
  constructor(e) {
    this.schema = [];
    let t = e.replace(new RegExp(`${D} (\\S+)`, "g"), `${I} $1`), n = viem.parseAbi([`function func(${t})`]);
    this.abiParams = n[0].inputs, this.abiParamsNoNames = P(this.abiParams);
    for (let a of this.abiParams) {
      let r = a.type, s = a.name ? `${a.type} ${a.name}` : a.type, o = a.name ? ` ${a.name}` : "", l = r, p = r.endsWith("[]"), m = [];
      if (r.startsWith(Z)) {
        if (!("components" in a)) throw new Error("Missing components for tuple type");
        m = a.components ?? [], r = `(${m.map((u) => u.type).join(",")})${p ? "[]" : ""}`, s = `(${m.map((u) => u.name ? `${u.type} ${u.name}` : u.type).join(",")})${p ? "[]" : ""}${o}`;
      } else r.includes("[]") && (l = l.replace("[]", ""));
      let d = i.getDefaultValueForTypeName(l);
      this.schema.push({
        name: a.name ?? "",
        type: r,
        signature: s,
        value: r.includes("[]") ? [] : d
      });
    }
  }
  encodeData(e) {
    if (e.length !== this.schema.length)
      throw new Error("Invalid number or values");
    let t = [];
    for (let [n, a] of this.schema.entries()) {
      let { type: r, name: s, value: o } = e[n], l = r.replace(/\s/g, "");
      if (l !== a.type && l !== a.signature && !(l === D && a.type === I))
        throw new Error(`Incompatible param type: ${l}`);
      if (s !== a.name)
        throw new Error(`Incompatible param name: ${s}`);
      t.push(
        a.type === I && typeof o == "string" && !viem.isHex(o) ? viem.stringToHex(o, { size: 32 }) : o
      );
    }
    return viem.encodeAbiParameters(this.abiParams, t);
  }
  decodeData(e) {
    let t = viem.decodeAbiParameters(this.abiParamsNoNames, e);
    return this.schema.map((n, a) => {
      let r = t[a], s = this.abiParams[a], o = "components" in s ? s.components ?? [] : [];
      if (o.length > 0)
        if (s.type.endsWith("[]")) {
          let l = [];
          for (let p of r) {
            let m = [];
            for (let [d, u] of p.entries()) {
              let v = o[d];
              m.push({ name: v.name ?? "", type: v.type, value: u });
            }
            l.push(m);
          }
          r = {
            name: n.name,
            type: n.type,
            value: l
          };
        } else {
          let l = [];
          for (let [p, m] of r.entries()) {
            let d = o[p];
            l.push({ name: d.name ?? "", type: d.type, value: m });
          }
          r = {
            name: n.name,
            type: n.type,
            value: l
          };
        }
      else
        r = { name: n.name, type: n.type, value: r };
      return {
        name: n.name,
        type: n.type,
        signature: n.signature,
        value: r
      };
    });
  }
  static isSchemaValid(e) {
    try {
      return new i(e), !0;
    } catch {
      return false;
    }
  }
  isEncodedDataValid(e) {
    try {
      return this.decodeData(e), !0;
    } catch {
      return false;
    }
  }
  static getDefaultValueForTypeName(e) {
    return e === Q ? false : e.includes("int") ? BigInt(0) : e === J ? viem.zeroAddress : "";
  }
};
var T = `0x${Buffer.from(viem.toBytes(0, { size: 32 })).toString("hex")}`;
function y(i, e) {
  if (!viem.isAddress(i, { strict: false }))
    throw new Error("Invalid address");
  if (viem.isAddressEqual(i, viem.zeroAddress))
    throw new Error("Zero address supplied");
}

// src/modules/streams/index.ts
var S = class {
  constructor(e) {
    this.viem = new w(e);
  }
  /**
   * Adjust the accounts that can emit registered streams event schemas
   * @dev By default, the wallet that registers an event is a defacto emitter but more can be added
   * @dev If one wants the event to be open to all to emit, one could whitelist a smart contract and manage access externally
   * @param streamsEventId Identifier of the registered streams event
   * @param emitter Wallet address
   * @param isEmitter Flag to enable or disable the emitter
   * @returns Transaction hash if successful, Error object where applicable or null in catch all error case
   */
  async manageEventEmittersForRegisteredStreamsEvent(e, t, n) {
    y(t);
    try {
      let a = await this.viem.getChainId(), {
        address: r,
        abi: s
      } = await c({
        internal: "STREAMS",
        chainId: a
      });
      return this.viem.writeContract(
        r,
        s,
        "manageEventEmitter",
        [e, t, n]
      );
    } catch (a) {
      if (console.log("manageEventEmitter failure", a), h(a, "Failed to manage event emitter"), a instanceof Error)
        return a;
    }
    return null;
  }
  /**
   * Publish on-chain state updates and emit associated events
   * @dev Note that the state will be written to chain before any event(s) is/are emitted
   * @param dataStreams Bytes stream array that has unique keys referencing schemas
   * @param eventStreams Somnia stream event ids and associated arguments to emit EVM logs
   * @returns Transaction hash if successful, Error object where applicable or null in catch all error case
   */
  async setAndEmitEvents(e, t) {
    try {
      let n = await this.viem.getChainId(), {
        address: a,
        abi: r
      } = await c({
        internal: "STREAMS",
        chainId: n
      });
      return this.viem.writeContract(
        a,
        r,
        "publishDataAndEmitEvents",
        [e, t]
      );
    } catch (n) {
      if (console.log("publishDataAndEmitEvents failure", n), h(n, "Failed to publish data and emit events"), n instanceof Error)
        return n;
    }
    return null;
  }
  /**
   * Register a set of event schemas that can emit EVM logs later referenced by an arbitrary ID
   * @param ids Arbirary identifiers that will be asigned to event schmas
   * @param schemas Unique event schemas that contain an event topic and a specified number of indexed and non-indexed params
   * @returns Transaction hash if successful, Error object where applicable or null in catch all error case
   */
  async registerEventSchemas(e, t) {
    try {
      let n = await this.viem.getChainId(), {
        address: a,
        abi: r
      } = await c({
        internal: "STREAMS",
        chainId: n
      }), s = t.map((o) => {
        let l = o.eventTopic;
        return l.indexOf("0x") === -1 && (l = viem.toEventSelector(l)), {
          params: o.params,
          eventTopic: l
        };
      });
      return this.viem.writeContract(
        a,
        r,
        "registerEventSchemas",
        [e, s]
      );
    } catch (n) {
      if (console.log("registerEventSchemas failure", n), h(n, "Failed to register event schema"), n instanceof Error)
        return n;
    }
    return null;
  }
  /**
   * Emit EVM event logs on-chain for events that have registered schemas on the Somnia streams protocol
   * @param events Somnia stream event ids and associated arguments to emit EVM logs
   * @returns Transaction hash if successful, Error object where applicable or null in catch all error case
   */
  async emitEvents(e) {
    try {
      let t = await this.viem.getChainId(), {
        address: n,
        abi: a
      } = await c({
        internal: "STREAMS",
        chainId: t
      });
      return this.viem.writeContract(
        n,
        a,
        "emitEvents",
        [e]
      );
    } catch (t) {
      if (console.log("emitEvents failure", t), h(t, "Failed to emit events"), t instanceof Error)
        return t;
    }
    return null;
  }
  /**
   * Compute the bytes32 keccak256 hash of the schema - used as the schema identifier
   * @param schema The solidity compatible schema encoded in a string
   * @returns The bytes32 schema ID
   */
  async computeSchemaId(e) {
    try {
      let t = await this.viem.getChainId(), { address: n, abi: a } = await c({
        internal: "STREAMS",
        chainId: t
      });
      return this.viem.readContract(
        n,
        a,
        "computeSchemaId",
        [e]
      );
    } catch (t) {
      console.error(t);
    }
    return null;
  }
  /**
   * Query the contract to check whether a data schema is already registered based on a known schema ID
   * @param schemaId Hex schema ID that is a bytes32 solidity value
   * @returns Boolean denoting registration or null if it was not possible to register that info
   */
  async isDataSchemaRegistered(e) {
    try {
      let t = await this.viem.getChainId(), { address: n, abi: a } = await c({
        internal: "STREAMS",
        chainId: t
      });
      return this.viem.readContract(
        n,
        a,
        "isSchemaRegistered",
        [e]
      );
    } catch (t) {
      console.error(t);
    }
    return null;
  }
  /**
   * Total data points published on-chain by a specific wallet for a given schema
   * @param schemaId Unique hex reference to the schema (bytes32 value)
   * @param publisher Address of the wallet or smart contract that published the data
   * @returns An unsigned integer or null if the information could not be retrieved
   */
  async totalPublisherDataForSchema(e, t) {
    y(t);
    try {
      let n = await this.viem.getChainId(), { address: a, abi: r } = await c({
        internal: "STREAMS",
        chainId: n
      });
      return this.viem.readContract(
        a,
        r,
        "totalPublisherDataForSchema",
        [e, t]
      );
    } catch (n) {
      console.error(n);
    }
    return null;
  }
  /**
   * Given knowledge re total data published under a schema for a publisher, get data in a specified range
   * @param schemaId Unique hex reference to the schema (bytes32 value)
   * @param publisher Address of the wallet or smart contract that published the data
   * @param startIndex BigInt start of the range (inclusive)
   * @param endIndex BigInt end of the range (exclusive)
   * @returns Raw bytes array if the schema is private, decoded data array if schema is valid, error or null when something goes wrong
   */
  async getBetweenRange(e, t, n, a) {
    y(t);
    try {
      let r = await this.viem.getChainId(), { address: s, abi: o } = await c({
        internal: "STREAMS",
        chainId: r
      }), l = await this.viem.readContract(
        s,
        o,
        "getPublisherDataForSchemaInRange",
        [e, t, n, a]
      );
      return this.deserialiseRawData(l, e);
    } catch (r) {
      if (console.log("getBetweenRange failure", r), h(r, "getBetweenRange: Failed to get data"), r instanceof Error)
        return r;
    }
    return null;
  }
  /**
   * Read historical published data for a given schema at a known index
   * @param schemaId Unique schema reference that can be computed from the full schema
   * @param publisher Wallet that published the data
   * @param idx Index of the data in an append only list associated with the data publisher wallet
   * @returns Raw data as a hex string if the schema is private, deserialised data or null if the data does not exist
   */
  async getAtIndex(e, t, n) {
    y(t);
    try {
      let a = await this.viem.getChainId(), { address: r, abi: s } = await c({
        internal: "STREAMS",
        chainId: a
      }), o = await this.viem.readContract(
        r,
        s,
        "getPublisherDataForSchemaAtIndex",
        [e, t, n]
      );
      return this.deserialiseRawData([o], e);
    } catch (a) {
      console.error(a);
    }
    return null;
  }
  /**
   * Fetches the parent schema of another schema which is important metadata when deserialising data associated with a schema that extends a parent schema
   * @param schemaId Hex identifier of the schema being queried
   * @returns A hex value (bytes32) that is fully zero'd if there is no parent or null if the info cannot be retrieved
   */
  async parentSchemaId(e) {
    try {
      let t = await this.viem.getChainId(), { address: n, abi: a } = await c({
        internal: "STREAMS",
        chainId: t
      });
      return this.viem.readContract(
        n,
        a,
        "parentSchemaId",
        [e]
      );
    } catch (t) {
      console.error(t);
    }
    return null;
  }
  /**
   * Query the unique human readable identifier for a schema
   * @param schemaId Hex encoded schema ID computed from the raw schema using computeSchemaId
   * @returns The human readable identifier for a schema
   */
  async schemaIdToId(e) {
    try {
      let t = await this.viem.getChainId(), { address: n, abi: a } = await c({
        internal: "STREAMS",
        chainId: t
      });
      return this.viem.readContract(
        n,
        a,
        "schemaIdToId",
        [e]
      );
    } catch (t) {
      console.error(t);
    }
    return null;
  }
  /**
   * Lookup the Hex schema ID for a given unique human readable identifer
   * @param id Human readable identifier
   * @returns Hex schema id (bytes32 solidity type)
   */
  async idToSchemaId(e) {
    try {
      let t = await this.viem.getChainId(), { address: n, abi: a } = await c({
        internal: "STREAMS",
        chainId: t
      });
      return this.viem.readContract(
        n,
        a,
        "idToSchemaId",
        [e]
      );
    } catch (t) {
      console.error(t);
    }
    return null;
  }
  /**
   * Batch register multiple schemas that can be used to write state to chain
   * @param registrations Array of raw schemas and any parent schemas associated (if extending a schema)
   * @returns Transaction hash if successful, Error if one is present or null if something failed
   */
  async registerDataSchemas(e) {
    try {
      let t = await this.viem.getChainId(), { address: n, abi: a } = await c({
        internal: "STREAMS",
        chainId: t
      });
      return this.viem.writeContract(
        n,
        a,
        "registerSchemas",
        [e.map((r) => ({
          id: r.id,
          schema: r.schema,
          parentSchemaId: r.parentSchemaId ? r.parentSchemaId : T
        }))]
      );
    } catch (t) {
      if (console.log("manageEventEmitter failure", t), h(t, "Failed to manage event emitter"), t instanceof Error)
        return t;
    }
    return null;
  }
  /**
   * Write data to chain using data streams that can be parsed by schemas
   * @param dataStreams Bytes stream array that has unique keys referencing schemas
   * @returns Transaction hash or null if there are issues writing to chain
   */
  async set(e) {
    try {
      let t = await this.viem.getChainId(), { address: n, abi: a } = await c({
        internal: "STREAMS",
        chainId: t
      });
      return this.viem.writeContract(
        n,
        a,
        "esstores",
        [e]
      );
    } catch (t) {
      console.error(t);
    }
    return null;
  }
  /**
   * Fetches all raw, registered public schemas that can be used to deserialise data associated with the schema ids
   * @returns Array of full schemas or null if there was an issue fetching schemas
   */
  async getAllSchemas() {
    try {
      let e = await this.viem.getChainId(), { address: t, abi: n } = await c({
        internal: "STREAMS",
        chainId: e
      });
      return this.viem.readContract(
        t,
        n,
        "getAllSchemas"
      );
    } catch (e) {
      console.error(e);
    }
    return null;
  }
  /**
   * Query Somnia Data streams for all data published by a specific wallet for a given schema
   * @param schemaId Unique schema reference to a public or private schema or the full schema
   * @param publisher Wallet that broadcast the data on-chain
   * @returns A hex array with (raw data) for private schemas, SchemaDecodedItem 2D array for decoded data or null for errors reading from chain
   */
  async getAllPublisherDataForSchema(e, t) {
    y(t);
    try {
      let n = await this.viem.getChainId(), { address: a, abi: r } = await c({
        internal: "STREAMS",
        chainId: n
      }), s = await this.viem.readContract(
        a,
        r,
        "getAllPublisherDataForSchema",
        [e, t]
      );
      return this.deserialiseRawData(s, e);
    } catch (n) {
      console.error(n);
    }
    return null;
  }
  /**
   * Read state from the Somnia streams protocol that was written via set or setAndEmitEvents
   * @param schemaId Unique hex identifier for the schema associated with the raw data written to chain
   * @param publisher Address of the wallet that wrote the data to chain
   * @param key Unique reference to the data being read
   * @returns The raw data
   */
  async getByKey(e, t, n) {
    y(t);
    try {
      let a = await this.viem.getChainId(), { address: r, abi: s } = await c({
        internal: "STREAMS",
        chainId: a
      }), o = await this.viem.readContract(
        r,
        s,
        "publisherDataIndex",
        [e, t, n]
      );
      return this.getAtIndex(
        e,
        t,
        o
      );
    } catch (a) {
      console.error(a);
    }
    return null;
  }
  /**
   * Gets a set of regisered event schemas based on a set of known event schema identifiers assigned at registration
   * @param ids Set of event schema identifiers given to registered event topics
   * @returns Set of event schemas or null if the data cannot be read from chain
   */
  async getEventSchemasById(e) {
    try {
      let t = await this.viem.getChainId(), { address: n, abi: a } = await c({
        internal: "STREAMS",
        chainId: t
      });
      return this.viem.readContract(
        n,
        a,
        "getEventSchemasById",
        [e]
      );
    } catch (t) {
      console.log(t);
    }
    return null;
  }
  /**
   * If there published data for a given schema, this returns the last published data
   * @dev this assumes that last published data is at the end of the array of all publisher data points
   * @param schemaId Unique schema identifier
   * @param publisher Wallet address of the publisher 
   * @returns Raw data from chain if schema is not public, decoded data if it is or null if there were errors reading data
   */
  async getLastPublishedDataForSchema(e, t) {
    try {
      let n = await this.viem.getChainId(), { address: a, abi: r } = await c({
        internal: "STREAMS",
        chainId: n
      }), s = await this.viem.readContract(
        a,
        r,
        "getLastPublishedDataForSchema",
        [e, t]
      );
      return this.deserialiseRawData([s], e);
    } catch (n) {
      console.log(n);
    }
    return null;
  }
  /**
   * Based on the connected viem public client, will return the address, abi and connected chain id
   * @returns Protocol info if there is one defined for the target chain, an error if that was not possible or null in a catch all error scenario
   */
  async getSomniaDataStreamsProtocolInfo() {
    try {
      let e = await this.viem.getChainId(), { address: t, abi: n } = await c({
        internal: "STREAMS",
        chainId: e
      });
      return {
        address: t,
        abi: n,
        chainId: e
      };
    } catch (e) {
      if (console.log(e), e instanceof Error)
        return e;
    }
    return null;
  }
  /**
   * Somnia streams reactivity enabling event subscriptions that bundle any ETH call data
   * @param param0 See SubscriptionInitParams type which defines the events being observed, the eth calls executed and what callback fn to call
   * @returns The subscription identifier and an unsubscribe callback or undefined if the subscription fails to start
   */
  async subscribe({
    somniaStreamsEventId: e,
    ethCalls: t,
    context: n,
    onData: a,
    onError: r,
    eventContractSource: s,
    topicOverrides: o,
    onlyPushChanges: l
  }) {
    try {
      let p = await this.viem.getChainId(), { address: m } = await c({
        internal: "STREAMS",
        chainId: p
      });
      if (this.viem.client.public.transport.type !== "webSocket")
        throw new Error("Invalid public client config - websocket required");
      let d = s || m;
      y(d);
      let u = [];
      if (viem.isAddressEqual(d, m))
        if (!o || o.length === 0) {
          if (!e)
            throw new Error("Somnia streams event ID must be specified");
          let f = await this.getEventSchemasById([e]);
          if (!f)
            throw new Error("Failed to get the event schema");
          if (f.length < 1)
            throw new Error("No event schema returned");
          if (f.length > 1)
            throw new Error("Too many schemas found");
          let [H] = f, { eventTopic: k } = H;
          u.push(k);
        } else
          u = o;
      else {
        if (!o)
          throw new Error("Specified event contract source but no event topic specified");
        u = o;
      }
      return viem.createPublicClient({
        chain: this.viem.client.public.chain,
        transport: viem.webSocket()
        // Defaults to chain's WS URL
      }).transport.subscribe({
        params: [
          "somnia_watch",
          {
            address: d,
            topics: u,
            eth_calls: t,
            context: n,
            push_changes_only: l
          }
        ],
        onData: a,
        onError: r
      });
    } catch (p) {
      console.log(p);
    }
  }
  /**
   * From raw bytes data, deserialise the raw data based on a given public schema
   * @param rawData The array of data that will be deserialised based on the specified schema
   * @param schemaId The bytes32 schema identifier used to lookup the schema that is needed for deserialisation
   * @returns The raw data if the schema is public, the decoded items for each item of raw data or null if there was an issue (catch all)
   */
  async deserialiseRawData(e, t) {
    try {
      let n = await this.viem.getChainId(), { address: a, abi: r } = await c({
        internal: "STREAMS",
        chainId: n
      }), o = (await this.schemaLookup(a, r, t))?.finalSchema;
      if (o) {
        let l = new b(o);
        return e.map((m) => l.decodeData(m));
      }
      return e;
    } catch (n) {
      console.error(n);
    }
    return null;
  }
  /**
   * Request a schema given the schema id used for data publishing and let the SDK take care of schema extensions
   * @param schemaId The bytes32 unique identifier for a base schema
   * @returns Schema info if it is public, Error or null if there is a problem retrieving schema ID
   */
  async getSchemaFromSchemaId(e) {
    try {
      let t = await this.viem.getChainId(), { address: n, abi: a } = await c({
        internal: "STREAMS",
        chainId: t
      }), r = await this.schemaLookup(
        n,
        a,
        e
      );
      if (!r)
        throw new Error(`Unable to do schema lookup on [${e}]`);
      return r;
    } catch (t) {
      if (console.log(t), t instanceof Error)
        return t;
    }
    return null;
  }
  async schemaLookup(e, t, n) {
    if (n.length === 0 || n.trim().length === 0)
      throw new Error("Invalid schema or schema ID (zero data)");
    let a = null, r = true;
    if (n.indexOf("0x") === -1 && n.indexOf("0X") === -1) {
      if (a = await this.computeSchemaId(n), !a)
        return null;
      r = false;
    } else
      a = n;
    let [s, o] = await Promise.all([
      r ? this.viem.readContract(
        e,
        t,
        "schemaReverseLookup",
        [a]
      ) : Promise.resolve(n),
      this.viem.readContract(
        e,
        t,
        "parentSchemaId",
        [a]
      )
    ]), l = null;
    o !== T && (l = await this.viem.readContract(
      e,
      t,
      "schemaReverseLookup",
      [o]
    ), console.log("Parent schema is associated with the schema", { parentSchema: l }));
    let p = s;
    return l && (p = `${p}, ${l}`), p.length === 0 ? (console.warn("Unable to compute final schema"), null) : {
      baseSchema: s,
      finalSchema: p,
      schemaId: a
    };
  }
};

// src/index.ts
var M = class {
  /**
   * Create a new SDK instance
   * @param client Viem wrapper object for consuming the public client and optionally the wallet client for transactions
   */
  constructor(e) {
    this.streams = new S(e);
  }
};

exports.SDK = M;
exports.SchemaEncoder = b;
exports.zeroBytes32 = T;
//# sourceMappingURL=index.cjs.map
//# sourceMappingURL=index.cjs.map