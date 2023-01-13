import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

const TREE_DATA = {
  'Public*': {
    'Sign Up*': {},
    'Sign In*': {},
    'FAQ*': {},
  },
  'Private*': {
    'Admin*': {},
  },
};

const TEST_TREE_DATA = [
  {
    isValid: true,
    children: [],
    item: 'Public',
    locked: true,
  },
];

export class TodoItemNode {
  children!: TodoItemNode[];
  item!: string;
  locked!: boolean;
  isValid!: boolean;
  treeItemReference!: {[index: string]: any};
  treeItemReferenceKey!: string;
}

export class TodoItemFlatNode {
  item!: string;
  level!: number;
  expandable!: boolean;
  locked!: boolean;
  isValid!: boolean;
}

// TODO: Backend checking
@Injectable({
  providedIn: 'root',
})
export class TreeDatabase {
  public dataChange = new BehaviorSubject<TodoItemNode[]>([]);
  public lastUpdatedNode!: TodoItemNode;
  public isValid = true;

  public get data(): TodoItemNode[] {
    return this.dataChange.value;
  }

  constructor() {
    this.initialize();
  }

  public insertItem(parent: TodoItemNode) {
    if (parent.children) {
      const item = `New Route ${parent.children.length + 1}`;

      parent.children.push({
        item,
        children: [],
        locked: false,
        isValid: true,
        treeItemReference: parent.treeItemReference[parent.treeItemReferenceKey],
        treeItemReferenceKey: item,
      } as TodoItemNode);

      parent.treeItemReference[parent.treeItemReferenceKey][item] = {};

      this.checkNodeTreeValidity(parent);
      this.dataChange.next(this.data);
    }
  }

  public updateItem(
    parentNode: TodoItemNode,
    node: TodoItemNode,
    name: string
  ) {
    this.lastUpdatedNode = node;
    node.item = name;

    const newKey = `${name}${node.locked ? '*' : ''}`
    const oldKey = node.treeItemReferenceKey;
    delete Object.assign(node.treeItemReference!, {
      [newKey]: node.treeItemReference[oldKey],
    })[oldKey!];
    node.treeItemReferenceKey = newKey;

    this.checkNodeTreeValidity(parentNode);
    this.dataChange.next(this.data);
  }

  public removeNode(parentNode: TodoItemNode, item: string) {
    const nodeCollection = parentNode?.children || this.data;
    const nodeToRemoveIndex = nodeCollection.findIndex(
      (node: TodoItemNode) => node.item === item
    );

    const node = nodeCollection[nodeToRemoveIndex];
    delete node.treeItemReference[node.treeItemReferenceKey];

    nodeCollection.splice(nodeToRemoveIndex, 1);
    this.dataChange.next(this.data);
  }

  private checkNodeTreeValidity(node: TodoItemNode) {
    const nodeCounter: { [index: string]: TodoItemNode[] } = {};
    node.children.forEach((child) => {
      if (nodeCounter[child.item]) {
        nodeCounter[child.item].push(child);
      } else {
        nodeCounter[child.item] = [child];
      }
    });

    this.isValid = true;

    for (const nodeArray of Object.values(nodeCounter)) {
      if (nodeArray?.length > 1) {
        nodeArray.forEach((node) => (node.isValid = false));
        this.isValid = false;
      } else {
        nodeArray.forEach((node) => (node.isValid = true));
      }
    }
  }

  private initialize(): void {
    let treeData: { [key: string]: any };

    const savedTreeData = localStorage.getItem('tree');
    if (savedTreeData) {
      treeData = JSON.parse(savedTreeData);
    } else {
      treeData = TREE_DATA;
    }

    const data = this.buildFileTree(treeData, 0);

    this.dataChange.next(data);
  }

  private buildFileTree(
    obj: { [key: string]: any },
    level: number
  ): TodoItemNode[] {
    return Object.keys(obj).reduce<TodoItemNode[]>((accumulator, key) => {
      const node = new TodoItemNode();
      let cleanedKey = '';

      const lockedIndex = key.indexOf('*');
      if (lockedIndex !== -1) {
        cleanedKey = key.slice(0, lockedIndex);
        // delete Object.assign(obj, { [cleanedKey]: obj[key] })[key];
        node.locked = true;
      } else {
        cleanedKey = key;
        node.locked = false;
      }

      const value = obj[key];
      node.item = cleanedKey;
      node.treeItemReference = obj;
      node.treeItemReferenceKey = key;
      node.isValid = true;

      if (value != null) {
        if (typeof value === 'object') {
          node.children = this.buildFileTree(value, level + 1);
        } else {
          node.item = value;
        }
      }

      return accumulator.concat(node);
    }, []);
  }

  public saveTreeData(tree: { [key: string]: any }): void {
    localStorage.setItem('tree', JSON.stringify(tree));
  }

  private createSimplifiedTreeObject(tree: { [key: string]: any }): void {
    const simplifiedTree: { [key: string]: any } = {};
    for (const key of Object.keys(tree)) {
      const node = tree[key];

    }
  }
}
