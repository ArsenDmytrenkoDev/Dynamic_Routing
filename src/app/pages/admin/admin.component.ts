import { FlatTreeControl } from '@angular/cdk/tree';
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatExpansionPanel } from '@angular/material/expansion';
import { MatSidenav } from '@angular/material/sidenav';
import {
  MatTreeFlatDataSource,
  MatTreeFlattener,
} from '@angular/material/tree';
import { Subject, take, takeUntil } from 'rxjs';
import { ConfirmationDialogComponent } from 'src/app/components/confirmation-dialog/confirmation-dialog.component';
import {
  TreeDatabase,
  TodoItemFlatNode,
  TodoItemNode,
} from 'src/app/services/tree-database.service';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss'],
})
export class AdminComponent implements OnInit, OnDestroy {
  @ViewChild('sidenav') public sidenav!: MatSidenav;
  @ViewChild('expansionPanel') public expansionPanel!: MatExpansionPanel;

  public selectedNode!: TodoItemNode | null;

  public nodeForm!: FormGroup;

  public get itemControl(): AbstractControl {
    return this.nodeForm.get('item') as AbstractControl;
  }

  public treeControl!: FlatTreeControl<TodoItemFlatNode>;
  public dataSource!: MatTreeFlatDataSource<TodoItemNode, TodoItemFlatNode>;

  /** Map from flat node to nested node. This helps us finding the nested node to be modified */
  private flatNodeMap = new Map<TodoItemFlatNode, TodoItemNode>();
  /** Map from nested node to flattened node. This helps us to keep the same object for selection */
  private nestedNodeMap = new Map<TodoItemNode, TodoItemFlatNode>();
  private treeFlattener!: MatTreeFlattener<TodoItemNode, TodoItemFlatNode>;

  private destroy$: Subject<void> = new Subject<void>();

  constructor(
    public _database: TreeDatabase,
    private fb: FormBuilder,
    private dialog: MatDialog
  ) {
    this.initRoutesTree();
  }

  public ngOnInit(): void {
    this.initForm();
  }

  public ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  public onNodeClick(node: TodoItemFlatNode | TodoItemNode): void {
    console.log(node);
    const [itemNode, flatNode] = this.identifyNode(node);

    this.treeControl.expand(flatNode);

    if (this.sidenav.opened && this.selectedNode === itemNode) {
      // Same node clicked when sidenav ws already open
      this.sidenav.close().then(() => {
        this.expansionPanel.open();
        this.selectedNode = null;
      });
    } else if (this.sidenav.opened) {
      // New node clicked when sidenav ws already open
      this.sidenav.close().then(() => {
        this.expansionPanel.open();
        this.selectedNode = itemNode;
        this.nodeForm.patchValue({ item: this.selectedNode.item });
        this.setFormEditAccess(!itemNode.locked);
        this.sidenav.open();
      });
    } else {
      // Node clicked when sidenav ws closed
      this.selectedNode = itemNode;
      this.nodeForm.patchValue({ item: this.selectedNode.item });
      this.setFormEditAccess(!itemNode.locked);
      this.sidenav.open();
    }
  }

  public addNewItem(node: TodoItemNode) {
    this._database.insertItem(node!);
  }

  public removeNode(event: any, node: TodoItemNode): void {
    event.stopPropagation();

    let flatNode = this.nestedNodeMap.get(node) as TodoItemFlatNode;

    const parentNode = this.flatNodeMap.get(this.getParentNode(flatNode)!);

    let confirmationText =
      node.children.length === 0
        ? 'Do you want to delete current route?'
        : 'This route has nested routes. Do you still want to delete it?';

    const dialog = this.dialog.open(ConfirmationDialogComponent, {
      data: { confirmationText },
    });
    dialog
      .afterClosed()
      .pipe(take(1))
      .subscribe((data) => {
        if (!data?.confirmed) return;

        if (node === this.selectedNode) {
          this.sidenav.close().then(() => {
            this._database.removeNode(parentNode!, node.item);
          });
          return;
        }

        this._database.removeNode(parentNode!, node.item);
      });
  }

