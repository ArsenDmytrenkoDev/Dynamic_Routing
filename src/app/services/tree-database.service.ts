import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export class TodoItemNode {
  children!: TodoItemNode[];
  item!: string;
}

const TREE_DATA = {
  Groceries: {
    'Almond Meal flour': {},
    'Organic eggs': {},
    'Protein Powder': {},
    Fruits: {
      Apple: {},
      Berries: {
        Blueberry: {},
        Raspberry: {},
      },
      Orange: {},
    },
  },
  Reminders: {
    'Cook dinner': {},
    'Read the Material Design spec': {},
    'Upgrade Application to Angular': {},
  },
};

export class TodoItemFlatNode {
  item!: string;
  level!: number;
  expandable!: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class TreeDatabase {
  dataChange = new BehaviorSubject<TodoItemNode[]>([]);

  get data(): TodoItemNode[] {
    return this.dataChange.value;
  }

  constructor() {
    this.initialize();
  }

  initialize() {
    const data = this.buildFileTree(TREE_DATA, 0);

    this.dataChange.next(data);
  }

  buildFileTree(obj: { [key: string]: any }, level: number): TodoItemNode[] {
    return Object.keys(obj).reduce<TodoItemNode[]>((accumulator, key) => {
      const value = obj[key];
      const node = new TodoItemNode();
      node.item = key;

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

  insertItem(parent: TodoItemNode, name: string) {
    if (parent.children) {
      parent.children.push({ item: name } as TodoItemNode);
      this.dataChange.next(this.data);
    }
  }

  updateItem(node: TodoItemNode, name: string) {
    node.item = name;
    node.children = [];
    this.dataChange.next(this.data);
  }

  removeNode(parentNode: TodoItemNode, item: string) {
    const nodeCollection = parentNode?.children || this.data;
    const nodeToRemoveIndex = nodeCollection.findIndex(
      (node: TodoItemNode) => node.item === item
    );
    nodeCollection.splice(nodeToRemoveIndex, 1);
    this.dataChange.next(this.data);
  }
}
