import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

const TEST_TREE_DATA: any[] = [
  {
    isValid: true,
    children: [
      {
        isValid: true,
        children: [],
        item: 'Sign Up',
        locked: true,
      },
      {
        isValid: true,
        children: [],
        item: 'Sign In',
        locked: true,
      },
      {
        isValid: true,
        children: [],
        item: 'FAQ',
        locked: true,
      },
    ],
    item: 'Public',
    locked: true,
  },
  {
    isValid: true,
    children: [
      {
        isValid: true,
        children: [],
        item: 'Admin',
        locked: true,
      },
    ],
    item: 'Private',
    locked: true,
  },
];

export class TodoItemNode {
  children!: TodoItemNode[];
  item!: string;
  locked!: boolean;
  isValid!: boolean;
  index!: number;
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
    // this.initialize();
    const data = this.buildFileTree(TEST_TREE_DATA, 0);

    this.dataChange.next(data);
  }

  public insertItem(parent: TodoItemNode) {
    if (parent.children) {
      const item = `New Route ${parent.children.length + 1}`;

      parent.children.push({
        item,
        children: [],
        locked: false,
        isValid: true,
        index: parent.children.length,
      } as TodoItemNode);

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

    this.checkNodeTreeValidity(parentNode);
    this.dataChange.next(this.data);
  }

  public removeNode(parentNode: TodoItemNode, index: number) {
    const nodeCollection = parentNode?.children || this.data;

    nodeCollection.splice(index, 1);

    this.checkNodeTreeValidity(parentNode);
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

  // private initialize(): void {
  //   let treeData: [any];

  //   const savedTreeData = localStorage.getItem('tree');
  //   if (savedTreeData) {
  //     treeData = JSON.parse(savedTreeData);
  //   } else {
  //     treeData = TEST_TREE_DATA;
  //   }

  //   const data = this.buildFileTree(treeData, 0);

  //   this.dataChange.next(data);
  // }

  private buildFileTree(
    obj: any[],
    level: number
  ): TodoItemNode[] {
    return obj.reduce<TodoItemNode[]>((accumulator, nodeItem, index) => {
      const node = new TodoItemNode();

      Object.assign(node, nodeItem);
      node.index = index;

      if (node.children.length) {
        this.buildFileTree(nodeItem.children, level + 1);
      }

      return accumulator.concat(node);
    }, []);
  }

  public saveTreeData(tree: { [key: string]: any }): void {
    localStorage.setItem('tree', JSON.stringify(tree));
  }
}
