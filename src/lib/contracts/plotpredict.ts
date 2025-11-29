import { Address } from 'viem';

export const FACTORY_ADDRESS = process.env.NEXT_PUBLIC_FACTORY_ADDRESS as Address;
export const POSITION_TOKEN_ADDRESS = process.env.NEXT_PUBLIC_POSITION_TOKEN_ADDRESS as Address;

export const MARKET_FACTORY_ABI = [
  {
    type: 'function',
    name: 'createMarket',
    stateMutability: 'nonpayable',
    inputs: [
      { name: 'question', type: 'string' },
      { name: 'imageUrl', type: 'string' },
      { name: 'lockTime', type: 'uint256' },
    ],
    outputs: [{ name: 'market', type: 'address' }],
  },
  {
    type: 'function',
    name: 'markets',
    stateMutability: 'view',
    inputs: [],
    outputs: [{ name: 'list', type: 'address[]' }],
  },
  {
    type: 'function',
    name: 'marketById',
    stateMutability: 'view',
    inputs: [{ name: 'id', type: 'uint256' }],
    outputs: [{ name: 'market', type: 'address' }],
  },
  {
    type: 'function',
    name: 'positionToken',
    stateMutability: 'view',
    inputs: [],
    outputs: [{ name: '', type: 'address' }],
  },
] as const;

export const MARKET_ABI = [
  { type: 'function', name: 'placeYes', stateMutability: 'payable', inputs: [], outputs: [] },
  { type: 'function', name: 'placeNo', stateMutability: 'payable', inputs: [], outputs: [] },
  { type: 'function', name: 'lockMarket', stateMutability: 'nonpayable', inputs: [], outputs: [] },
  { type: 'function', name: 'resolveYes', stateMutability: 'nonpayable', inputs: [], outputs: [] },
  { type: 'function', name: 'resolveNo', stateMutability: 'nonpayable', inputs: [], outputs: [] },
  { type: 'function', name: 'claim', stateMutability: 'nonpayable', inputs: [], outputs: [] },
  {
    type: 'function',
    name: 'getInfo',
    stateMutability: 'view',
    inputs: [],
    outputs: [
      {
        type: 'tuple',
        components: [
          { name: '_id', type: 'uint256' },
          { name: '_question', type: 'string' },
          { name: '_imageUrl', type: 'string' },
          { name: '_lockTime', type: 'uint256' },
          { name: '_totalYes', type: 'uint256' },
          { name: '_totalNo', type: 'uint256' },
          { name: '_totalPool', type: 'uint256' },
          { name: '_resolved', type: 'bool' },
          { name: '_outcome', type: 'uint8' },
        ],
      },
    ],
  },
] as const;

export const ERC1155_ABI = [
  {
    type: 'function',
    name: 'balanceOf',
    stateMutability: 'view',
    inputs: [
      { name: 'account', type: 'address' },
      { name: 'id', type: 'uint256' },
    ],
    outputs: [{ name: '', type: 'uint256' }],
  },
] as const;

export const idYes = (marketId: bigint | number) => BigInt(marketId) * BigInt(2) + BigInt(1);
export const idNo = (marketId: bigint | number) => BigInt(marketId) * BigInt(2) + BigInt(2);