  public canAddNewNode(node: TodoItemNode): boolean {
    return (this.nestedNodeMap.get(node) as TodoItemFlatNode).level === 0 || !node.locked;
  }

  private updateItem(node: TodoItemNode, item: string) {
    let flatNode = this.nestedNodeMap.get(node) as TodoItemFlatNode;
    const parentNode = this.flatNodeMap.get(this.getParentNode(flatNode)!);
    this._database.updateItem(parentNode!, node, item);
  }

  private identifyNode(
    node: TodoItemFlatNode | TodoItemNode
  ): [TodoItemNode, TodoItemFlatNode] {
    let itemNode: TodoItemNode;
    let flatNode: TodoItemFlatNode;
    if (node instanceof TodoItemFlatNode) {
      itemNode = this.flatNodeMap.get(node) as TodoItemNode;
      flatNode = node;
    } else {
      itemNode = node;
      flatNode = this.nestedNodeMap.get(node) as TodoItemFlatNode;
    }
    return [itemNode, flatNode];
  }

  private getParentNode(node: TodoItemFlatNode): TodoItemFlatNode | null {
    const currentLevel = this.getLevel(node);

    if (currentLevel < 1) {
      return null;
    }

    const startIndex = this.treeControl.dataNodes.indexOf(node) - 1;

    for (let i = startIndex; i >= 0; i--) {
      const currentNode = this.treeControl.dataNodes[i];

      if (this.getLevel(currentNode) < currentLevel) {
        return currentNode;
      }
    }
    return null;
  }

  private initForm(): void {
    this.nodeForm = this.fb.group({
      item: [''],
    });

    this.itemControl.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe((value) => {
        if (value === this.selectedNode?.item) return;

        this.updateItem(this.selectedNode!, value);
      });
  }

  private setFormEditAccess(editable: boolean): void {
    if (editable) {
      this.itemControl.enable();
    } else {
      this.itemControl.disable();
    }
  }

  private initRoutesTree(): void {
    this.treeFlattener = new MatTreeFlattener(
      this.transformer,
      this.getLevel,
      this.isExpandable,
      this.getChildren
    );
    this.treeControl = new FlatTreeControl<TodoItemFlatNode>(
      this.getLevel,
      this.isExpandable
    );
    this.dataSource = new MatTreeFlatDataSource(
      this.treeControl,
      this.treeFlattener
    );

    this._database.dataChange
      .pipe(takeUntil(this.destroy$))
      .subscribe((data: any) => {
        this.dataSource.data = data;
        console.log(data);

        if (this._database.lastUpdatedNode) {
          const updatedFlatNode = this.nestedNodeMap.get(this._database.lastUpdatedNode) as TodoItemFlatNode;
          this.treeControl.expand(updatedFlatNode)
        }
     });
  }

  /**
   * Transformer to convert nested node to flat node. Record the nodes in maps for later use.
   */
  private transformer = (node: TodoItemNode, level: number) => {
    const existingNode = this.nestedNodeMap.get(node);
    const flatNode =
      existingNode && existingNode.item === node.item
        ? existingNode
        : new TodoItemFlatNode();
    flatNode.item = node.item;
    flatNode.level = level;
    flatNode.locked = node.locked;
    flatNode.expandable = !!node.children?.length;
    flatNode.isValid = node.isValid;
    this.flatNodeMap.set(flatNode, node);
    this.nestedNodeMap.set(node, flatNode);
    return flatNode;
  };

  private getLevel(node: TodoItemFlatNode): number {
    return node.level;
  }

  private isExpandable(node: TodoItemFlatNode): boolean {
    return node.expandable;
  }

  private getChildren(node: TodoItemNode): TodoItemNode[] {
    return node.children;
  }
}
