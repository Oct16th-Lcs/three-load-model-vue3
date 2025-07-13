import { Vector3 } from 'three';
import { resourceList } from '@/config/index.ts'

export const rooms = [
  {
    name: '客厅',
    key: 'living-room',
    url: resourceList[0],
    showSwitch: true,
    position: new Vector3(0, 0, 0),
    interactivePoints: [
      {
        key: 'tv',
        value: '电视机',
        description: '智能电视',
        cover: resourceList[4],
        position: new Vector3(-6, 2, -8),
      },
      {
        key: 'fridge',
        value: '冰箱',
        description: '豪华冰箱',
        cover: resourceList[5],
        position: new Vector3(-12, 4, 9),
      },
      {
        key: 'sofa',
        value: '沙发',
        description: '舒适沙发',
        cover: resourceList[6],
        position: new Vector3(6, 0, -8),
      },
    ],
  },
  {
    name: '卧室',
    key: 'bed-room',
    url: resourceList[1],
    showSwitch: true,
    position: new Vector3(-32, 0, 0),
    interactivePoints: [
      {
        key: 'bed',
        value: '床',
        description: '温暖的床',
        cover: resourceList[7],
        position: new Vector3(-38, 2, -14),
      },
    ],
  },
  {
    name: '书房',
    key: 'study-room',
    url: resourceList[2],
    showSwitch: true,
    position: new Vector3(32, 0, 0),
    interactivePoints: [
      {
        key: 'art',
        value: '艺术品',
        description: '绝版作品',
        cover: resourceList[8],
        position: new Vector3(42, 6, -8),
      },
    ]
  },
];
